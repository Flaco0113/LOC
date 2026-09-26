# Human acceptance protocol

Status: prepared, not conducted. Engineering browser checks are not a substitute for real participants or screen-reader testing.

Use a separate local test account/sample workspace. Do not reset or edit an existing real league for this exercise.

## First-time participants

Recruit 3–5 people unfamiliar with LOC. Ask them to think aloud without teaching the interface first. Record completion, hesitation, errors and their own words, not inferred satisfaction.

1. Explain what LOC is and how points are earned after visiting the landing page.
2. Complete the practice draft: select a contender, queue a backup, simulate a timeout, watch the reverse round order, finish the roster and apply results.
3. Identify the difference between a completed draft, provisional competition results and a final season.
4. Find research, watch a contender, publish a league article, and locate it in Your updates.
5. Preview a recap and explain what it includes before downloading it.

Success measures: correct one-contender-per-sport explanation; completion without facilitator action; no real-league mutation during practice; understanding that sample data is fictional and current results are commissioner-entered. Record task times as observations, not invented targets. Prioritize any failure that causes incorrect picks, disclosure of private drafts, or misunderstanding of final results.

## Screen-reader and keyboard acceptance

Use NVDA with Chrome/Edge on Windows, and VoiceOver/Safari if supported elsewhere. Record OS, browser, assistive technology version, zoom and viewport.

- Complete a practice draft using keyboard alone. After each pick the current practice heading must receive focus; no keyboard trap.
- Navigate league menus and native disclosures; active page and focus must be understandable.
- Open an article editor, trigger validation, save draft, reopen it, publish, close the dialog with Escape and verify focus returns.
- Verify checkbox labels and saved preferences, update status announcements and read-state text.
- Switch chart metric; read its description and the exact-values table. No essential meaning should depend only on color or SVG geometry.
- Open recap, read/copy its text, follow the download link, and close the dialog.
- At 200% zoom and narrow viewports, ensure fields/actions remain reachable and horizontal scrolling stays within data tables.

For each task record pass/fail, observed issue, reproduction steps, severity and remediation/retest date. Leave untested tasks marked untested. No accessibility conformance certification is claimed by this document.
