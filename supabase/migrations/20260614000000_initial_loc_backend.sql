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
