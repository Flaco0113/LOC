# LOC UX/UI review and implementation brief

Review date: September 23, 2026. Product: League of Champions.

## Assessment

LOC has a useful product foundation: a clear multi-sport premise, explicit scoring rules, separate manager and commissioner surfaces, a searchable draft pool, queues, roster disclosure, and an immersive draft room. Preserve these. The most valuable improvements concern reliability, prioritization, and navigation rather than changing the brand.

The current prototype presents more capability and certainty than its behavior supports. A user can enter draft selections for another manager, draft multiple teams in the same sport despite the advertised one-per-sport rule, and encounter completed-draft sample results in a league with no selections. Commissioner controls log actions without performing them. These inconsistencies undermine confidence more than visual roughness does.

**Recommended order: truthful behavior → reliable draft → simpler navigation and onboarding → accessible shared components → visual refinement.**

### Evidence and limits

This is a source-based heuristic audit of `index.html`, `styles.css`, and `script.js`, covering every implemented screen and its handlers. References below use file names, functions, and approximate current line numbers so findings can be reproduced. UX consequences are expert assessments, not measured user-research results.

Live interaction testing was blocked by the browser's local-file security policy. No current viewport measurements, keyboard walkthrough, screen-reader session, network tests, or rendered contrast certification were completed. Existing `qa/loc-enhanced-desktop.png` and `qa/loc-enhanced-mobile.png` were inspected, but display an older “Premier Fantasy League” identity and green palette; they cannot establish the appearance of the current LOC source. Current CSS conclusions are identified as source-derived risks. Backend deployment and authorization were not audited; findings concern the static frontend, not an assertion about deployed services.

Complexity is relative: Low = localized component/copy change; Medium = coordinated UI/state changes; High = durable data, authorization, synchronization, or several workflows. These are scope estimates, not delivery commitments.

## Prioritized findings

Each entry follows **problem → why it matters → proposed change**, then identifies affected surfaces and complexity.

### Critical — usability failures and major trust risks

**C1. Draft actions do not respect turn ownership or sport slots.** `draftTeam()` (script.js:1152) checks availability and completion, but not whether the signed-in manager owns the turn or already has that sport. `draftQueuedTeam()` sends the user's queue choice into the current manager's turn. The advertised rule is “Draft one team per sport.” A user can unintentionally alter an opponent's roster or create an invalid roster. Enforce turn ownership, sport eligibility, availability, and expected pick version in the authoritative mutation; reflect the same rules in the UI. Show “NBA slot filled” with a route to the roster, and “Your turn in 3 picks” instead of an enabled draft action. Put commissioner overrides in a separate explicit mode with a reason and audit record. Benefit: fair, predictable drafting. Affected: draft pool, queue, detail, board, commissioner. **High.**

**C2. Visiting and leaving the room changes draft timing.** `openDraftRoom()` starts a local countdown; `exitDraftRoom()` stops it (911–934). The clock does not gate on scheduled/paused status; `getDraftRoom()` can initialize an empty room for a league labeled complete. An empty eligible queue stops the clock indefinitely (`autopickQueuedTeam`, 1226). A shared timed competition cannot depend on which screen a participant visits. Use explicit scheduled/live/paused/complete states, an authoritative deadline, and a published timeout policy. Viewing a scheduled room must not start play. Recommend highest-ranked eligible available team as a fallback after queue exhaustion, with that rule disclosed before the draft and agreed as product policy. Benefit: drafts continue predictably across navigation and reconnects. Affected: draft clock, pre-draft lobby, cards, commissioner. **High.**

**C3. Successful-looking actions do not produce the implied outcome.** `handleAdminAction()` (1439) only adds log records; reset-password feedback says email is queued while describing a production-only send; “Leave League” only shows a prototype toast. A commissioner may believe a draft was paused or a score corrected. Implement the operation with pending, committed, and failed states; log success only after commitment. Until implemented, remove the action or explicitly label it “Demo only — no changes saved.” Benefit: users can trust feedback. Affected: commissioner controls, password reset, league actions, audit log. **High overall; Low to make prototype copy honest.**

**C4. User work is not durably represented.** `createLeague()` (1397) ignores date, time, visibility, and draft-order inputs; invitation text becomes a log entry rather than delivery. League creation and invitation acceptance change in-memory arrays, while only users and draft rooms have local persistence. Refresh can remove a new league. Persist supported configuration and membership, preserve failed form input, and show an accurate success screen with saved details. Do not offer configuration that cannot be honored. Benefit: no surprise data loss or imaginary invitations. Affected: creation, invites, league hub. **High.**

**C5. Sample data is mixed with user and league state.** Empty draft results fall back to global `draftPicks`; empty rosters fall back to `teamCatalog`; tracked teams and activity are global (830–909, 1252–1315). New users receive the same seeded leagues. Dashboard best rank and tracked-team total are fixed in HTML. Users cannot reliably distinguish their league, their progress, and examples. Isolate a clearly labeled sample league; scope all normal views to membership and league; use genuine zero states elsewhere. Derive summary values from the same records as detail views. Benefit: coherent standings and ownership. Affected: dashboard, rosters, standings, activity, team details. **High.**

**C6. Account UI is a simulation, not an account-security experience.** `loadUsers/saveUsers`, `submitSignup`, and `submitLogin` persist and compare password values in browser storage. Verification is simulated; Remember Me is never read. This is acceptable only as an explicitly labeled demonstration, not evidence of protected accounts. Use a real authentication flow before inviting real users; remove prefilled identities/passwords from normal forms, implement session persistence deliberately, and separate demo entry. Benefit: expectations match actual protection and persistence. Affected: authentication, verification, account. **High; Low for explicit demo labeling.**

### High Impact — core workflow improvements

**H1. Two global navigation systems compete for attention.** The top app navigation and sidebar repeat Dashboard, My Leagues, Invitations, and Profile (`index.html:28,174`). Below 560px the sidebar becomes a full vertical list above content. Navigation consumes space and creates repetitive keyboard stops. Keep one desktop sidebar; use a compact mobile header and four destinations: Home, Leagues, Invitations, Account. Place Create league on relevant pages. Keep local league navigation inside the league. Benefit: faster orientation and more content space. **Medium.**

**H2. Views have no browser-addressable location.** `showView()` and `setLeagueTab()` toggle classes without routing, history, page titles, or focus movement (608,1317). Users cannot bookmark a league tab or expect Back to follow their journey. Introduce meaningful URLs, preserve list filters, restore scroll on Back, and move focus to the page heading on new navigation. Add “My leagues / Founders Cup” and a league switcher. Make the authenticated brand link go Home; its current `#home` target is in hidden public content. Benefit: reliable “where am I?” and return navigation. Affected: app shell, league tabs, draft exit. **Medium.**

**H3. Draft selection is below secondary content.** Source order is header → clock/order → slots/full board → chat → queue → team detail → available teams. At 820px the action grid becomes a single column. This places the pool late in a potentially long page during a timed task. Move available teams and the selected-team action into the first working region; move board and chat behind secondary tabs on phones. Keep timer and selection summary visible without covering content. Benefit: fewer scrolls and less time pressure. Affected: draft room. **Medium.**

**H4. Re-rendering can interrupt keyboard work; queue reordering requires dragging.** `renderDraftRoom()` regenerates interactive lists after selection/filter/queue changes; queue rows are draggable buttons with a clickable Remove span inside (1027,1490–1536). Focused controls can be replaced, and Remove has no independent keyboard target. Use stable keyed rows, independent labeled buttons, and Move up/Move down controls. Restore focus after removing a row; announce the new queue position. Benefit: keyboard, touch, and assistive-technology users can manage the same strategy. **Medium.**

**H5. Account acquisition loses the user's original task.** Public “Create League” opens signup, then verification leads to the generic dashboard. Six populated signup fields and a permanently visible Forgot Password tab dilute the main action. Retain the create/join intent through authentication; initially request only essential account data, with remaining profile setup later. Put “Forgot password?” beside sign-in. Offer resend, change-email, and expired-link states once real verification exists. Benefit: a direct path to first value. Affected: landing, auth, verification, first use. **Medium UI; High with authentication integration.**

**H6. League setup asks for decisions without explaining their consequences.** Four long sections mix essential configuration with single-option controls, future public visibility, arbitrary prefilled content, and a hard-coded draft date. Time has no visible time-zone context. Use essentials first; disclose draft options progressively, allow scheduling later, and invite after successful creation. Show “8 managers × 4 sports = 32 picks” and the draft time in a named zone. Benefit: lower cognitive load and fewer scheduling mistakes. Affected: create league. **Medium after C4.**

**H7. Modal, tab, and table semantics are incomplete.** Dialogs have ARIA roles but no implemented focus trap, focus restoration, Escape handling, or inert background. The auth dialog label references the Login heading even when another form is displayed. League tablist children lack tab selection/relationships; data tables are generic div/span grids. Implement one accessible dialog, either real ARIA tabs with keyboard behavior or normal navigation links, and semantic tables. Benefit: predictable keyboard and screen-reader use. Affected: auth, team detail, league hub, all tables. **Medium.**

**H8. Standings show totals without a clear explanation path.** Rank and points are static rows; team detail repeats owner and presents odds/progress without provenance or a defined scale. Users need to understand why they lead or trail. Link manager rows to sport-level points; show placement + bonus = total, rules version, and “Updated [time].” Explain tied ranks. Remove unsupported projections and decorative progress percentages until their meaning/source is defined. Benefit: results feel fair and inspectable. Affected: standings, team detail, scoring. **Medium, with data dependency.**

**H9. Account settings are read-only despite promising settings.** `renderProfile()` (763) displays data and password-policy prose, with no editing. Replace it with Profile, Time zone, Security, and Notifications sections containing only supported actions. Show pending/saved/error state beside the edited section, and separate display time zone from the canonical draft instant. Benefit: users can actually maintain their account. **Medium with service integration.**

### Quick Wins — visible benefits with limited UI scope

**Q1. A filtered-out result is described as an empty draft.** `renderDraftResults()` says “No draft picks yet” when filters return zero. Users may think history disappeared. Use “No picks match your filters” plus Clear filters; reserve “No picks yet” for an undrafted league. Show result count and filter state; limit sport choices to the league. Benefit: quick recovery. Affected: draft results and pool. **Low.**

**Q2. Generic actions hide context.** “Open League,” “Open Draft Room,” and “View Draft Results” have similar emphasis on every card. Display one primary action based on state: Prepare for draft, Join live draft, or View standings; keep other destinations as secondary links/menu items. Include the league name in accessible names. Benefit: the next useful action is obvious. Affected: league cards/hub. **Low UI, dependent on reliable state.**

**Q3. Product copy describes implementation rather than user value.** “Real-time ready,” “Prototype surfaces,” “Role-based permissions,” “League portfolio,” and “Command center” obscure simple tasks. Use “Home,” “My leagues,” “Account,” and concrete benefit copy. In the demo, retain one clear demo notice rather than burying caveats in footer prose. Benefit: less interpretation for new users. Affected: public site, dashboard, account. **Low.**

**Q4. Form errors lack field-level recovery.** General auth messages have no explicit field association or alert role; no-sports validation is a transient toast. Associate inline errors with inputs, set invalid state, retain entries, and focus the first error after submit. Add email/name autocomplete tokens and a visible label to draft chat. Benefit: errors can be understood and fixed in place. Affected: forms. **Low–Medium; estimate Medium for shared pattern.**

**Q5. Decline is immediate and unrecoverable in the current UI.** Invitation decline removes the item and only shows a toast. Add Undo for a recoverable decline, or confirmation if the product cannot recover it. Accept should show “You're in [league]” with Open league and draft details. Benefit: fewer accidental losses and a clear next step. Affected: invitations. **Medium including recovery state.**

**Q6. Dashboard numbers outrank urgent tasks.** Four metric cards precede leagues, but do not identify the next draft. Replace the top block with the next relevant event and one CTA; put counts beside section labels and rank inside each league. For no leagues, show Create a league and invitation guidance. Benefit: first-time and returning users immediately know what to do. **Medium.**

### Polish — cohesive visual refinement

**P1. Typography and containers over-emphasize routine content.** CSS uses many 750–900 weights, uppercase eyebrow labels, large workspace headings, and panels nested in panels. Reduce utility text to 400–500, labels/buttons to 600, and headings to 600–700; flatten nested league-card containers and use spacing/dividers for grouping. Keep Sora for the brand and public hero. Benefit: clearer hierarchy and calmer dense screens. Affected: all app views. **Low.**

**P2. Color tokens encode old names instead of meaning.** `--green` aliases blue and `--gold` aliases orange; blue and orange appear in selection, metadata, actions, and decoration. Replace with semantic action/selection/status tokens. Reserve orange for the primary action and restrained brand moments; use text + icon for status. Benefit: consistent expectations and safer future theming. Affected: shared CSS. **Medium.**

**P3. Interaction states are not a complete shared system.** CSS defines hover transforms and some selection/disabled styling but no shared `:focus-visible` treatment or reduced-motion override. Retain native focus until replacements are verified; add explicit focus, pressed, disabled, loading, and selected variants to every control family. Remove lift animations from dense data actions. Benefit: interactions feel stable and legible. **Low–Medium; estimate Medium across all controls.**

**P4. Dense tables are styled as individual cards.** Every row has a border, radius, and inter-row gap; minimum widths are 620px/760px. Use a shared table container, quiet dividers, aligned numeric columns, and tabular numerals. On phones prioritize rank, manager, points; disclose secondary fields in a row detail. Keep deliberate horizontal scrolling for the two-dimensional draft board. Benefit: easier scanning without shrinking text. **Medium.**

## Concrete redesigned experiences

### 1. Home and league navigation

Before: duplicated navigation → generic metrics → equally weighted league actions.

After, desktop: 224px sidebar; flexible main column with 32px gutters; maximum reading width around 1280px. Header contains “Home,” account menu, and a secondary Create league action. First content is a state-aware next-action card. Below it are league rows and compact pending invitations. Do not add a global search until scale justifies it; start with league-list search when users have enough leagues to need it.

```text
LOC                 Home                              Create league
Home                NEXT UP
My leagues          Founders Cup • Draft tonight, 8:00 PM ET
Invitations (2)     8 managers • 4 sports              [Prepare for draft]
Account
                    My leagues                           View all
                    Founders Cup     Scheduled           Prepare
                    Global Trophy    Season live #2      View standings
                    Invitations (2)                      Review
```

Mobile: 16px gutters, compact header, same content priority, labeled bottom navigation with safe-area padding. Do not include both top and bottom destination menus. The draft room uses its own focused layout and explicit Back to league.

League header: breadcrumb → league name + switcher → season/status → one next action. Main destinations: Standings, My roster, Draft, Activity, Rules. Put all managers within roster view; make team detail contextual rather than a competing catalog unless research supports that catalog. Commissioner-only Settings sits beside league identity, separate from the ordinary manager workflow.

Routing proposal: `/home`, `/leagues`, `/leagues/:id/standings`, `/leagues/:id/roster`, `/leagues/:id/draft`, `/invitations`, `/account`. These are proposed routes, not existing endpoints.

### 2. Draft room

Before: full-board overview and chat precede available teams; a generic draft action can submit an implicit selection for another user.

After: the user can always answer “Whose turn?”, “How long?”, “What am I selecting?”, and “What happens on timeout?”

```text
Back to league     Founders Cup     Round 2 · Pick 12 of 32
YOUR TURN          00:42 remaining  Connection: Live
Available teams (24)              Selected team         My queue (3)
[Sport: open slots v] [Search]    Boston Celtics        1 Denver   ↑ ↓ ×
Boston Celtics    NBA   Select    NBA · Slot available  2 Dallas   ↑ ↓ ×
Denver Nuggets    NBA   Select    [Draft Boston Celtics]
...                              [Add to queue]
Board | Recent picks | Chat      Timeout rule: queue, then best eligible
```

Desktop: pool gets roughly half the working width, detail and queue share the rest; keep useful minimum widths and collapse before columns become cramped. Mobile: compact sticky timer; tabs Available / Queue / Board / Chat; available teams are the initial panel. Selecting a team opens a detail sheet with team name, sport, eligibility, and one action. A sticky action area must include enough bottom padding that it never obscures rows or focus.

Default to no team selected on initial entry. After a successful pick, clear the action rather than silently aiming it at the next available team. Do not add a generic confirmation dialog to every time-critical pick: explicit team naming plus a deliberate select → submit sequence is sufficient. Commissioner corrections require a dedicated audited workflow.

Waiting: “Blair is picking. Your turn in 3 picks.” Primary action becomes Add to queue. Pending: “Submitting Boston Celtics…” and prevent repeat submission. Success: “You drafted Boston Celtics · NBA,” update roster/board from committed state, move focus predictably. Conflict: “Boston Celtics was just drafted. Choose another team.” Reconnecting: “Reconnecting — picks temporarily unavailable,” retain search and queue, then reconcile authoritative state. Queue copy: “At timeout, we'll choose your first available eligible team.” Describe the agreed fallback alongside it.

### 3. Create a league and first use

Before: account form → simulated verification → dashboard → four-section setup → commissioner controls.

After: Create league intent → account/verification if needed → essentials → saved league home with onboarding checklist. An invitation instead resumes its league preview after authentication.

Use one concise setup page, not a mandatory four-step wizard: League name, season, manager count, selected sports. Defaults: current season, private league, eight managers; no fabricated league name or description. Description is optional. Show a rules summary and slot count as sports change. “Draft options” expands to schedule/time zone, timer, and order; default schedule to “Set later.” Avoid presenting locked single-choice settings as decisions.

Bottom action: “Create league.” Next screen: “Founders Cup is ready” with Invite managers as the primary action, followed by Schedule draft and Review rules. Show readiness as actual conditions, such as “3 of 8 managers joined,” not arbitrary progress. Invitation delivery reports Sent / Pending / Failed and lets the commissioner retry only failures. A returning commissioner can edit configuration directly without replaying onboarding.

### 4. Standings and score explanation

Before: isolated rank and points values; generic team modal with unexplained progress.

After: title + season + update time; compact “Your position” summary if useful; sortable semantic table defaulting to league rank. Columns: Rank, Manager, Total points, Change (only if a defined comparison period exists). Highlight “You” subtly. A row opens sport breakdown: Team, finish, placement points, bonus, total. Example: “Kansas City Chiefs: 9 placement + 3 champion bonus = 12 points.” Keep Rules one click away and state when points are provisional. If equal totals produce different positions, expose the exact applied tiebreaker rather than showing an unexplained ordering.

### 5. Commissioner and destructive actions

Group settings into League details, Members, Draft, and Scoring. Use actual editable forms and appropriate controls; replace the undifferentiated action-button grid. Only offer transitions that apply to the current draft state. Put reset, removal, and ownership transfer in a separate danger section.

Example reset dialog: “Reset Founders Cup draft?” / “This will remove 24 picks and clear all rosters. League membership and scoring rules will stay the same.” Counts and consequences must be computed from the real operation. Actions: Cancel and Reset draft. Require an explanation for administrative score overrides, show old → new values, and record actor, time, and reason after success. If a reset can be safely reversed, offer a supported recovery mechanism; do not invent Undo copy without recovery support.

## Shared LOC design system

These are proposed starting tokens, not verified rendered specifications. Preserve the navy/blue/orange identity; test the actual combinations and composited surfaces before adopting.

| Foundation | Proposed rule |
|---|---|
| Background | `color.bg = #030A14`; no large gradient inside data workspaces |
| Surfaces | `surface.default = #081A33`, `surface.raised = #0B1F3D`; elevation means overlays, not every card |
| Text | `text.primary = #F7F9FC`, `text.secondary = #B9C2CF`; do not dim essential information with opacity |
| Primary action | `action.primary.bg = #FF6A00`, `action.primary.text = #160900`; one dominant action per task region |
| Selection | `selection.bg = #102B52`, `selection.text = #F7F9FC`; pair with checkmark/edge indicator |
| Status | Proposed foregrounds: success `#6EE7B7`, warning `#FCD34D`, danger `#FCA5A5`, info `#93C5FD`, on dark surfaces; always include a label |
| Focus | Proposed `focus.ring = #93C5FD`, 2px solid, 3px offset; verify visibility against adjacent colors |
| Typography | Inter UI: 12 metadata (nonessential only), 14 labels/table data, 16 body/forms, 20 section heading, 28 page title; body line-height 1.5; Sora for brand/hero |
| Weight | 400 body, 500 supporting emphasis, 600 controls, 600–700 headings; tabular numerals for time/points |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64px; typical card padding 24 desktop / 16 mobile |
| Radius | 8px controls, 12px containers/dialogs, pill only for compact status; avoid independently rounded table rows |
| Borders/shadows | Quiet surface dividers; stronger verified boundaries for inputs; one overlay shadow `0 16px 48px #0006`; no permanent CTA glow |
| Icons | One consistent outline family, 20px default / 16px in dense rows; labels on unfamiliar actions; decorative icons hidden from assistive tech |

| Component | Required contract |
|---|---|
| Button | Primary, secondary, ghost, danger; default/hover/pressed/focus/disabled/loading. Loading retains width and accessible name. 44px product target on touch. |
| Field | Persistent label, optional hint, required indicator, inline error linked to input; visible invalid state; native input behavior and autofill. |
| Card | Title, essential facts, one primary action, optional secondary actions; no overlapping nested click targets. |
| Table | Caption, scoped headers, aligned numbers, sorting with announced direction, selected/current-user state, dedicated loading/empty/error states. |
| Tabs | Selected state and panel association; arrow-key behavior if using ARIA tabs. Use links instead for route navigation. |
| Dropdown | Prefer native select for simple choices. Action menus need Escape, focus return, and full keyboard support; no hover-only entry point. |
| Dialog/sheet | Correct title, initial focus, contained tab order, inert background, Escape where appropriate, visible close, restored trigger focus. |
| Toast/banner | Toast for transient confirmation; persistent banner for reconnect/error requiring action. Destructive recovery must last long enough and have another recovery path when needed. |
| Status | Icon + plain label; distinguish scheduled, live, paused, complete, provisional, failed. Keep status visually separate from clickable buttons. |
| Search/filter | Result count, Clear filters, preserved state on return; no sorting/filters that the data cannot support. |

## State inventory and feedback specifications

| Situation | Intended experience and sample copy |
|---|---|
| New user, no leagues | “Your first championship starts here.” Create a league; secondary “Have an invitation? View invitations.” |
| No invitations | “You're all caught up. New invitations will appear here.” Avoid a forced CTA. |
| Draft not started | Scheduled date/time/zone, roster requirements, Prepare queue; no fabricated draft results. |
| Filter has no matches | “No teams match these filters.” Clear filters; retain query until user clears it. |
| Loading | Stable skeleton for initial lists; retain existing rows during background refresh; announce busy state once. |
| Save in progress | “Saving…” on the initiating control; prevent duplicate mutation; keep context visible. |
| Save failed | “We couldn't save the draft time. Your changes are still here.” Retry near the form. |
| Partial invitation failure | “5 invitations sent. 2 couldn't be sent.” Identify failures and retry them individually. |
| Draft submission conflict | Explain taken team/expired turn, refresh eligibility, retain queue and filters. |
| Offline/reconnecting | Persistent connection banner and last update time; disable mutations that cannot safely queue. |
| Draft complete | Completion summary, roster review, View standings; remove clock urgency and draft controls. |
| Session expired | Explain sign-in requirement, preserve safe unsaved work and intended route, then return after authentication. |

Current synchronous local rendering does not demonstrate asynchronous loading and recovery. These states are requirements for service integration, not claims that network testing found them broken.

## Accessibility review and acceptance criteria

Target WCAG 2.2 AA. Source inspection identifies risks; it does not constitute a conformance determination. Relevant requirements include keyboard access, visible and unobscured focus, semantic relationships, error identification, status messages, alternatives to dragging, and target sizing. Text generally needs 4.5:1 contrast, or 3:1 for qualifying large text; essential non-text boundaries/states generally need 3:1. AA target size is generally 24×24 CSS pixels with exceptions; LOC should prefer 44×44 touch controls as its product standard. See the [W3C WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/).

Specific work:

- Add a skip link, meaningful page headings, and current-page navigation semantics. Test route changes and browser Back with keyboard focus.
- Replace div tables with native tables; provide mobile row details without losing header associations.
- Apply the shared focus treatment to navigation, cards, queue actions, tabs, and dialogs. No custom focus CSS currently does not prove invisible focus: inspect native rendering before reporting a failure.
- Implement queue Move up/Move down/Remove buttons and announce resulting position; dragging remains optional.
- Remove `aria-live` from the entire draft room. Its clock changes every second. Use a small dedicated status region for turn changes, submitted picks, and selected thresholds; test announcement frequency with assistive technology.
- Add a persistent visible chat label; link auth validation to fields; repair the dialog name when switching forms. Keep the existing useful wrapped labels elsewhere.
- Use text and icons in addition to color for statuses and selection; test token combinations, translucent backgrounds, and hero text over the actual image.
- Test 320px reflow, 200% text enlargement, and 400% zoom. Allow deliberate board/table scrolling where two-dimensional meaning requires it, but avoid page-wide clipping. `body { overflow-x: hidden }` is not proof that content fits.
- Respect reduced-motion preferences for smooth scrolling and transitions. Make the timed-draft policy explicit and assess timing requirements/exceptions for this real-time activity; do not assume a personal pause is compatible with multiplayer fairness.

Dialogs should move focus inside, contain Tab navigation, and return focus to the trigger when closed. Follow the [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for keyboard and labeling details.

## Delivery sequence and validation

**1 — Establish truth and durable state.** C1–C6. First label the demo accurately and remove false capability claims. Then define draft rules/states, league scope, persistence, and real account behavior. Acceptance: newly created league survives reload; scheduled/paused rooms do not advance; only the permitted manager can submit an eligible pick; an administrative failure never yields a success audit event; new leagues show no sample history.

**2 — Simplify the core experience.** H1–H6, Q1–Q6. Build the shell, state-aware Home/cards, resumable onboarding, concise setup, and pool-first draft layout. Acceptance: invited users resume joining after sign-in; browser Back returns to the prior filtered view; managers can select and draft on mobile without visiting chat/board; invalid sport selection cannot be submitted.

**3 — Consolidate accessible components and polish.** H7–H9, P1–P4. Implement fields, buttons, dialogs, tables, and feedback once; apply across screens. Verify current screenshots, keyboard behavior, zoom, screen-reader output, and contrast. The UI should not be called accessibility-compliant until tested.

Fresh browser review should cover 1440×900, 1024×768, 390×844, and 320px width, plus landscape and zoom. Test first-time user, returning manager, and commissioner separately. Include long names, 12 managers, all supported sports, no leagues, no results, slow requests, server errors, lost connection, simultaneous picks, expired sessions, and refresh during submission. Confirm that pending actions are idempotent and focus survives list changes.

Usability sessions: ask new users to explain the game, create or join a league, and find their next action; ask frequent users to prepare a queue, draft, explain a points change, and switch leagues; ask commissioners to schedule, pause, and correct a draft. Measure task success, time to first valid league/queue, wrong-turn navigation, drafting errors, and score comprehension. Establish a baseline before promising numerical improvements. Instrument completed outcomes and failures, not clicks alone; avoid capturing chat content or sensitive field values in analytics.

## Preserve what works

Keep the distinctive dark sports identity, explicit placement/bonus rules, searchable and filterable draft pool, queues, roster disclosure, labeled forms, textual status labels, and dedicated draft focus mode. Improve their behavior and hierarchy instead of replacing familiar concepts with decorative novelty.
