# LOC redesign implementation — October 2, 2026

Scope: the latest product review, implemented with LOC’s existing placement scoring and commissioner-entered data. Real email, live sports data and external AI remain deferred by the owner.

| ID | Recommendation | Delivered behavior |
| --- | --- | --- |
| Q1 | Mobile draft navigation | Fixed bottom navigation has a bounded height, clears inherited top offsets, reserves content space, and reveals the correct panel. Selection and clock cannot float over content on mobile. |
| Q2 | Honest competition status | Provisional results use amber styling; recorded results awaiting confirmation say so explicitly; finalized/archive states remain distinct. |
| Q3 | Short season picker | Current and next two seasons, including consecutive-year editions, plus custom year entry. Existing season limits and validation remain. |
| Q4 | Readability and hierarchy | Larger body/secondary text, smaller league header spacing, visible keyboard focus, grouped navigation and collapsed advanced scoring controls. |
| Q5 | Invitation clarity | Invitations heading comes first. Share-code settings explain email-free joining. A valid code previews league details before confirming membership. |
| Q6 | Phase-aware readiness | Full leagues show View managers, scheduled leagues show Change draft date, and queue preparation is the primary readiness action. |
| Q7 | Draft control explanations | Lobby selection explains why drafting is unavailable and emphasizes queue additions. |
| Q8 | Useful empty history | Empty charts hide chart controls and link commissioners to results or members to scoring rules. |
| Q9 | Competition consistency | Landing page uses NASCAR organizations and estimated season championship timing; MLB explains October/November. Saved editions are not silently changed. |
| M1 | Simpler league navigation | Four primary destinations, grouped championship tools, visible current tool label, and separate commissioner controls. Your roster is listed first. |
| M2 | Returning-user briefing | Briefings reflect draft/competition phase, queue coverage, result changes since the previous visit on the same device, gap to leader and recorded rank movement. |
| M3 | Demonstrative sample | New isolated samples include fictional score history, pending results, a finalized linked opening edition, a poll, discussion and announcement. A three-step tour explains roster → scoring → scenario. Existing leagues are untouched. |
| M4 | Unified research | Search, sport and eligibility filters, one-click watch controls, comparison tray (maximum three), private notes, and reviewed watched-to-queue additions with server eligibility checks. |
| M5 | Commissioner results workflow | Results grouped by sport with pending entries first. Preview includes points and rank changes; confirmation persists audited results. Manual correction is collapsed. |
| M6 | Easier scenarios | Your contenders first, groups by sport, named champion/runner-up options and custom places, current-versus-scenario table and conflicting champion/runner-up warnings. |
| M7 | Continuous league conversation | Shared draft/discussion messages, pinned announcement summary, discussion unread count on this device, draft-origin labels, contextual links and grouped timeout activity. |
| M8 | Feedback and recovery | Action-specific loading announcements, preserved forms, field errors, explicit retry/reconnect behavior, and last-sync information. |
| M9 | Traceable visualizations | Leader gap, rank movement between recorded revisions, common-scale contribution bars, score ledger, stepped history chart and accessible exact-value table with sources. |
| S1 | Championship impact | Pending owned contenders show the effect of winning while other results stay fixed. Combined scenarios are editable; no odds or guaranteed victory claims are presented. |
| S2 | Personal calendar | Estimated league-edition months paired with your roster, pending/recorded outcomes and the scheduled draft. |
| S3 | League identity | Linked archives, champions, first/second margins, finalized rivalry records, renewal flow and reviewable/downloadable SVG results cards. Renewal explicitly requires managers to accept new membership. |
| S4 | Draft assistant | Rules-based open-slot and queue-coverage guidance, eligible watched contenders and reviewed queue transfer. No inferred athletic performance ranking. |
| S5 | Curated formats and guides | Existing major/college/global presets explain roster length and approximate season shape while preserving scoring. League-authored guides and personalized in-app updates are accessible through championship tools. |

## Deferred dependencies

- Email delivery and email invitations: choose a provider and verify a sender domain before activation.
- Live schedules, scores, sports statistics, injury/news feeds, projections and licensed content: choose and license a data provider.
- External AI recommendations/predictive analytics: choose a provider and approve data use after live data is available.
- Competition-specific elimination, placement/tie constraints and new game/scoring formats: require sport-rule definitions and owner approval. Current warnings flag ambiguous hypothetical outcomes; they do not claim feasibility.
- Automated imported expert content: requires authors, rights and a source. The current product supports attributed league-authored guides.

No historical performance is fabricated for personal leagues. Sample records are fictional and explicitly labeled. Visit/read indicators are device-specific; private notes and queues stay account-scoped on the server.

## Validation

- 39 automated tests covering accounts, hosted persistence, concurrency, permissions, joining, queues, scoring, archives, research and new roadmap helpers.
- Browser checks of research → watch → reviewed queue transfer, commissioner result preview/confirmation, scenario rank changes, history and discussion.
- Mobile draft verified at 390 × 844: Available, Queue, Board, Chat and arrow-key navigation; bottom bar measured approximately 66px rather than covering the screen.
- Public build uses an explicit frontend asset allowlist. Server/database credentials and local data are excluded.
