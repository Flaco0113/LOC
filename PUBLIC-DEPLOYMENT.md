# LOC public beta operations

## What is hosted

- Vercel `loc` builds an allowlisted `dist` frontend from GitHub main.
- Same-origin `/api/*` rewrites reach Supabase project `nvvjzzsmpuebyenbxuvo`,
  Edge Function `loc-api`. Never place database secrets in frontend files.
- The API shares `app-kernel.js` with the local Node server. It implements LOC
  password/recovery authentication, hashed session tokens, Secure HttpOnly cookies,
  origin checks and durable per-minute write/account limits. This beta does not
  use Supabase Auth accounts; the earlier normalized schema is left intact.
- Storage lives in `loc_private.workspace`. Its single JSON state document uses
  version compare-and-swap retries to prevent lost updates and duplicate turns.
  This is a small-group beta design; partition by league and migrate identity
  before a large public launch. It is not a claim of load-tested scalability.
- All storage RPCs are invoker functions executable only by `service_role`.
  Private tables have RLS and no client policies intentionally: browser database
  access is denied. The Edge API checks sessions, membership and commissioner roles.
- Signup works without verification emails. Email-address-based invites are
  disabled publicly while mail is deferred; possession of a commissioner-created
  join code authorizes joining. Codes have 64 bits of random entropy, last seven
  days, can be revoked/replaced, and never bypass locked/full/started leagues.
- Original points and bonuses are unchanged. Results and catalog data remain
  illustrative/manual; external AI, live data and email are still deferred.

## Deployment

Run `node --test tests/*.test.js` and `node build-public.js`. Publish GitHub main;
Vercel builds using `vercel.json`. Deploy Edge code separately whenever kernel,
server model, catalog, mail adapter or cloud handler changes. Include:
`supabase/functions/loc-api/index.ts`, `cloud-handler.js`, `app-kernel.js`,
`experience-model.js`, `experience-server.js`, `product-model.js`,
`product-server.js`, `catalog.js`, `mail.js`, retaining relative paths.
The function uses Supabase's server-provided secret key environment variables.
JWT verification is disabled specifically because LOC implements custom sessions.
The production origin is pinned in `cloud-handler.js`; update it for a domain move.
Apply the two public workspace migrations once before deploying the API.

## Draft timing and data recovery

The database job `loc-public-draft-clock` checks every ten seconds and requests
the public state endpoint only when a saved draft deadline is due. The endpoint
reveals no private data without a session. Every normal request also catches up
expired turns using their original deadlines, even after a scheduler outage.

`loc-public-daily-snapshot` captures private workspace snapshots at 04:17 UTC and
retains seven days in `loc_private.workspace_backups`. These are in-database
recovery copies, not offsite disaster backups. Before a broader launch, configure
and verify provider backups/offsite exports according to the Supabase plan.
Do not restore by overwriting the live document during traffic: take a current
export, pause writes, inspect the selected snapshot, restore with a new version,
clear restored sessions, test, then resume. Local `.local/store.json` has not
been uploaded or changed by this deployment.

Inspect cron.job_run_details for failed clock/backup runs and Supabase Edge logs
for storage errors. No passwords, recovery codes or session cookies belong in logs.
Rollback frontend via Vercel and redeploy the matching API source; preserve stored
data and migrations. An API failure returns a retryable error rather than claiming
that a mutation saved successfully.

## Acceptance

29 automated tests cover the existing product plus shared-account cookies,
concurrent joins/capacity, private code visibility, revocation/expiry, CAS retries,
cross-origin/body/rate-limit rejection, and disconnected draft catch-up.
Record final public-browser verification separately; tests with fake storage do
not by themselves verify Vercel routing or actual database persistence.
