-- Bind the one-time platform-admin bootstrap to an owner selected by the
-- database administrator. This table is deliberately not exposed to API roles.
create table private.platform_admin_bootstrap_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  consumed_at timestamptz
);

revoke all on table private.platform_admin_bootstrap_allowlist from public, anon, authenticated;

create or replace function private.bootstrap_first_admin()
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not private.is_verified_user(v_user_id) then
    raise exception 'A verified account is required';
  end if;

  perform pg_advisory_xact_lock(hashtext('loc-bootstrap-first-admin'));

  if exists (select 1 from public.platform_roles) then
    raise exception 'Platform administration has already been initialized';
  end if;

  if not exists (
    select 1 from private.platform_admin_bootstrap_allowlist
    where user_id = v_user_id and consumed_at is null
  ) then
    raise exception 'This account is not authorized for initial platform administration';
  end if;

  insert into public.platform_roles (user_id, role, granted_by)
  values (v_user_id, 'admin', v_user_id);
  update private.platform_admin_bootstrap_allowlist
  set consumed_at = now()
  where user_id = v_user_id and consumed_at is null;
  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (v_user_id, 'bootstrap', 'platform_admin', v_user_id::text);
end;
$$;
