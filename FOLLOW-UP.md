# Deferred integrations and release validation

## Product decision — September 24, 2026

Finish and review the local enhancements before connecting real email or live
sports data. The user explicitly deferred both integrations. Keep email disabled
and use the illustrative catalog and commissioner-entered results for now.
Publishing source changes to GitHub does not activate either integration.

## Return to after local review

- **Real email:** choose the provider and verified sender/domain, configure
  credentials outside Git, then test verification, recovery and invitations in
  actual inboxes, including failures and retries. Existing preview/provider test
  code is preparation only; it does not establish real delivery.
- **Live sports data:** choose provider and coverage for all supported sports;
  define competition/season mappings, refresh cadence, source timestamps,
  provisional/final results, correction handling and stale-feed feedback before
  connecting the feed. Preserve commissioner oversight and the scoring audit log.
- **Hosted backend:** plan migration from the local store, hosted authentication,
  durable draft scheduling, backups and deployment. Inspect the existing Supabase
  project before applying changes. Its existing schema is not connected to this
  local app, and this enhancement pass makes no remote database changes.

## Release acceptance

Complete screen-reader sessions, physical-device checks, 200% text enlargement,
400% browser zoom, and the real-user usability sessions in `UX-VALIDATION.md`.
These remain validation work, not claims of completed certification or research.

See `UX-VALIDATION.md` for the implemented audit findings and observed checks.

## Product review follow-through (September 25, 2026)

The new local championship workspace is documented in [CHAMPIONSHIP-IMPLEMENTATION.md](CHAMPIONSHIP-IMPLEMENTATION.md), including delivered features, verification and remaining strategic extensions. Keep real email/live data disabled until explicitly authorized. Preserve placement points and bonuses; new sport-specific scoring policies need a separate decision. Full simulated onboarding, local creator articles, cross-season rivalry analytics, downloadable recaps, history charts and personalized local updates are now implemented. Human acceptance and deferred external integrations remain open; see the latest implementation record.
