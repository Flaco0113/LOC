import fs from 'node:fs';
import path from 'node:path';

const actions = new Set(['signup','login','reset','forgot','verify','reset-link','logout','demo','account','password','email','resend','leagues','invitations','pick','queue','chat','leave','settings','order','invite','retrymail','remove','transfer','status','reset','score','correct']);

export function recordOutcome(directory, pathname, status, elapsedMs) {
  const action = pathname.split('/').at(-1);
  if (!actions.has(action)) return;
  const file = path.join(directory, 'metrics.json');
  const metrics = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : {};
  const day = new Date().toISOString().slice(0,10);
  const key = `${day}:${action}:${status < 400 ? 'completed' : 'failed'}`;
  const row = metrics[key] ||= { count:0, totalMs:0 };
  row.count++; row.totalMs += Math.max(0,Math.round(elapsedMs));
  // Aggregate only: no account/league IDs, email, chat, tokens, or form values.
  for (const old of Object.keys(metrics)) if (old.slice(0,10) < new Date(Date.now()-90*86400000).toISOString().slice(0,10)) delete metrics[old];
  fs.writeFileSync(file+'.tmp',JSON.stringify(metrics,null,2));
  fs.renameSync(file+'.tmp',file);
}
