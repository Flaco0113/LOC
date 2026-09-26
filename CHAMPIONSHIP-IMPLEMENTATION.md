# Championship workspace implementation — September 25, 2026

This release implements the local championship workflow from the product review. It preserves LOC's existing placement scoring: max(0, 10 − final place), plus 3 points for a champion and 1 for a runner-up. Manual overrides remain available. Equal totals still share rank. No elimination or sport-specific tie rules were introduced.

## Delivered locally

| Area | Changes |
| --- | --- |
| First visit | Invitation sign-in path, concrete scoring example, clearer team/golfer/motorsport entity explanation, three-step practice walkthrough inside each league. |
| Home | Compact next-action card, compact empty invitations, actual recorded result changes instead of a generic tip. |
| Navigation | Overview, Rosters, Results, Discussion; secondary research, scenarios, draft history, activity, rules and settings under More league tools. |
| Competition identity | Commissioner-editable competition editions and estimated championship months before drafting; editions lock after drafting starts. Estimates stay attached to the league rather than rolling forward when it is reopened next year. |
| Lifecycle | Forming, Drafting, In season, Awaiting confirmation, Final and Archived distinguish draft completion from championship completion. Finalization requires every result plus commissioner confirmation. Final results are locked, with an explicit correction/reopen flow before archiving. |
| Results | Dedicated commissioner workspace with batch preview, source/reason, stale-revision rejection, per-result audit records, result-update timestamps and standings snapshots. Manual scoring shares the same calculation used by scenarios. |
| Research | Private persistent notes and watchlists, watchlist filtering, comparison of up to three contenders, explicit eligibility explanations and honest catalog limitations. Commissioners can add missing contenders before drafting. |
| Draft | Eligible queue count, reasons entries will be skipped, remove-skipped action, visible filter summary/clear control, research link from contender panel. Existing non-overlapping floating selection behavior remains. |
| Rosters | Short outcome labels with expandable point explanations. Manual correction form shows only the input relevant to the selected scoring method. |
| Discussion | Persistent league chat outside the draft, commissioner announcements and polls; one changeable vote per member, aggregate counts and close-poll control. |
| Briefing | Score changes, per-sport contribution meters, recorded standings snapshots and a transparent rules-based next-step guide. No generated predictions or invented sporting facts. |
| Scenarios | Hypothetical places replace current points instead of adding to them, recalculate ranks with existing tie behavior, show deltas, and never save to real results. |
| Renewal | Final/archived seasons remain available; next-season creation copies sport configuration and custom contenders, links seasons, and requires fresh manager invitations. Retry returns the same new league. |
| Setup | Optional major-league, college and global sport packs, followed by normal editable setup and competition-edition review. |

## Intentionally deferred / remaining roadmap

- **Real email and live sports data remain deferred at the user's request.** No provider, feed, news, injury data, projections or delivery service was activated.
- Actual AI analysis, predictive recommendations and optimization require approved data/model integrations and evaluation. The shipped guide is explicitly deterministic.
- Sport-specific elimination and tie policies require a separately approved scoring change. Current scoring is preserved as instructed.
- The full local practice draft is now delivered (see the follow-through release below).
- Local creator articles, cross-season rivalry aggregates, downloadable recaps, historical charts and personalized in-app updates are now delivered. Provider-sourced news, external expert content, push/email delivery and predictive AI remain deferred with external integrations.
- Human screen-reader acceptance and first-time-user research remain required before claiming accessibility or usability validation is complete.

## Verification

- `node --test tests/*.test.js`: **22 passing tests**, covering existing account/draft flows and new scenario math, privacy, result revisions, final locks, archive/renewal, catalog additions, edition persistence, and commissioner authorization.
- Browser verification used an isolated data directory and port 4187 for mutations, preserving the user's leagues. Confirmed result preview/save and ledger, poll creation/voting, private note/watch save, two-contender comparison, keyboard navigation and scenario replacement arithmetic.
- Checked mobile overview at 390px with no document overflow. Inspected desktop overview and confirmed no captured browser console errors. This is targeted verification, not a full assistive-technology audit.
- Restarted and opened the actual local app at `http://localhost:4173` with existing user data intact.

Legacy leagues receive additive metadata; existing scores are not reinterpreted. Scoring history begins with new changes and does not fabricate past ranking snapshots. Historical records remain after a draft reset as an audit trail. Custom contenders are manually maintained and appended after the illustrative catalog for timeout ordering.

## Local roadmap follow-through — September 25, 2026

The user explicitly confirmed: **keep external AI deferred; complete local features**. This follow-through completes the remaining implementable local features named in the previous status report:

- **Full simulated draft:** standalone `/practice` works before sign-in and from Home. Four participants, two sports, snake ordering, bots, private practice queue, skipped entries, simulated timeouts, eight-pick board, hypothetical results and shared ranks. Progress survives reload in the same browser tab. Restart never touches a real league.
- **Creator content:** More league tools → Stories & analysis. Any member can write original content, save a private draft, publish to their league, edit their own work, or withdraw it to draft. Authors, timestamps, sport tags and optional source URLs are visible. Commissioners can feature published work. Drafts are filtered by the server; commissioners cannot read other authors' private drafts.
- **Rivalries:** More → History & rivalries. Win/loss/tie totals use finalized linked seasons that the current user can access. Different leagues, provisional results, and inaccessible history are excluded. Managers are matched by identity, not by display name.
- **Recaps:** preview plain-text season recaps before downloading and sharing them yourself. Exports contain standings and roster results, with provisional/sample labels. They omit private research and discussion. Downloads require league membership and an authenticated session.
- **History charts:** choose manager and points/rank. SVG charts show up to 40 recorded updates with an accessible exact-value table. A CSV download contains the recorded history. Draft resets separate the current draft chart from earlier history. No old sporting statistics are reconstructed.
- **Personalization:** More → Your updates has favorite-sport and result/article/draft-reminder preferences, persistent read state, watched/owned contender result updates, and a seven-day upcoming-draft reminder. Home's For you panel shows unread updates across accessible leagues. This is local authored content and in-app information, not live sports news or background push.
- **Accessibility implementation:** semantic chart description and table alternative, keyboard-operable publishing and practice flows, practice-step focus after picks, native recap dialog, labeled fields and reduced-motion styling.

Validation: **26 passing tests**, including complete snake simulation, timeout fallback, linked-season tie accounting, feed filtering/read state, author permissions, API draft privacy, preferences/restart persistence and authenticated recap export. Browser checks completed the practice draft (21 points from champion + runner-up), reload persistence, private-draft-to-published workflow, personalized article updates, mark-read, point/rank chart selection, and an actual recap download. At 390px the history page had no document overflow; captured browser console errors were empty.

Remaining work is deliberately external or human: real email, live sports feeds/news, external AI/predictions, and actual human screen-reader/first-time-user acceptance. No scoring policy changes were made. Human acceptance instructions are in `USER-ACCEPTANCE.md`; they are prepared, not falsely reported as completed research.
