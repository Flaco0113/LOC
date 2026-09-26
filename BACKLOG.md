# Backlog

Use this file to capture ideas, bugs, questions, and improvements while testing.

## Open

Real email and live sports schedules remain deferred in `FOLLOW-UP.md`.

## Completed

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

