# League of Champions

League of Champions is a multi-sport fantasy league concept where managers draft entire teams or competitors, track postseason results, and compete for a year-round championship.

## Shared public beta

[Open LOC](https://loc-one.vercel.app/). Create a personal account and save its
recovery code. Create a league, then open **Settings → Generate join code**.
Send the code or join link privately to friends; they create their own accounts
and enter the code under **Invitations → Join with a league code**.

The public app stores accounts and leagues in Supabase through an authenticated
Edge API. Local accounts and leagues remain separate on this computer. Email,
live sports feeds and external AI remain disabled; scoring is commissioner-entered.
See [PUBLIC-DEPLOYMENT.md](PUBLIC-DEPLOYMENT.md) for deployment and recovery details.

## Run the redesigned local app

Double-click `Start-LOC.cmd` or run `node server.js` in this folder. Open
[LOC on this computer](http://localhost:4173). Node.js 22+ is required; no npm
install or remote service is needed. The launcher also finds the Node runtime
bundled with Codex on this machine.

Choose **Explore a sample league** to tour the populated Home, standings,
rosters, invitations, and Sunday Club draft lobby. Start Sunday Club's draft
to try the clock and queues. Sample opponents use timeout autopicks. A personal
account starts empty. Record the recovery code shown at signup.

The server binds only to loopback. Accounts, hashed passwords, leagues, sessions,
and draft deadlines persist in `.local/store.json` (excluded from Git). This is
a single-server local edition, not a deployed production service. Invitations
are delivered inside the local app when the recipient signs in with the invited
email. Email is disabled by default; optional verification, invitation delivery,
and password-reset links are documented in [EMAIL-SETUP.md](EMAIL-SETUP.md).
Results are entered by the commissioner rather than fetched from a live feed.
Recovery codes also work without an email service. Equal point totals share ranks.

Use the local server rather than opening `index.html` directly. Original frontend
files are backed up in `qa/before-ux-update/`; old browser-local prototype data is
not imported into the new account model. Publishing source to GitHub does not
deploy this Node server; GitHub Pages alone cannot run its API.

Run checks with `node --test tests/*.test.js`. Tests use ports 4185 and 4186 and
temporary data directories, leaving your local workspace untouched and sending
no real email. GitHub Actions runs the checks on Windows and Linux.

## Project Contents

- Redesigned frontend: `index.html`, `styles.css`, `script.js`
- Local persistent API and clock: `server.js`; illustrative team catalog: `catalog.js`
- UX audit: `LOC-UX-UI-Audit.md`; implementation coverage: `LOCAL-IMPLEMENTATION.md`
- Item-by-item acceptance record: `UX-VALIDATION.md`; email setup: `EMAIL-SETUP.md`
- Email queue/provider adapter: `mail.js`; private aggregate outcomes: `metrics.js`
- Hero artwork: `assets/loc-hero.png`
- Supabase backend plan and implementation: `supabase/`

## Backend

The Supabase backend includes the initial schema, Row Level Security policies, Realtime-ready tables, scoring model, and draft clock Edge Function.

See `supabase/README.md` for deployment notes.

## Championship workspace enhancements

See [CHAMPIONSHIP-IMPLEMENTATION.md](CHAMPIONSHIP-IMPLEMENTATION.md) for the September 2026 release: competition editions, season finalization, results previews and audit history, private research, discussion and polls, scenario scoring, archives and renewal. Current scoring is unchanged. Real email and live data remain deferred.
