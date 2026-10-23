# LOC Supabase Backend

This directory contains the initial production backend for League of Champions.

## Deployment

The migration targets Supabase project `nvvjzzsmpuebyenbxuvo`.

```powershell
supabase link --project-ref nvvjzzsmpuebyenbxuvo
supabase db push
supabase functions deploy draft-clock
```

The `draft-clock` function requires JWT verification and uses the standard
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` function
environment variables supplied by Supabase.

## Initial Administration

After deploying the migrations, create and verify the intended LOC owner account.
Then, using a database-admin connection (not the browser client), add that
account's UUID to the private bootstrap allowlist. For example, replace the
email below with the verified owner's address:

```sql
insert into private.platform_admin_bootstrap_allowlist (user_id)
select id
from auth.users
where lower(email) = lower('owner@example.com')
  and email_confirmed_at is not null;
```

Confirm that exactly one row was inserted before asking that owner to call:

```js
await supabase.rpc("bootstrap_first_admin");
```

Only the allowlisted verified owner can bootstrap, and the database marks the
allowlist entry consumed on success. The allowlist is in the private schema and
cannot be edited through the browser API. Further platform roles must be
granted by an existing platform administrator; bootstrap recovery requires a
trusted database administrator.

## Frontend RPCs

- `create_league`
- `invite_to_league`
- `accept_league_invitation`
- `decline_league_invitation`
- `remove_league_member`
- `transfer_commissioner`
- `leave_league`
- `create_draft`
- `set_draft_status`
- `make_draft_pick`
- `recalculate_league_scores`

Call the `draft-clock` Edge Function when a displayed pick deadline expires and
again after reconnecting to a live draft. The database locks the draft row and
checks `pick_expires_at`, so concurrent calls can produce at most one automatic
pick.

## Realtime Tables

Subscribe to:

- `drafts`
- `draft_picks`
- `draft_messages`
- `draft_events`
- `league_activity`
- `score_entries`
- `notifications`

Use the `league_standings`, `member_rosters`, and `dashboard_summary` views for
read models. Their underlying RLS policies restrict data to the current user's
private leagues.
