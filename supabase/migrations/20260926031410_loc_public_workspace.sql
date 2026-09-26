-- Additive storage for the current LOC private beta. No local accounts are imported.
create schema if not exists loc_private;
revoke all on schema loc_private from public, anon, authenticated;
grant usage on schema loc_private to service_role;
create table loc_private.workspace (
  singleton boolean primary key default true check(singleton),
  version bigint not null default 0,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table loc_private.workspace enable row level security;
grant select,update on loc_private.workspace to service_role;
insert into loc_private.workspace(state) values ('{"users":[],"sessions":{},"leagues":[],"invites":[],"revision":0}');
create table loc_private.request_limits (
  bucket text primary key,
  window_start timestamptz not null,
  attempts integer not null
);
alter table loc_private.request_limits enable row level security;
grant select,insert,update,delete on loc_private.request_limits to service_role;

create function public.loc_load_state() returns jsonb language sql security invoker set search_path='' as $$
  select jsonb_build_object('version',version,'state',state) from loc_private.workspace where singleton;
$$;
create function public.loc_save_state(expected bigint,value jsonb) returns boolean language plpgsql security invoker set search_path='' as $$
begin
  update loc_private.workspace set state=value,version=version+1,updated_at=now() where singleton and version=expected;
  return found;
end;
$$;
create function public.loc_rate_limit(bucket text,ceiling integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare hits integer;
begin
  delete from loc_private.request_limits where window_start < now()-interval '2 minutes';
  insert into loc_private.request_limits as r values(bucket,date_trunc('minute',now()),1)
  on conflict on constraint request_limits_pkey do update set
    attempts=case when r.window_start=date_trunc('minute',now()) then r.attempts+1 else 1 end,
    window_start=date_trunc('minute',now()) returning attempts into hits;
  return hits<=ceiling;
end;
$$;
revoke all on function public.loc_load_state() from public,anon,authenticated;
revoke all on function public.loc_save_state(bigint,jsonb) from public,anon,authenticated;
revoke all on function public.loc_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.loc_load_state() to service_role;
grant execute on function public.loc_save_state(bigint,jsonb) to service_role;
grant execute on function public.loc_rate_limit(text,integer) to service_role;
