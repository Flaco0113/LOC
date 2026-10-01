# Backlog

Use this file to capture ideas, bugs, questions, and improvements while testing.

## Open

Real email and live sports schedules remain deferred in `FOLLOW-UP.md`.

## Completed

Completed October 1, 2026.

- [x] BL-006 — Redesign the poll feature in the discussion window to improve its UI and UX. Allow an authorized user to remove or delete a poll, and present each poll as a distinct modal-style section on the page. (added 2026-09-30)
- [x] BL-007 — When draft discussion messages are carried into the regular league chat, label them as having been originally sent during the draft so users do not mistake them for new messages. (added 2026-09-30)
- [x] BL-008 — Consolidate commissioner functions under a clearly labeled **Commish Tools** control that opens a dropdown menu of the available tools. (added 2026-09-30)
- [x] BL-009 — Enforce commissioner-tool permissions so **Commish Tools** and its functions are visible and accessible only to the league commissioner, never to other users. (added 2026-09-30)
- [x] BL-010 — During a draft on mobile, provide persistent navigation options for **Available**, **Queue**, **Board**, and **Chat**, following the same accessible navigation pattern used for **Home**, **My Leagues**, **Invitations**, and **Account**. (added 2026-09-30)
- [x] BL-011 — In league creation, replace the free-form **Season** field with a scrollable year selector that supports both single-year labels such as “2026 season” and split-year labels such as “2026–2027 season.” (added 2026-09-30)
- [x] BL-012 — In league creation, replace the **Managers** field with a scrollable selector restricted to whole numbers from 2 through 20. (added 2026-09-30)
- [x] BL-013 — In **Explore a Sample League**, make the simulated Sunday Club draft feel realistic by having automated managers make their selections at varied, shorter intervals instead of waiting the full 60 seconds for every pick. (added 2026-09-30)
- [x] BL-014 — When a draft is paused, prevent participants from continuing to browse or interact with team-selection views. Show only the paused state and the appropriate option to resume the draft. (added 2026-09-30)
- [x] BL-015 — In the **Rosters** view, make manager cards more compact and display two cards side by side where screen space allows, reducing unnecessary scrolling while keeping each roster clear and easy to read. (added 2026-10-01)

### Implementation notes — October 1, 2026

- BL-006: Polls are individual cards; create opens a modal; commissioners can close or delete them. Deletion is enforced in the server action.
- BL-007: Draft-origin messages display a draft label in both draft chat and league discussion. Existing messages are classified using the league draft start time.
- BL-008–009: Commissioner tools are grouped in a dropdown and rendered for the commissioner only. Existing server-side commissioner checks protect tool actions; poll deletion uses the same authorization path.
- BL-010: Mobile draft navigation stays fixed at the bottom with Available, Queue, Board, and Chat, and retains keyboard tab navigation semantics.
- BL-011–012: League creation uses season and manager selectors. Server validation accepts a single year or consecutive split-year and manager counts from 2–20.
- BL-013: Sample automated managers receive varied 2–7 second pick windows; real league timers are unchanged.
- BL-014: The paused draft route shows only paused status and resume/waiting UI. Queue and chat mutations are rejected while paused.
- BL-015: Desktop roster cards use a compact two-column manager layout; narrow screens retain one card per row.

Implementation source review completed. Automated tests and browser checks were not run in this turn.

Completed September 26, 2026.

- [x] BL-005 — Repair the production frontend-to-API connection. (added and completed 2026-09-26)

Completed September 25, 2026.

- [x] BL-001 — Improve the draft Commissioner Override team selector. It should provide a searchable list of every team still available in the draft. Currently, only a fixed subset of teams appears, preventing the commissioner from selecting an available team that is not shown. (added 2026-09-24)

- [x] BL-002 — Evaluate how the **YOUR NEXT CONTENDER** window should behave and move on screen, with particular attention to its current overlap problem. Establish the intended UX, then implement the agreed behavior so the window no longer overlaps other content. (added 2026-09-24)

- [x] BL-003 — In the **My Leagues** window, display the active timeframe for each LOC league, including its expected end date. Determine the end date from the last included sports league to crown its champion. For example, if the NHL finishes last, the LOC league ends when the Stanley Cup champion is decided because all included leagues are then complete. (added 2026-09-24)

- [x] BL-004 — Rewrite the points breakdown in plain, human-friendly language that explains how each team performed and why it received its points. For example, replace labels such as “NBA: 8 placement + 1 bonus” with an explanation such as “The team lost in the Finals but received a bonus for reaching the Finals.” (added 2026-09-24)

### Implementation notes

- BL-001: searchable, sport-filtered list of every undrafted team in the league catalog, with counts and explicit ineligible sport-slot explanations. No result limit. Rechecks availability during polling and blocks stale-turn confirmation.
- BL-002: floating desktop/tablet panel is bounded by its grid column, with viewport-limited internal scrolling and a compact draft clock. The desktop clock bar no longer floats over it. Mobile uses one modal sheet; the duplicate inline panel is hidden.
- BL-003: Home and My Leagues show the draft start and the latest estimated championship end among included sports. Expand Why this end date for each sport and assumptions. The user chose estimates until live schedules are available. Estimates never mark a league complete.
- BL-004: roster and manager breakdown explain champion, runner-up, other finishes, pending results and manual overrides in ordinary sentences, with exact points and bonuses.

### Verification

20 automated tests pass. Browser checks covered full-list search and a committed commissioner pick in an isolated test store; panel containment at 1024px and a 390px modal sheet; and readable score explanations. Test mutations did not use the user’s league store.


