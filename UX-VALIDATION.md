# UX completion and verification record

The reference is `LOC-UX-UI-Audit.md`. These are implementation and engineering
checks, not a claim that user research or an accessibility certification occurred.

| Finding | Implemented behavior | Evidence |
| --- | --- | --- |
| C1 | Server-authorized turns, one sport slot, expected version, audited commissioner override | Integration tests: unauthorized/concurrent picks and duplicate sports |
| C2 | Persisted status and deadline, queue fallback, clock independent of open pages | Restart and autopick integration test |
| C3 | Real mutations, pending/failure feedback, committed activity only | API tests; stopped-server browser check |
| C4 | Saved configuration/membership, safe unsaved form retention, idempotent create | API retry/restart tests and browser reload |
| C5 | Isolated sample account; membership-scoped data; real empty states | Empty-account and access-isolation tests |
| C6 | Hashed passwords, HttpOnly sessions, deliberate persistence, recovery; optional email identity flow | Auth/reset/verification tests |
| H1 | One global navigation per breakpoint | Desktop/tablet/phone browser review |
| H2 | Addressable routes, Back/scroll/focus, switcher, per-league saved filters | Browser navigation, reload, and schedule-anchor focus |
| H3 | Pool-first layout; phone tabs and modal selection sheet | Desktop and phone browser review |
| H4 | Keyed in-place DOM updates, separate move/remove buttons, position announcements and focus | Browser queue move kept focus on the appropriate enabled control |
| H5 | Saved create/join intent; minimal signup; resend/change-email/expired-link handling | Email API tests and expired-link browser check |
| H6 | Essentials first, optional scheduling, named zone, computed pick total, readiness checklist | Browser creation and setup navigation |
| H7 | Native dialog, Escape/focus return, semantic tables, route links and keyboard tabs | Browser keyboard checks and accessibility-tree inspection |
| H8 | Manager score breakdown, rule links, update time, provisional label, explicit shared ranks | Scoring integration tests and browser point breakdown |
| H9 | Real profile, time zone, notification preferences and password changes | Preference persistence and session-revocation tests |
| Q1 | Distinct no-data/no-match states, counts and clear filters | Browser draft search |
| Q2 | State-dependent league actions with league-specific accessible names | Home accessibility-tree inspection |
| Q3 | Plain task labels and explicit sample/delivery boundaries | Copy review |
| Q4 | Associated field errors, invalid styling, input retention, chat label | API validation and browser form/outage checks |
| Q5 | Decline/restore path and acceptance navigation | Invitation integration tests |
| Q6 | Next relevant draft first; genuine empty onboarding | Home browser review and clean-account tests |
| P1 | Reduced utility weight, flatter containers, readable essential text | Responsive browser review; system font fallback remains intentional |
| P2 | Semantic action, selection, status, focus and surface tokens | CSS review and contrast calculations in LOCAL-IMPLEMENTATION.md |
| P3 | Focus, pressed, disabled, pending, invalid, selected and reduced-motion treatments | Keyboard, queue, and offline browser checks |
| P4 | Semantic compact tables, aligned numerals, phone details, explicit board scrolling | Standings and draft-board browser review |

## Latest validation

- September 24 follow-up: repeated invalid league submissions produce exactly
  one associated field message; sport-group correction clears invalid state and
  stale description references for all nine controls. Schedule errors preserve
  the original hint alongside the error, then remove only the error reference
  when edited. Checked in the actual local browser without creating a league.
- Draft panels gain mobile tab roles/labels at 390px and remove them at 1440px
  immediately on resize, without requiring a route change or server update.

- `node --test tests/*.test.js`: 17 passing tests, including the enclosing suite.
- JavaScript syntax checks pass for client and server.
- Browser reviewed at 1440×900, 1024×768, 390×844, 320×780, and 844×390.
- 320px queue page fits the viewport; the board retains deliberate horizontal scroll.
- Saved search survives reload; queue position announcements match the committed order.
- A real stopped-server test showed a persistent reconnect banner, last-sync time,
  disabled saving, and retained unsaved description. On restart the banner cleared,
  saving returned, and the description remained intact.
- Expired verification links show inline recovery guidance, including for users
  who were already signed in. Browser testing caught and fixed the redirect losing
  the token before displaying its confirmation screen.
- No unexpected browser errors were observed before outage/invalid-token testing.
  Those deliberate failures produce expected network/422 diagnostics.

## External acceptance work

**User decision, September 24, 2026:** defer real email and live sports data until
the local enhancements have been reviewed. The follow-up scope and activation
criteria are tracked in `FOLLOW-UP.md`; neither integration is activated.

Actual inbox delivery requires the user's email service credentials and verified
sender. A production database deployment and live sports data feed are not connected;
the working local edition uses a persistent server and commissioner-entered results.
The existing Supabase deployment files are preserved.

Screen-reader sessions, physical-device tests, explicit 200% text enlargement and
400% browser-zoom testing, and research with real users remain external acceptance
work. Reflow at 320px and semantic/keyboard inspection are useful evidence but are
not substitutes for those checks.

## Repeatable usability sessions

Ask a first-time manager to explain scoring, create/join a league, and find their
next action. Ask a returning manager to prepare/reorder a queue, recover from a
conflicting pick, explain a points change, and switch leagues. Ask a commissioner
to schedule, pause/resume, invite, correct a result, and inspect the activity log.
Record task completion, time, navigation mistakes, invalid picks, and score
comprehension. Establish a baseline before claiming improvement percentages.

The local server now records aggregate completed/failed API outcomes and total
duration in `.local/metrics.json`, retained for 90 days. It records no identities,
league IDs, passwords, tokens, email addresses, form values, or chat content and
does not transmit analytics to a third party.
