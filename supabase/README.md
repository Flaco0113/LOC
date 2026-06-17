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

After the first LOC owner creates and verifies their account, call:

```js
await supabase.rpc("bootstrap_first_admin");
```

This succeeds exactly once. Further platform roles must be granted by an
existing platform administrator.

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
