# Optional email delivery

Email sending is disabled by default. The application remains usable with local
invitations and recovery codes. No API keys or local account records belong in Git.

## Configure

Copy `.env.example` to `.env`, which Git ignores. Choose one mode:

- `disabled`: no delivery and no claims of email verification.
- `preview`: messages are written to `.local/mail-preview/`. This is a filesystem
  testing mailbox, not real email verification or proof of identity.
- `resend`: set `RESEND_API_KEY` and `LOC_EMAIL_FROM` to a sender on a verified
  domain. The server sends through the Resend email API. Keep the key in `.env`.

Restart with `Start-LOC.cmd`, which loads `.env`, or use
`node --env-file=.env server.js`. Stop an already running instance first; a
launcher connecting to an existing server does not reload its environment.

`LOC_PUBLIC_URL` supplies the origin used in links. For the local edition this
is `http://localhost:4173`. Recipients must open those links on this computer.
Changing this variable does not expose the loopback server or deploy a website.
A publicly accessible service needs a separate hosting/database deployment.

## Implemented behavior

- Signup queues a verification link when email is enabled. Account shows its
  pending/sent/failed status, verification state, resend, and change-email controls.
- Links expire in 30 minutes and are single-use. Resending supersedes older links.
  Verification requires an explicit button click, avoiding consumption by link scanners.
- Changing email requires the current password. The old address remains active
  until the new one is verified. Invitations require verification in email mode.
- Forgot password returns the same message for known and unknown accounts. A
  successful reset rotates recovery codes and revokes other sessions.
- Invitation delivery runs from a persisted queue. Commissioners can retry failed
  messages individually. Provider requests use stable idempotency keys.
- `sent` means accepted by the provider, not proven delivery to an inbox.
- Sample accounts never send invitation emails. Tests explicitly use disabled or
  preview mode and do not contact a real delivery service.

The adapter follows the [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
and [idempotency contract](https://resend.com/docs/dashboard/emails/idempotency-keys).
Real sending remains unverified until a service key and sender are configured.
