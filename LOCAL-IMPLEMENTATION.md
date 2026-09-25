# LOC local implementation

The UX implementation is available as a self-contained local edition. Launch
`Start-LOC.cmd`, or run `node server.js` and open http://localhost:4173.
See `UX-VALIDATION.md` for the complete finding-by-finding status and remaining
external acceptance work. GitHub source publication is separate from deployment;
no hosted service or remote database was changed.

The completion pass adds stable keyed DOM updates, saved per-league filters,
precise turn-distance hints, setup checklists, initial skeletons, last-sync and
retry feedback, consistent 44px queue controls, and aggregate outcome metrics.
Optional email verification, resend/change-email, reset links, invitation delivery,
and failed-delivery retries are implemented; see `EMAIL-SETUP.md` for activation.

## What to try

1. **Explore a sample league** opens a separate sample account with populated
   standings, a draft lobby, and an invitation. Sample results are illustrative.
2. **Home** prioritizes your next draft. Global navigation has one desktop
   sidebar and one compact mobile navigation bar.
3. **Founders Cup** demonstrates standings, per-manager point breakdowns,
   rosters, results filters, rules, activity, score entry, and audited corrections.
4. **Sunday Club** supports queues, explicit Start/Pause/Resume, turn ownership,
   one team per sport, server deadlines, and automatic timeout selections.
   Sample opponents wait for timeout. Mobile team selection uses a modal sheet.
5. **Create league** saves configuration. Unsaved non-password form input is
   retained in the browser tab across reloads. A new league has no sample picks.
6. **Settings** actually saves league details, local invitations, draft order,
   membership locks, member removals, commissioner transfer, corrections, and
   resets. Consequential actions have confirmation and explanatory copy.
7. **Account** saves display name, time zone, and in-app turn-alert preference.
   Personal accounts use server-side password hashes and HttpOnly sessions;
   signup provides a one-time recovery code. Remember Me persists for 30 days.

## Audit coverage

| Audit findings | Local implementation |
|---|---|
| C1 | API-enforced current manager, sport-slot eligibility, expected draft version, explicit commissioner override with reason. |
| C2 | Persisted scheduled/live/paused/complete state and deadlines; server clock runs independently of the page; queue then catalog fallback on timeout. |
| C3 | Real mutations, committed activity records, honest local-invitation and recovery behavior; unsupported send-email claims removed. |
| C4 | Atomic file persistence, saved schedule/order/timer, invitation acceptance persistence, retry-safe league creation. |
| C5 | Personal accounts start empty; sample leagues are isolated and labeled; league-specific picks, scores, queues, members, chat, and activity. |
| C6 | Local server authentication, salted scrypt password hashing, HttpOnly SameSite sessions, recovery-code reset and session revocation. Email-verification claims removed. |
| H1–H2 | Single responsive global navigation; browser URLs, Back support, page titles, breadcrumbs, league switcher, heading focus. |
| H3–H4 | Pool-first draft; mobile workspace tabs and selection sheet; labeled queue move/remove buttons; restored focus and search cursor; clock updates without rebuilding controls. |
| H5–H6 | Account flow retains create/join route intent; simplified signup; essential league fields with optional draft settings, named time zone, and computed pick count. |
| H7 | Native modal dialog behavior, Escape/focus return, semantic tables, navigation links, labeled mobile tabs and panels. |
| H8–H9 | Per-manager placement/bonus/override breakdown, timestamps, stated tie policy, editable account preferences and password change. Unsupported odds/progress removed. |
| Q1–Q3 | Separate no-data/no-match states, clear filters/counts, state-dependent card actions, plain-language headings and local capability descriptions. |
| Q4–Q6 | Associated field errors, input retention, accessible chat label, persistent declined-invite recovery, next-event Home, real empty onboarding. |
| P1–P4 | Shared semantic color tokens, restrained weights, flatter containers, consistent buttons/fields/dialogs, focus and reduced motion, compact semantic tables and responsive layouts. |

## Verification

Automated integration suite: `node --test tests/*.test.js`.

17 tests passed in the latest run, including email lifecycle/provider tests,
snake-turn distance, privacy-preserving metrics, and the original end-to-end
suite: clean accounts and password hashing; saved configuration and
league isolation; partial invitation failures, decline/undo, and acceptance;
private ordered queues; commissioner/turn authorization and concurrent-pick
conflicts; pause/resume and sport-slot enforcement; deadline/autopick across a
server restart; complete rosters and audited scoring; reset/ownership transfer;
direct routes, private-file protection, cross-origin rejection; retry-safe
creation and persisted preferences; recovery-code rotation and session revocation.

Browser verification uses Codex's browser controls because the agent-browser
CLI is not installed. Observed: landing and Home render; draft queue saves;
start/pause changes the displayed state; reload preserves pause and queue;
mobile queue tabs and selection sheet work; league creation validates missing
sports; unfinished form fields survive reload; created league survives reload;
new standings are empty; settings expose real supported controls. Desktop and
phone layouts were inspected, including a 320px narrow screen. A header crowding
issue found during that review was corrected.

Keyboard checks confirmed Escape closes a dialog and returns focus to the team
button, and arrow keys select the mobile draft panels. No browser console
warnings/errors were observed in the inspected session. At 1024px the league
page remained within the viewport; the draft queue also fit the 320px viewport.
Token contrast calculations: primary text/surface 15.67:1; secondary text/surface
8.49:1; primary-button text/background 7.38:1; field border/background 3.85:1;
focus ring/surface 10.04:1. These are token-pair checks, not an exhaustive
rendered contrast audit.

The launcher uses Node directly and does not require changing PowerShell's
execution policy. `Start-LOC.cmd --no-browser` checks/starts the server without
opening a browser window.

These checks are not a WCAG certification or a full screen-reader/device lab
test. Browser-supported dialog semantics and explicit keyboard patterns are
implemented; broader assistive-technology testing remains appropriate before
public release.

## Explicit local boundaries

- Data is stored in `.local/store.json`, excluded from Git. Only the local
  server can read the file; the HTTP static-file allowlist never serves it.
- The server listens on loopback only and supports one running process per data
  directory. This is not a multi-server production database.
- Invitations are in-app records for accounts on this server. Email is disabled
  by default. The optional delivery implementation needs a service key and
  verified sender; actual inbox delivery has not been tested. Preview mode is
  a testing mailbox and does not prove email ownership. Recovery codes also work.
- There is no live sports feed. Commissioners enter results; sample data and
  catalog ordering are explicitly illustrative. Equal totals share ranks; this
  edition does not invent elimination-margin data to break ties.
- Existing Supabase files remain untouched and are not connected or deployed.
  Production integration, live-data provider selection, notification delivery,
  user research, and analytics deployment require separate configuration/work.
- Original frontend files remain in `qa/before-ux-update/`. Old localStorage
  prototype users and plaintext passwords are not migrated into the new model.

The UX changes are available to review locally without publishing the product.
