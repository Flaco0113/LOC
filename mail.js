import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function mailConfiguration(env = process.env) {
  const mode = env.LOC_EMAIL_MODE || 'disabled';
  if (!['disabled', 'resend', 'preview'].includes(mode)) throw new Error('LOC_EMAIL_MODE must be disabled, resend, or preview.');
  if (mode === 'resend' && (!env.RESEND_API_KEY || !env.LOC_EMAIL_FROM)) throw new Error('Email requires RESEND_API_KEY and LOC_EMAIL_FROM.');
  const baseUrl = new URL(env.LOC_PUBLIC_URL || `http://localhost:${env.PORT || 4173}`);
  if (!['http:', 'https:'].includes(baseUrl.protocol)) throw new Error('Invalid LOC_PUBLIC_URL.');
  return { mode, enabled: mode !== 'disabled', from: env.LOC_EMAIL_FROM, key: env.RESEND_API_KEY, baseUrl: baseUrl.origin };
}

export function enqueueMail(db, to, subject, text, reference = {}) {
  db.mail ||= [];
  const message = { id: crypto.randomUUID(), to, subject, text, ...reference, status: 'pending', at: Date.now(), attempts: 0 };
  db.mail.push(message);
  return message;
}

export async function deliverMail(message, config, dataDir, send = fetch) {
  if (config.mode === 'preview') {
    // A filesystem-only testing mailbox. Never exposed by the HTTP server.
    const dir = path.join(dataDir, 'mail-preview');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, message.id + '.json'), JSON.stringify({ to: message.to, subject: message.subject, text: message.text }, null, 2));
    return 'preview';
  }
  if (config.mode !== 'resend') throw new Error('Email delivery is not configured.');
  const response = await send('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json', 'Idempotency-Key': message.id },
    body: JSON.stringify({ from: config.from, to: [message.to], subject: message.subject, text: message.text }),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}. Retry delivery.`);
  const result = await response.json();
  if (!result.id) throw new Error('Email provider did not confirm acceptance.');
  return 'sent'; // Provider accepted; this is not a claim of inbox delivery.
}
