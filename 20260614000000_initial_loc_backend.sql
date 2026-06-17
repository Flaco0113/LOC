create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create extension if not exists citext with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username extensions.citext not null unique,
  first_name text not null default '',
  last_name text not null default '',
  time_zone text not null default 'America/New_York',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username::text ~ '^[A-Za-z0-9_]{3,30}$')
);

create table public.platform_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'sports_editor')),
  granted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.sports (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  competitor_type text not null check (competitor_type in ('team', 'driver', 'organization', 'golfer')),
  display_order smallint not null unique check (display_order > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competition_editions (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id) on delete restrict,
  name text not null,
  season_year integer not null check (season_year between 2000 and 2200),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'active', 'complete', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sport_id, season_year, name)
);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references public.sports(id) on delete restrict,
  name text not null,
  short_name text,
  abbreviation text,
  location text,
  logo_url text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sport_id, name)
);

create table public.competition_entries (
  id uuid primary key default gen_random_uuid(),
  competition_edition_id uuid not null references public.competition_editions(id) on delete cascade,
  competitor_id uuid not null references public.competitors(id) on delete restrict,
  seed integer check (seed is null or seed > 0),
  current_record text,
  current_ranking integer check (current_ranking is null or current_ranking > 0),
  provider_key text,
  eligible boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (competition_edition_id, competitor_id),
  unique (competition_edition_id, provider_key)
);

create table public.competition_results (
  id uuid primary key default gen_random_uuid(),
  competition_entry_id uuid not null unique references public.competition_entries(id) on delete cascade,
  placement integer check (placement between 1 and 999),
  advancement_level integer not null default 0 check (advancement_level >= 0),
  elimination_margin numeric,
  elimination_offense numeric,
  is_champion boolean not null default false,
  is_runner_up boolean not null default false,
  status_text text,
  source text not null default 'manual',
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'rejected')),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint competition_results_finish_check check (not (is_champion and is_runner_up)),
  constraint competition_results_approval_check check (
    (approval_status = 'approved' and approved_by is not null and approved_at is not null)
    or approval_status <> 'approved'
  )
);

create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 80),
  description text not null default '',
  season_year integer not null check (season_year between 2000 and 2200),
  capacity smallint not null check (capacity between 4 and 12),
  commissioner_id uuid not null references public.profiles(id) on delete restrict,
  visibility text not null default 'private' check (visibility = 'private'),
  status text not null default 'forming' check (status in ('forming', 'draft_scheduled', 'drafting', 'active', 'complete', 'locked', 'cancelled')),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'manager' check (role in ('commissioner', 'manager')),
  status text not null default 'active' check (status in ('active', 'removed', 'left')),
  draft_position smallint check (draft_position is null or draft_position > 0),
  joined_at timestamptz not null default now(),
  removed_at timestamptz,
  primary key (league_id, user_id),
  unique (league_id, draft_position)
);

create unique index league_one_commissioner_idx
  on public.league_members (league_id)
  where role = 'commissioner' and status = 'active';

create table public.league_invitations (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  email extensions.citext not null,
  invited_by uuid not null references public.profiles(id) on delete restrict,
  token uuid not null default gen_random_uuid() unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_by uuid references public.profiles(id) on delete set null,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index league_pending_invitation_idx
  on public.league_invitations (league_id, lower(email::text))
  where status = 'pending';

create table public.league_sports (
  league_id uuid not null references public.leagues(id) on delete cascade,
  competition_edition_id uuid not null references public.competition_editions(id) on delete restrict,
  draft_order smallint not null check (draft_order > 0),
  created_at timestamptz not null default now(),
  primary key (league_id, competition_edition_id),
  unique (league_id, draft_order)
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null unique references public.leagues(id) on delete cascade,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'paused', 'complete', 'reset', 'cancelled')),
  scheduled_at timestamptz not null,
  pick_timer_seconds integer not null default 60 check (pick_timer_seconds between 15 and 600),
  current_pick integer not null default 1 check (current_pick > 0),
  pick_expires_at timestamptz,
  paused_at timestamptz,
  version bigint not null default 1,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.draft_participants (
  draft_id uuid not null references public.drafts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete restrict,
  pick_position smallint not null check (pick_position > 0),
  created_at timestamptz not null default now(),
  primary key (draft_id, user_id),
  unique (draft_id, pick_position)
);

create table public.draft_picks (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.drafts(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete restrict,
  competition_entry_id uuid not null references public.competition_entries(id) on delete restrict,
  competition_edition_id uuid not null references public.competition_editions(id) on delete restrict,
  overall_pick integer not null check (overall_pick > 0),
  round_number integer not null check (round_number > 0),
  selection_method text not null default 'manual' check (selection_method in ('manual', 'queue_autopick', 'best_available_autopick', 'commissioner')),
  picked_at timestamptz not null default now(),
  corrected_at timestamptz,
  corrected_by uuid references public.profiles(id) on delete set null,
  unique (draft_id, overall_pick),
  unique (draft_id, competition_entry_id),
  unique (draft_id, user_id, competition_edition_id)
);

create table public.draft_queue_items (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.drafts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  competition_entry_id uuid not null references public.competition_entries(id) on delete cascade,
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (draft_id, user_id, competition_entry_id),
  unique (draft_id, user_id, position)
);

create table public.draft_messages (
  id bigint generated by default as identity primary key,
  draft_id uuid not null references public.drafts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create table public.draft_events (
  id bigint generated by default as identity primary key,
  draft_id uuid not null references public.drafts(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.scoring_rules (
  id uuid primary key default gen_random_uuid(),
  rule_type text not null check (rule_type in ('placement', 'bonus', 'tiebreaker')),
  rule_key text not null unique,
  label text not null,
  placement integer,
  points numeric(8,2),
  priority smallint,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scoring_rules_shape check (
    (rule_type = 'placement' and placement is not null and points is not null and priority is null)
    or (rule_type = 'bonus' and placement is null and points is not null and priority is null)
    or (rule_type = 'tiebreaker' and placement is null and points is null and priority is not null)
  )
);

create table public.score_entries (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  draft_pick_id uuid not null references public.draft_picks(id) on delete cascade,
  competition_result_id uuid references public.competition_results(id) on delete set null,
  rule_key text references public.scoring_rules(rule_key) on delete restrict,
  entry_type text not null check (entry_type in ('placement', 'champion_bonus', 'runner_up_bonus', 'adjustment')),
  points numeric(8,2) not null,
  reason text,
  source text not null default 'system' check (source in ('system', 'admin')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index score_entries_system_rule_idx
  on public.score_entries (draft_pick_id, rule_key)
  where source = 'system';

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.league_activity (
  id bigint generated by default as identity primary key,
  league_id uuid not null references public.leagues(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  message text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated by default as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  league_id uuid references public.leagues(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index competition_editions_sport_idx on public.competition_editions(sport_id, season_year);
create index competition_entries_edition_idx on public.competition_entries(competition_edition_id, eligible);
create index competitors_sport_idx on public.competitors(sport_id, active);
create index league_members_user_idx on public.league_members(user_id, status);
create index league_invitations_email_idx on public.league_invitations(lower(email::text), status);
create index league_sports_edition_idx on public.league_sports(competition_edition_id);
create index draft_picks_user_idx on public.draft_picks(draft_id, user_id);
create index draft_queue_user_idx on public.draft_queue_items(draft_id, user_id, position);
create index draft_messages_draft_idx on public.draft_messages(draft_id, created_at);
create index score_entries_league_idx on public.score_entries(league_id, draft_pick_id);
create index notifications_user_idx on public.notifications(user_id, created_at desc);
create index league_activity_league_idx on public.league_activity(league_id, created_at desc);
create index audit_logs_league_idx on public.audit_logs(league_id, created_at desc);

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger sports_set_updated_at before update on public.sports
for each row execute function private.set_updated_at();
create trigger editions_set_updated_at before update on public.competition_editions
for each row execute function private.set_updated_at();
create trigger competitors_set_updated_at before update on public.competitors
for each row execute function private.set_updated_at();
create trigger entries_set_updated_at before update on public.competition_entries
for each row execute function private.set_updated_at();
create trigger results_set_updated_at before update on public.competition_results
for each row execute function private.set_updated_at();
create trigger leagues_set_updated_at before update on public.leagues
for each row execute function private.set_updated_at();
create trigger drafts_set_updated_at before update on public.drafts
for each row execute function private.set_updated_at();
create trigger scoring_rules_set_updated_at before update on public.scoring_rules
for each row execute function private.set_updated_at();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  candidate_username text;
begin
  candidate_username := coalesce(
    nullif(regexp_replace(new.raw_user_meta_data ->> 'username', '[^A-Za-z0-9_]', '', 'g'), ''),
    'user_' || substr(replace(new.id::text, '-', ''), 1, 12)
  );

  if char_length(candidate_username) < 3 then
    candidate_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 12);
  end if;

  while exists (select 1 from public.profiles where username = candidate_username) loop
    candidate_username := left(candidate_username, 23) || '_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
  end loop;

  insert into public.profiles (id, username, first_name, last_name, time_zone)
  values (
    new.id,
    candidate_username,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'time_zone', 'America/New_York')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create function private.is_verified_user(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, auth
as $$
  select exists (
    select 1 from auth.users
    where id = p_user_id and email_confirmed_at is not null and deleted_at is null
  );
$$;

create function private.is_platform_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.platform_roles
    where user_id = p_user_id and role in ('admin', 'sports_editor')
  );
$$;

create function private.is_league_member(p_league_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.league_members
    where league_id = p_league_id and user_id = p_user_id and status = 'active'
  );
$$;

create function private.is_league_commissioner(p_league_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.leagues
    where id = p_league_id and commissioner_id = p_user_id
  );
$$;

create function private.current_email()
returns text
language sql
stable
set search_path = pg_catalog, auth
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create function private.create_league(
  p_name text,
  p_description text,
  p_season_year integer,
  p_capacity smallint,
  p_competition_edition_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_league_id uuid;
  v_edition_id uuid;
  v_order smallint := 0;
begin
  if v_user_id is null or not private.is_verified_user(v_user_id) then
    raise exception 'A verified account is required';
  end if;
  if coalesce(array_length(p_competition_edition_ids, 1), 0) = 0 then
    raise exception 'Select at least one competition';
  end if;
  if array_length(p_competition_edition_ids, 1) <> (
    select count(distinct x) from unnest(p_competition_edition_ids) x
  ) then
    raise exception 'Duplicate competitions are not allowed';
  end if;

  insert into public.leagues (name, description, season_year, capacity, commissioner_id)
  values (trim(p_name), coalesce(p_description, ''), p_season_year, p_capacity, v_user_id)
  returning id into v_league_id;

  insert into public.league_members (league_id, user_id, role, status)
  values (v_league_id, v_user_id, 'commissioner', 'active');

  foreach v_edition_id in array p_competition_edition_ids loop
    v_order := v_order + 1;
    insert into public.league_sports (league_id, competition_edition_id, draft_order)
    select v_league_id, ce.id, v_order
    from public.competition_editions ce
    where ce.id = v_edition_id and ce.season_year = p_season_year;
    if not found then
      raise exception 'Competition edition % is invalid for season %', v_edition_id, p_season_year;
    end if;
  end loop;

  insert into public.league_activity (league_id, actor_id, event_type, message)
  values (v_league_id, v_user_id, 'league_created', 'League created.');
  insert into public.audit_logs (actor_id, league_id, action, entity_type, entity_id)
  values (v_user_id, v_league_id, 'create', 'league', v_league_id::text);
  return v_league_id;
end;
$$;

create function private.accept_invitation(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := private.current_email();
  v_invite public.league_invitations%rowtype;
  v_member_count integer;
begin
  if v_user_id is null or not private.is_verified_user(v_user_id) then
    raise exception 'A verified account is required';
  end if;

  select * into v_invite
  from public.league_invitations
  where token = p_token
  for update;

  if not found or v_invite.status <> 'pending' then
    raise exception 'Invitation is not available';
  end if;
  if v_invite.expires_at <= now() then
    update public.league_invitations set status = 'expired' where id = v_invite.id;
    raise exception 'Invitation has expired';
  end if;
  if lower(v_invite.email::text) <> v_email then
    raise exception 'Invitation belongs to another email address';
  end if;

  select count(*) into v_member_count
  from public.league_members
  where league_id = v_invite.league_id and status = 'active';
  if v_member_count >= (select capacity from public.leagues where id = v_invite.league_id) then
    raise exception 'League is full';
  end if;

  insert into public.league_members (league_id, user_id, role, status)
  values (v_invite.league_id, v_user_id, 'manager', 'active')
  on conflict (league_id, user_id) do update
    set status = 'active', role = 'manager', removed_at = null, joined_at = now();

  update public.league_invitations
  set status = 'accepted', accepted_by = v_user_id, responded_at = now()
  where id = v_invite.id;

  insert into public.league_activity (league_id, actor_id, event_type, message)
  values (v_invite.league_id, v_user_id, 'member_joined', 'A manager joined the league.');
  return v_invite.league_id;
end;
$$;

create function private.decline_invitation(p_token uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := private.current_email();
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  update public.league_invitations
  set status = 'declined', responded_at = now()
  where token = p_token
    and status = 'pending'
    and expires_at > now()
    and lower(email::text) = v_email;
  if not found then raise exception 'Invitation is not available'; end if;
end;
$$;

create function private.invite_to_league(p_league_id uuid, p_email text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, private, extensions
as $$
declare
  v_user_id uuid := auth.uid();
  v_invitation_id uuid;
begin
  if not private.is_league_commissioner(p_league_id, v_user_id) then
    raise exception 'Commissioner access required';
  end if;
  if p_email is null or lower(trim(p_email)) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'A valid email address is required';
  end if;
  if exists (
    select 1
    from public.league_members lm
    join auth.users u on u.id = lm.user_id
    where lm.league_id = p_league_id and lm.status = 'active'
      and lower(u.email) = lower(trim(p_email))
  ) then
    raise exception 'This user is already a league member';
  end if;

  insert into public.league_invitations (league_id, email, invited_by)
  values (p_league_id, lower(trim(p_email)), v_user_id)
  returning id into v_invitation_id;

  insert into public.audit_logs (actor_id, league_id, action, entity_type, entity_id, after_data)
  values (
    v_user_id, p_league_id, 'invite', 'league_invitation', v_invitation_id::text,
    jsonb_build_object('email', lower(trim(p_email)))
  );
  return v_invitation_id;
end;
$$;

create function private.remove_league_member(p_league_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_actor_id uuid := auth.uid();
begin
  if not private.is_league_commissioner(p_league_id, v_actor_id) then
    raise exception 'Commissioner access required';
  end if;
  if p_user_id = v_actor_id then
    raise exception 'Transfer commissioner ownership before removing yourself';
  end if;
  if exists (
    select 1 from public.drafts
    where league_id = p_league_id and status in ('live', 'paused', 'complete')
  ) then
    raise exception 'Members cannot be removed after the draft starts';
  end if;

  update public.league_members
  set status = 'removed', removed_at = now(), draft_position = null
  where league_id = p_league_id and user_id = p_user_id and status = 'active';
  if not found then raise exception 'Active membership not found'; end if;

  insert into public.audit_logs (actor_id, league_id, action, entity_type, entity_id)
  values (v_actor_id, p_league_id, 'remove', 'league_member', p_user_id::text);
end;
$$;

create function private.transfer_commissioner(p_league_id uuid, p_new_commissioner_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_actor_id uuid := auth.uid();
begin
  if not private.is_league_commissioner(p_league_id, v_actor_id) then
    raise exception 'Commissioner access required';
  end if;
  if not private.is_league_member(p_league_id, p_new_commissioner_id) then
    raise exception 'New commissioner must be an active league member';
  end if;
  if p_new_commissioner_id = v_actor_id then return; end if;

  update public.league_members set role = 'manager'
  where league_id = p_league_id and user_id = v_actor_id;
  update public.league_members set role = 'commissioner'
  where league_id = p_league_id and user_id = p_new_commissioner_id;
  update public.leagues set commissioner_id = p_new_commissioner_id
  where id = p_league_id;

  insert into public.audit_logs (actor_id, league_id, action, entity_type, entity_id, after_data)
  values (
    v_actor_id, p_league_id, 'transfer', 'commissioner', p_new_commissioner_id::text,
    jsonb_build_object('previous_commissioner_id', v_actor_id)
  );
end;
$$;

create function private.leave_league(p_league_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if private.is_league_commissioner(p_league_id, v_user_id) then
    raise exception 'Transfer commissioner ownership before leaving';
  end if;
  if exists (
    select 1 from public.drafts
    where league_id = p_league_id and status in ('live', 'paused', 'complete')
  ) then
    raise exception 'Members cannot leave after the draft starts';
  end if;
  update public.league_members
  set status = 'left', removed_at = now(), draft_position = null
  where league_id = p_league_id and user_id = v_user_id and status = 'active';
  if not found then
    raise exception 'Active membership not found';
  end if;
  insert into public.league_activity (league_id, actor_id, event_type, message)
  values (p_league_id, v_user_id, 'member_left', 'A manager left the league.');
end;
$$;

create function private.create_draft(
  p_league_id uuid,
  p_scheduled_at timestamptz,
  p_pick_timer_seconds integer,
  p_randomize_order boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_draft_id uuid;
begin
  if not private.is_league_commissioner(p_league_id, v_user_id) then
    raise exception 'Commissioner access required';
  end if;
  if (select count(*) from public.league_members where league_id = p_league_id and status = 'active') < 2 then
    raise exception 'At least two active members are required';
  end if;

  insert into public.drafts (league_id, scheduled_at, pick_timer_seconds, created_by)
  values (p_league_id, p_scheduled_at, p_pick_timer_seconds, v_user_id)
  returning id into v_draft_id;

  insert into public.draft_participants (draft_id, user_id, pick_position)
  select v_draft_id, user_id,
    row_number() over (
      order by
        case when p_randomize_order then random() else 0 end,
        coalesce(draft_position, 32767),
        joined_at
    )::smallint
  from public.league_members
  where league_id = p_league_id and status = 'active';

  update public.league_members lm
  set draft_position = dp.pick_position
  from public.draft_participants dp
  where dp.draft_id = v_draft_id
    and lm.league_id = p_league_id
    and lm.user_id = dp.user_id;

  update public.leagues set status = 'draft_scheduled' where id = p_league_id;
  insert into public.draft_events (draft_id, actor_id, event_type)
  values (v_draft_id, v_user_id, 'draft_created');
  return v_draft_id;
end;
$$;

create function private.expected_drafter(p_draft_id uuid, p_overall_pick integer)
returns uuid
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  with participant_count as (
    select count(*)::integer as total from public.draft_participants where draft_id = p_draft_id
  ),
  pick_context as (
    select
      ((p_overall_pick - 1) / total) + 1 as round_number,
      ((p_overall_pick - 1) % total) + 1 as slot_number,
      total
    from participant_count where total > 0
  )
  select dp.user_id
  from pick_context pc
  join public.draft_participants dp
    on dp.draft_id = p_draft_id
   and dp.pick_position = case
     when pc.round_number % 2 = 1 then pc.slot_number
     else pc.total - pc.slot_number + 1
   end;
$$;

create function private.insert_draft_pick(
  p_draft_id uuid,
  p_entry_id uuid,
  p_user_id uuid,
  p_method text
)
returns public.draft_picks
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_draft public.drafts%rowtype;
  v_pick public.draft_picks%rowtype;
  v_edition_id uuid;
  v_participant_count integer;
  v_sport_count integer;
  v_total_picks integer;
begin
  select * into v_draft from public.drafts where id = p_draft_id for update;
  if not found or v_draft.status <> 'live' then
    raise exception 'Draft is not live';
  end if;
  if private.expected_drafter(p_draft_id, v_draft.current_pick) <> p_user_id then
    raise exception 'User is not on the clock';
  end if;

  select ce.competition_edition_id into v_edition_id
  from public.competition_entries ce
  join public.league_sports ls
    on ls.competition_edition_id = ce.competition_edition_id
   and ls.league_id = v_draft.league_id
  where ce.id = p_entry_id and ce.eligible;
  if not found then
    raise exception 'Competitor is not eligible for this league';
  end if;

  select count(*) into v_participant_count from public.draft_participants where draft_id = p_draft_id;
  select count(*) into v_sport_count from public.league_sports where league_id = v_draft.league_id;
  v_total_picks := v_participant_count * v_sport_count;

  insert into public.draft_picks (
    draft_id, league_id, user_id, competition_entry_id, competition_edition_id,
    overall_pick, round_number, selection_method
  )
  values (
    p_draft_id, v_draft.league_id, p_user_id, p_entry_id, v_edition_id,
    v_draft.current_pick, ((v_draft.current_pick - 1) / v_participant_count) + 1, p_method
  )
  returning * into v_pick;

  delete from public.draft_queue_items
  where draft_id = p_draft_id and competition_entry_id = p_entry_id;

  if v_draft.current_pick >= v_total_picks then
    update public.drafts
    set status = 'complete', completed_at = now(), pick_expires_at = null, version = version + 1
    where id = p_draft_id;
    update public.leagues set status = 'active' where id = v_draft.league_id;
  else
    update public.drafts
    set current_pick = current_pick + 1,
        pick_expires_at = now() + make_interval(secs => pick_timer_seconds),
        version = version + 1
    where id = p_draft_id;
  end if;

  insert into public.draft_events (draft_id, actor_id, event_type, payload)
  values (p_draft_id, p_user_id, 'pick_made', jsonb_build_object(
    'pick_id', v_pick.id, 'overall_pick', v_pick.overall_pick,
    'competition_entry_id', p_entry_id, 'method', p_method
  ));
  insert into public.league_activity (league_id, actor_id, event_type, message, data)
  values (
    v_draft.league_id, p_user_id, 'draft_pick', 'A draft pick was made.',
    jsonb_build_object('pick_id', v_pick.id, 'overall_pick', v_pick.overall_pick)
  );
  return v_pick;
end;
$$;

create function private.make_draft_pick(p_draft_id uuid, p_entry_id uuid)
returns public.draft_picks
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  return private.insert_draft_pick(p_draft_id, p_entry_id, v_user_id, 'manual');
end;
$$;

create function private.set_draft_status(p_draft_id uuid, p_action text)
returns public.drafts
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_draft public.drafts%rowtype;
begin
  select * into v_draft from public.drafts where id = p_draft_id for update;
  if not found or not private.is_league_commissioner(v_draft.league_id, v_user_id) then
    raise exception 'Commissioner access required';
  end if;

  if p_action = 'start' and v_draft.status = 'scheduled' then
    update public.drafts set status = 'live', started_at = coalesce(started_at, now()),
      paused_at = null, pick_expires_at = now() + make_interval(secs => pick_timer_seconds),
      version = version + 1 where id = p_draft_id returning * into v_draft;
    update public.leagues set status = 'drafting' where id = v_draft.league_id;
  elsif p_action = 'pause' and v_draft.status = 'live' then
    update public.drafts set status = 'paused', paused_at = now(), pick_expires_at = null,
      version = version + 1 where id = p_draft_id returning * into v_draft;
  elsif p_action = 'resume' and v_draft.status = 'paused' then
    update public.drafts set status = 'live', paused_at = null,
      pick_expires_at = now() + make_interval(secs => pick_timer_seconds),
      version = version + 1 where id = p_draft_id returning * into v_draft;
  else
    raise exception 'Invalid action % for draft status %', p_action, v_draft.status;
  end if;

  insert into public.draft_events (draft_id, actor_id, event_type)
  values (p_draft_id, v_user_id, 'draft_' || p_action);
  return v_draft;
end;
$$;

create function private.process_expired_draft_pick(p_draft_id uuid)
returns public.draft_picks
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_draft public.drafts%rowtype;
  v_user_id uuid;
  v_entry_id uuid;
  v_method text;
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role required';
  end if;
  select * into v_draft from public.drafts where id = p_draft_id for update;
  if not found or v_draft.status <> 'live' or v_draft.pick_expires_at is null or v_draft.pick_expires_at > now() then
    return null;
  end if;
  v_user_id := private.expected_drafter(p_draft_id, v_draft.current_pick);

  select qi.competition_entry_id into v_entry_id
  from public.draft_queue_items qi
  join public.competition_entries ce on ce.id = qi.competition_entry_id and ce.eligible
  join public.league_sports ls on ls.competition_edition_id = ce.competition_edition_id and ls.league_id = v_draft.league_id
  where qi.draft_id = p_draft_id and qi.user_id = v_user_id
    and not exists (select 1 from public.draft_picks p where p.draft_id = p_draft_id and p.competition_entry_id = qi.competition_entry_id)
    and not exists (select 1 from public.draft_picks p where p.draft_id = p_draft_id and p.user_id = v_user_id and p.competition_edition_id = ce.competition_edition_id)
  order by qi.position
  limit 1;
  v_method := 'queue_autopick';

  if v_entry_id is null then
    select ce.id into v_entry_id
    from public.competition_entries ce
    join public.league_sports ls on ls.competition_edition_id = ce.competition_edition_id and ls.league_id = v_draft.league_id
    where ce.eligible
      and not exists (select 1 from public.draft_picks p where p.draft_id = p_draft_id and p.competition_entry_id = ce.id)
      and not exists (select 1 from public.draft_picks p where p.draft_id = p_draft_id and p.user_id = v_user_id and p.competition_edition_id = ce.competition_edition_id)
    order by ce.current_ranking nulls last, ce.seed nulls last, ce.created_at
    limit 1;
    v_method := 'best_available_autopick';
  end if;
  if v_entry_id is null then raise exception 'No eligible competitors remain'; end if;
  return private.insert_draft_pick(p_draft_id, v_entry_id, v_user_id, v_method);
end;
$$;

create function private.recalculate_league_scores(p_league_id uuid)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_count integer;
begin
  if not private.is_platform_admin(v_user_id) and auth.role() <> 'service_role' then
    raise exception 'LOC administrator access required';
  end if;

  delete from public.score_entries where league_id = p_league_id and source = 'system';

  insert into public.score_entries (
    league_id, draft_pick_id, competition_result_id, rule_key, entry_type, points, source, created_by
  )
  select p_league_id, dp.id, cr.id, sr.rule_key, 'placement', sr.points, 'system', v_user_id
  from public.draft_picks dp
  join public.competition_results cr on cr.competition_entry_id = dp.competition_entry_id and cr.approval_status = 'approved'
  join public.scoring_rules sr on sr.rule_type = 'placement' and sr.placement = cr.placement and sr.active
  where dp.league_id = p_league_id;

  insert into public.score_entries (
    league_id, draft_pick_id, competition_result_id, rule_key, entry_type, points, source, created_by
  )
  select p_league_id, dp.id, cr.id, sr.rule_key,
    case when cr.is_champion then 'champion_bonus' else 'runner_up_bonus' end,
    sr.points, 'system', v_user_id
  from public.draft_picks dp
  join public.competition_results cr on cr.competition_entry_id = dp.competition_entry_id and cr.approval_status = 'approved'
  join public.scoring_rules sr on sr.rule_key = case when cr.is_champion then 'champion_bonus' else 'runner_up_bonus' end and sr.active
  where dp.league_id = p_league_id and (cr.is_champion or cr.is_runner_up);

  get diagnostics v_count = row_count;
  insert into public.league_activity (league_id, actor_id, event_type, message)
  values (p_league_id, v_user_id, 'scores_recalculated', 'League scores were recalculated.');
  insert into public.audit_logs (actor_id, league_id, action, entity_type, entity_id)
  values (v_user_id, p_league_id, 'recalculate', 'league_scores', p_league_id::text);
  return (select count(*) from public.score_entries where league_id = p_league_id and source = 'system');
end;
$$;

create function private.bootstrap_first_admin()
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
  insert into public.platform_roles (user_id, role, granted_by)
  values (v_user_id, 'admin', v_user_id);
  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (v_user_id, 'bootstrap', 'platform_admin', v_user_id::text);
end;
$$;

create function public.create_league(
  p_name text, p_description text, p_season_year integer, p_capacity smallint, p_competition_edition_ids uuid[]
)
returns uuid language sql security invoker set search_path = pg_catalog, private
as $$ select private.create_league(p_name, p_description, p_season_year, p_capacity, p_competition_edition_ids); $$;

create function public.accept_league_invitation(p_token uuid)
returns uuid language sql security invoker set search_path = pg_catalog, private
as $$ select private.accept_invitation(p_token); $$;

create function public.decline_league_invitation(p_token uuid)
returns void language sql security invoker set search_path = pg_catalog, private
as $$ select private.decline_invitation(p_token); $$;

create function public.invite_to_league(p_league_id uuid, p_email text)
returns uuid language sql security invoker set search_path = pg_catalog, private
as $$ select private.invite_to_league(p_league_id, p_email); $$;

create function public.remove_league_member(p_league_id uuid, p_user_id uuid)
returns void language sql security invoker set search_path = pg_catalog, private
as $$ select private.remove_league_member(p_league_id, p_user_id); $$;

create function public.transfer_commissioner(p_league_id uuid, p_new_commissioner_id uuid)
returns void language sql security invoker set search_path = pg_catalog, private
as $$ select private.transfer_commissioner(p_league_id, p_new_commissioner_id); $$;

create function public.leave_league(p_league_id uuid)
returns void language sql security invoker set search_path = pg_catalog, private
as $$ select private.leave_league(p_league_id); $$;

create function public.create_draft(
  p_league_id uuid, p_scheduled_at timestamptz, p_pick_timer_seconds integer, p_randomize_order boolean default true
)
returns uuid language sql security invoker set search_path = pg_catalog, private
as $$ select private.create_draft(p_league_id, p_scheduled_at, p_pick_timer_seconds, p_randomize_order); $$;

create function public.make_draft_pick(p_draft_id uuid, p_entry_id uuid)
returns public.draft_picks language sql security invoker set search_path = pg_catalog, private
as $$ select private.make_draft_pick(p_draft_id, p_entry_id); $$;

create function public.set_draft_status(p_draft_id uuid, p_action text)
returns public.drafts language sql security invoker set search_path = pg_catalog, private
as $$ select private.set_draft_status(p_draft_id, p_action); $$;

create function public.process_expired_draft_pick(p_draft_id uuid)
returns public.draft_picks language sql security invoker set search_path = pg_catalog, private
as $$ select private.process_expired_draft_pick(p_draft_id); $$;

create function public.recalculate_league_scores(p_league_id uuid)
returns integer language sql security invoker set search_path = pg_catalog, private
as $$ select private.recalculate_league_scores(p_league_id); $$;

create function public.bootstrap_first_admin()
returns void language sql security invoker set search_path = pg_catalog, private
as $$ select private.bootstrap_first_admin(); $$;

create view public.league_standings
with (security_invoker = true)
as
with pick_scores as (
  select
    dp.id,
    dp.league_id,
    dp.user_id,
    coalesce(sum(se.points), 0)::numeric(10,2) as points,
    coalesce(cr.advancement_level, 0) as advancement_level,
    cr.elimination_margin,
    cr.elimination_offense,
    ce.seed
  from public.draft_picks dp
  join public.competition_entries ce on ce.id = dp.competition_entry_id
  left join public.competition_results cr on cr.competition_entry_id = dp.competition_entry_id
    and cr.approval_status = 'approved'
  left join public.score_entries se on se.draft_pick_id = dp.id
  group by dp.id, dp.league_id, dp.user_id, cr.advancement_level,
    cr.elimination_margin, cr.elimination_offense, ce.seed
),
member_totals as (
  select
    lm.league_id,
    lm.user_id,
    p.username,
    p.first_name,
    p.last_name,
    count(ps.id)::integer as teams_drafted,
    coalesce(sum(ps.points), 0)::numeric(10,2) as total_points,
    coalesce(sum(ps.advancement_level), 0)::numeric as advancement_score,
    sum(abs(ps.elimination_margin)) as elimination_margin_score,
    sum(ps.elimination_offense) as elimination_offense_score,
    sum(ps.seed) as seed_score
  from public.league_members lm
  join public.profiles p on p.id = lm.user_id
  left join pick_scores ps on ps.league_id = lm.league_id and ps.user_id = lm.user_id
  where lm.status = 'active'
  group by lm.league_id, lm.user_id, p.username, p.first_name, p.last_name
)
select
  mt.*,
  dense_rank() over (
    partition by mt.league_id
    order by mt.total_points desc, mt.advancement_score desc,
      mt.elimination_margin_score asc nulls last,
      mt.elimination_offense_score desc nulls last,
      mt.seed_score asc nulls last
  )::integer as rank
from member_totals mt;

create view public.member_rosters
with (security_invoker = true)
as
select
  dp.league_id,
  dp.user_id,
  dp.id as draft_pick_id,
  dp.overall_pick,
  dp.round_number,
  s.name as sport_name,
  c.name as competitor_name,
  c.logo_url,
  cr.placement,
  cr.status_text,
  coalesce(sum(se.points), 0)::numeric(10,2) as points
from public.draft_picks dp
join public.competition_entries ce on ce.id = dp.competition_entry_id
join public.competition_editions ced on ced.id = ce.competition_edition_id
join public.sports s on s.id = ced.sport_id
join public.competitors c on c.id = ce.competitor_id
left join public.competition_results cr on cr.competition_entry_id = ce.id
left join public.score_entries se on se.draft_pick_id = dp.id
group by dp.league_id, dp.user_id, dp.id, dp.overall_pick, dp.round_number,
  s.name, c.name, c.logo_url, cr.placement, cr.status_text;

create view public.dashboard_summary
with (security_invoker = true)
as
select
  lm.user_id,
  count(distinct lm.league_id) filter (where l.status not in ('complete', 'cancelled'))::integer as active_leagues,
  count(distinct li.id) filter (where li.status = 'pending' and li.expires_at > now())::integer as pending_invitations,
  min(ls.rank)::integer as best_rank,
  count(distinct dp.id)::integer as teams_tracked
from public.league_members lm
join public.leagues l on l.id = lm.league_id
left join public.league_standings ls on ls.league_id = lm.league_id and ls.user_id = lm.user_id
left join public.draft_picks dp on dp.league_id = lm.league_id and dp.user_id = lm.user_id
left join public.league_invitations li on lower(li.email::text) = (select private.current_email())
where lm.status = 'active' and lm.user_id = (select auth.uid())
group by lm.user_id;

alter table public.profiles enable row level security;
alter table public.platform_roles enable row level security;
alter table public.sports enable row level security;
alter table public.competition_editions enable row level security;
alter table public.competitors enable row level security;
alter table public.competition_entries enable row level security;
alter table public.competition_results enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.league_invitations enable row level security;
alter table public.league_sports enable row level security;
alter table public.drafts enable row level security;
alter table public.draft_participants enable row level security;
alter table public.draft_picks enable row level security;
alter table public.draft_queue_items enable row level security;
alter table public.draft_messages enable row level security;
alter table public.draft_events enable row level security;
alter table public.scoring_rules enable row level security;
alter table public.score_entries enable row level security;
alter table public.notifications enable row level security;
alter table public.league_activity enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or exists (
    select 1 from public.league_members mine
    join public.league_members theirs on theirs.league_id = mine.league_id
    where mine.user_id = (select auth.uid()) and mine.status = 'active'
      and theirs.user_id = profiles.id and theirs.status = 'active'
  )
  or (select private.is_platform_admin())
);
create policy profiles_update on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy platform_roles_select on public.platform_roles for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_platform_admin()));
create policy platform_roles_admin_all on public.platform_roles for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));

create policy sports_read on public.sports for select to anon, authenticated using (true);
create policy editions_read on public.competition_editions for select to anon, authenticated using (true);
create policy competitors_read on public.competitors for select to authenticated using (true);
create policy entries_read on public.competition_entries for select to authenticated using (true);
create policy results_read on public.competition_results for select to authenticated
using (approval_status = 'approved' or (select private.is_platform_admin()));
create policy scoring_rules_read on public.scoring_rules for select to anon, authenticated using (active);

create policy sports_admin_all on public.sports for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy editions_admin_all on public.competition_editions for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy competitors_admin_all on public.competitors for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy entries_admin_all on public.competition_entries for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy results_admin_all on public.competition_results for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy scoring_rules_admin_all on public.scoring_rules for all to authenticated
using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));

create policy leagues_member_read on public.leagues for select to authenticated
using ((select private.is_league_member(id)) or commissioner_id = (select auth.uid()) or (select private.is_platform_admin()));
create policy leagues_commissioner_update on public.leagues for update to authenticated
using ((select private.is_league_commissioner(id))) with check (commissioner_id = (select auth.uid()));

create policy members_league_read on public.league_members for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));
create policy invitations_read on public.league_invitations for select to authenticated
using (
  (select private.is_league_commissioner(league_id))
  or lower(email::text) = (select private.current_email())
  or (select private.is_platform_admin())
);
create policy invitations_commissioner_insert on public.league_invitations for insert to authenticated
with check ((select private.is_league_commissioner(league_id)) and invited_by = (select auth.uid()));
create policy invitations_commissioner_update on public.league_invitations for update to authenticated
using ((select private.is_league_commissioner(league_id)))
with check ((select private.is_league_commissioner(league_id)));

create policy league_sports_read on public.league_sports for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));
create policy league_sports_commissioner_manage on public.league_sports for all to authenticated
using ((select private.is_league_commissioner(league_id)))
with check ((select private.is_league_commissioner(league_id)));

create policy drafts_member_read on public.drafts for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));
create policy draft_participants_member_read on public.draft_participants for select to authenticated
using (exists (
  select 1 from public.drafts d where d.id = draft_id and (select private.is_league_member(d.league_id))
));
create policy draft_picks_member_read on public.draft_picks for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));

create policy queue_owner_read on public.draft_queue_items for select to authenticated
using (user_id = (select auth.uid()));
create policy queue_owner_insert on public.draft_queue_items for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.drafts d where d.id = draft_id and (select private.is_league_member(d.league_id))
  )
);
create policy queue_owner_update on public.draft_queue_items for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy queue_owner_delete on public.draft_queue_items for delete to authenticated
using (user_id = (select auth.uid()));

create policy messages_member_read on public.draft_messages for select to authenticated
using (exists (
  select 1 from public.drafts d where d.id = draft_id and (select private.is_league_member(d.league_id))
));
create policy messages_member_insert on public.draft_messages for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.drafts d where d.id = draft_id and (select private.is_league_member(d.league_id))
  )
);
create policy events_member_read on public.draft_events for select to authenticated
using (exists (
  select 1 from public.drafts d where d.id = draft_id and (select private.is_league_member(d.league_id))
));

create policy scores_member_read on public.score_entries for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));
create policy scores_admin_insert on public.score_entries for insert to authenticated
with check ((select private.is_platform_admin()) and source = 'admin' and created_by = (select auth.uid()));

create policy notifications_owner_read on public.notifications for select to authenticated
using (user_id = (select auth.uid()));
create policy notifications_owner_update on public.notifications for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy activity_member_read on public.league_activity for select to authenticated
using ((select private.is_league_member(league_id)) or (select private.is_platform_admin()));
create policy audit_commissioner_read on public.audit_logs for select to authenticated
using (
  (league_id is not null and (select private.is_league_commissioner(league_id)))
  or (select private.is_platform_admin())
);

grant usage on schema public to anon, authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant select on public.sports, public.competition_editions, public.scoring_rules to anon;
grant select on all tables in schema public to authenticated;
grant insert, update on public.profiles to authenticated;
grant insert, update, delete on public.league_invitations, public.league_sports to authenticated;
grant update on public.leagues to authenticated;
grant insert, update, delete on public.draft_queue_items to authenticated;
grant insert on public.draft_messages to authenticated;
grant insert on public.score_entries to authenticated;
grant update on public.notifications to authenticated;
grant insert, update, delete on public.sports, public.competition_editions, public.competitors,
  public.competition_entries, public.competition_results, public.scoring_rules, public.platform_roles to authenticated;
grant select on public.league_standings, public.member_rosters, public.dashboard_summary to authenticated;
grant usage on schema private to authenticated, service_role;
grant execute on all functions in schema private to authenticated, service_role;
revoke execute on function private.process_expired_draft_pick(uuid) from authenticated;
grant execute on function private.process_expired_draft_pick(uuid) to service_role;
grant execute on function public.create_league(text,text,integer,smallint,uuid[]) to authenticated;
grant execute on function public.accept_league_invitation(uuid) to authenticated;
grant execute on function public.decline_league_invitation(uuid) to authenticated;
grant execute on function public.invite_to_league(uuid,text) to authenticated;
grant execute on function public.remove_league_member(uuid,uuid) to authenticated;
grant execute on function public.transfer_commissioner(uuid,uuid) to authenticated;
grant execute on function public.leave_league(uuid) to authenticated;
grant execute on function public.create_draft(uuid,timestamptz,integer,boolean) to authenticated;
grant execute on function public.make_draft_pick(uuid,uuid) to authenticated;
grant execute on function public.set_draft_status(uuid,text) to authenticated;
grant execute on function public.recalculate_league_scores(uuid) to authenticated;
grant execute on function public.bootstrap_first_admin() to authenticated;
revoke execute on function public.process_expired_draft_pick(uuid) from public, anon, authenticated;
grant execute on function public.process_expired_draft_pick(uuid) to service_role;

insert into public.sports (key, name, competitor_type, display_order) values
  ('nba', 'NBA', 'team', 1),
  ('nfl', 'NFL', 'team', 2),
  ('mlb', 'MLB', 'team', 3),
  ('nhl', 'NHL', 'team', 4),
  ('ncaa_football', 'NCAA Football', 'team', 5),
  ('ncaa_basketball', 'NCAA Basketball', 'team', 6),
  ('uefa_champions_league', 'UEFA Champions League', 'team', 7),
  ('nascar', 'NASCAR', 'organization', 8),
  ('masters_tournament', 'Masters Tournament', 'golfer', 9);

insert into public.scoring_rules (rule_type, rule_key, label, placement, points) values
  ('placement', 'placement_1', '1st Place', 1, 9),
  ('placement', 'placement_2', '2nd Place', 2, 8),
  ('placement', 'placement_3', '3rd Place', 3, 7),
  ('placement', 'placement_4', '4th Place', 4, 6),
  ('placement', 'placement_5', '5th Place', 5, 5),
  ('placement', 'placement_6', '6th Place', 6, 4),
  ('placement', 'placement_7', '7th Place', 7, 3),
  ('placement', 'placement_8', '8th Place', 8, 2),
  ('placement', 'placement_9', '9th Place', 9, 1),
  ('bonus', 'champion_bonus', 'Champion Bonus', null, 3),
  ('bonus', 'runner_up_bonus', 'Runner-Up Bonus', null, 1);

insert into public.scoring_rules (rule_type, rule_key, label, priority) values
  ('tiebreaker', 'furthest_advancement', 'Furthest advancement', 1),
  ('tiebreaker', 'smallest_elimination_margin', 'Smallest elimination margin', 2),
  ('tiebreaker', 'elimination_round_offense', 'Most elimination-round offense', 3),
  ('tiebreaker', 'higher_playoff_seed', 'Higher playoff seed', 4);

alter publication supabase_realtime add table
  public.drafts,
  public.draft_picks,
  public.draft_messages,
  public.draft_events,
  public.league_activity,
  public.score_entries,
  public.notifications;
