create extension if not exists pg_cron;
create extension if not exists pg_net;
create function loc_private.tick_drafts() returns void language plpgsql security invoker set search_path='' as $$
begin
  if exists(select 1 from loc_private.workspace w, jsonb_array_elements(w.state->'leagues') l
    where l->>'status'='live' and (l->>'deadline')::numeric<=extract(epoch from now())*1000) then
    perform net.http_get(url:='https://nvvjzzsmpuebyenbxuvo.supabase.co/functions/v1/loc-api/api/state',timeout_milliseconds:=10000);
  end if;
end;
$$;
revoke all on function loc_private.tick_drafts() from public,anon,authenticated;
select cron.schedule('loc-public-draft-clock','10 seconds','select loc_private.tick_drafts()');
create table loc_private.workspace_backups (
 captured_at timestamptz primary key default now(), version bigint not null, state jsonb not null
);
alter table loc_private.workspace_backups enable row level security;
revoke all on loc_private.workspace_backups from public,anon,authenticated;
create function loc_private.backup_workspace() returns void language plpgsql security invoker set search_path='' as $$
begin
 insert into loc_private.workspace_backups(version,state) select version,state from loc_private.workspace;
 delete from loc_private.workspace_backups where captured_at<now()-interval '7 days';
end;
$$;
revoke all on function loc_private.backup_workspace() from public,anon,authenticated;
select cron.schedule('loc-public-daily-snapshot','17 4 * * *','select loc_private.backup_workspace()');
