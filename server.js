import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { recordOutcome } from './metrics.js';
import { catalog } from './catalog.js';
import { mailConfiguration, enqueueMail, deliverMail } from './mail.js';
const mailConfig=mailConfiguration();

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.LOC_DATA_DIR || path.join(root, '.local');
fs.mkdirSync(dataDir, { recursive: true });
const dataFile = path.join(dataDir, 'store.json');
let db = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : { users: [], sessions: {}, leagues: [], invites: [], revision: 0 };
const port = Number(process.env.PORT || 4173);
const id = () => crypto.randomUUID();
const now = () => Date.now();
const fail = (status, message, field) => { throw Object.assign(new Error(message), { status, field }); };
const requireThat = (condition, message, field) => { if (!condition) fail(422, message, field); };
const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);
const email = v => clean(v).toLowerCase();
const hash = v => crypto.createHash('sha256').update(v).digest('hex');
function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) { return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`; }
function passwordMatch(password, stored) { if (!stored) return false; const [salt] = stored.split(':'); return crypto.timingSafeEqual(Buffer.from(passwordHash(password, salt)), Buffer.from(stored)); }
function passwordValid(password) { requireThat(typeof password === 'string' && password.length >= 10 && password.length <= 128, 'Use 10–128 characters. A long passphrase works well.', 'password'); }
function persist() { db.revision++; fs.writeFileSync(`${dataFile}.tmp`, JSON.stringify(db, null, 2)); fs.renameSync(`${dataFile}.tmp`, dataFile); }
function transaction(fn) {
  const before = structuredClone(db);
  try { const result = fn(); persist(); if(result && 'revision' in result)result.revision=db.revision; return result; } catch (error) { db = before; throw error; }
}
function publicUser(u) { return { id: u.id, name: u.name, email: u.email, zone: u.zone, sample: !!u.sample, notifications: u.notifications !== false, verified: !!u.verified, pendingEmail:u.pendingEmail||null }; }
function member(l, uid) { return l.members.some(m => m.id === uid); }
function leagueFor(uid, lid) { const l = db.leagues.find(l => l.id === lid && member(l, uid)); if (!l) fail(404, 'League unavailable. It may have been removed or your membership changed.'); return l; }
function commissioner(l, uid) { if (l.owner !== uid) fail(403, 'Only the commissioner can make this change.'); }
function activity(l, uid, text) { l.activity.unshift({ id: id(), at: now(), actor: db.users.find(u => u.id === uid)?.name || 'Draft clock', text }); l.updated = now(); }
function teams(l) { return l.sports.flatMap(sport => catalog[sport].map((name, rank) => ({ id: `${sport}:${rank}`, name, sport, rank: rank + 1 }))); }
function current(l) { const n = l.members.length, i = l.picks.length, round = Math.floor(i / n); return l.members[round % 2 ? n - 1 - i % n : i % n]; }
function eligible(l, uid) { return teams(l).filter(t => !l.picks.some(p => p.team.id === t.id || (p.userId === uid && p.team.sport === t.sport))); }
function pick(l, uid, teamId, expected, overrideReason) {
  requireThat(l.status === 'live', 'The draft is not live.');
  if (expected !== l.version) fail(409, 'The draft changed. Review the current turn and choose again.');
  const turn = current(l);
  if (!overrideReason && turn.id !== uid) fail(403, 'It is not your turn. Add this team to your queue instead.');
  if (overrideReason) { commissioner(l, uid); requireThat(overrideReason.length >= 5, 'Explain the commissioner override.', 'reason'); }
  const team = eligible(l, turn.id).find(t => t.id === teamId);
  if (!team) fail(409, 'This team was taken or that sport slot is already filled.');
  l.picks.push({ id: id(), userId: turn.id, team, at: now(), finish: null, override: null, number: l.picks.length + 1 });
  Object.keys(l.queues).forEach(k => l.queues[k] = l.queues[k].filter(t => t !== team.id));
  l.version++;
  activity(l, overrideReason ? uid : turn.id, `Drafted ${team.name} (${team.sport})${overrideReason ? ` · Commissioner override: ${overrideReason}` : ''}.`);
  if (l.picks.length === l.members.length * l.sports.length) { l.status = 'complete'; l.deadline = null; activity(l, null, 'Draft complete. All sport slots filled.'); }
  else l.deadline = now() + l.timer * 1000;
}
function advanceClocks() {
  const due = db.leagues.filter(l => l.status === 'live' && l.deadline <= now());
  if (!due.length) return;
  transaction(() => due.forEach(l => {
    const turn = current(l), pool = eligible(l, turn.id), queue = l.queues[turn.id] || [];
    const team = queue.map(t => pool.find(p => p.id === t)).find(Boolean) || pool.sort((a,b) => a.rank - b.rank || a.sport.localeCompare(b.sport))[0];
    if (!team) { l.status = 'paused'; l.deadline = null; activity(l, null, 'Draft paused: no eligible team available. Commissioner action required.'); return; }
    pick(l, turn.id, team.id, l.version);
    activity(l, null, `Timeout: ${turn.name} received ${team.name} from ${queue.includes(team.id) ? 'their queue' : 'the highest-ranked eligible available teams'}.`);
  }));
}
function points(p) { if (p.override !== null) return p.override; return p.finish ? Math.max(0, 10 - p.finish) + (p.finish === 1 ? 3 : p.finish === 2 ? 1 : 0) : 0; }
function standings(l) {
  const rows = l.members.map(m => { const picks = l.picks.filter(p => p.userId === m.id); return { ...m, total: picks.reduce((s,p) => s + points(p), 0), drafted: picks.length }; }).sort((a,b) => b.total-a.total || a.name.localeCompare(b.name));
  rows.forEach((r,i) => r.rank = i && r.total === rows[i-1].total ? rows[i-1].rank : i+1); return rows;
}
function leagueView(l, uid) { return { ...l, outgoingInvitations:l.owner===uid?db.invites.filter(i=>i.leagueId===l.id).map(i=>({id:i.id,email:i.email,status:i.status,delivery:(db.mail||[]).filter(m=>m.inviteId===i.id).at(-1)?.status||'local'})):[], queues: { [uid]: l.queues[uid] || [] }, standings: standings(l), teams: teams(l), eligibleIds: eligible(l, uid).map(t => t.id), current: l.status === 'complete' ? null : current(l), commissioner: l.owner === uid, picks: l.picks.map(p => ({ ...p, points: points(p) })) }; }
function snapshot(u) {
  return { emailMode:mailConfig.mode, emailStatus:u?(db.mail||[]).filter(m=>m.userId===u.id).slice(-1).map(m=>({status:m.status,error:m.error||null}))[0]||null:null, user: u ? publicUser(u) : null, revision: db.revision, serverTime: now(), sports: Object.keys(catalog), leagues: u ? db.leagues.filter(l => member(l,u.id)).map(l => leagueView(l,u.id)) : [], invitations: u ? db.invites.filter(i => i.email === u.email).map(i => ({ ...i, league: db.leagues.find(l => l.id === i.leagueId) && ((l) => ({ name: l.name, sports: l.sports, season: l.season, capacity: l.capacity, joined: l.members.length, scheduled: l.scheduled, owner: l.members.find(m => m.id === l.owner)?.name }))(db.leagues.find(l => l.id === i.leagueId)) })) : [] };
}
function newLeague(u, b) {
  requireThat(clean(b.name).length >= 3, 'Enter a league name with at least 3 characters.', 'name');
  requireThat(Number.isInteger(+b.capacity) && +b.capacity >= 4 && +b.capacity <= 12, 'Choose 4–12 managers.', 'capacity');
  requireThat(Array.isArray(b.sports) && b.sports.length && new Set(b.sports).size === b.sports.length && b.sports.every(s => catalog[s]), 'Select at least one supported sport.', 'sports');
  requireThat(Number.isInteger(+b.season) && +b.season >= 2026 && +b.season <= 2100, 'Choose a season from 2026 to 2100.', 'season');
  const scheduled = b.scheduled ? Date.parse(b.scheduled) : null;
  requireThat(!b.scheduled || (Number.isFinite(scheduled) && scheduled > now()), 'Choose a future draft date, or schedule later.', 'scheduled');
  requireThat([30,60,90,120].includes(+b.timer), 'Choose a valid pick timer.', 'timer');
  const l = { id: id(), createdAt: now(), name: clean(b.name), description: clean(b.description,500), season: +b.season, capacity: +b.capacity, sports: b.sports, scheduled, timer: +b.timer, order: b.order === 'manual' ? 'manual' : 'random', owner: u.id, members: [{ id:u.id, name:u.name }], sample: !!u.sample, status:'scheduled', picks:[], queues:{}, chat:[], activity:[], version:0, deadline:null, remaining:null, locked:false, updated:now() };
  db.leagues.push(l); activity(l,u.id,'Created the league.'); return l;
}
function sampleUser(name) { const u = { id:id(), name, email:`${id()}@sample.local`, zone:'America/New_York', sample:true }; db.users.push(u); return u; }
function createSample() {
  const u = sampleUser('Alex Morgan'), rivals = ['Blair Lee','Casey Grant','Jordan Mills'].map(sampleUser);
  const l = newLeague(u, { name:'Founders Cup', season:2026, capacity:4, sports:['NBA','NFL','MLB','NHL'], timer:60 });
  l.members.push(...rivals.map(r => ({id:r.id,name:r.name}))); l.status='live';
  while(l.status !== 'complete') { const turn=current(l), team=eligible(l,turn.id)[0]; pick(l,turn.id,team.id,l.version); }
  l.picks.forEach((p,i) => p.finish=(i*3)%8+1); activity(l,u.id,'Loaded illustrative sample results. These are not live sports scores.');
  const prep = newLeague(u,{name:'Sunday Club',season:2026,capacity:4,sports:['NBA','NFL','MLB','NHL'],timer:60,scheduled:new Date(now()+86400000).toISOString()});
  prep.members.push(...rivals.map(r => ({id:r.id,name:r.name})));
  const inv = newLeague(rivals[0],{name:'Global Trophy',season:2026,capacity:4,sports:['UEFA Champions League','NASCAR','Masters Tournament'],timer:60});
  db.invites.push({id:id(),leagueId:inv.id,email:u.email,status:'pending',at:now()});
  return u;
}
const attempts = new Map();
function rateLimit(req) { const key=req.socket.remoteAddress, bucket=attempts.get(key)||{n:0,at:now()}; if(now()-bucket.at>60000){bucket.n=0;bucket.at=now();} bucket.n++; attempts.set(key,bucket); if(bucket.n>30) fail(429,'Too many attempts. Please wait a minute.'); }
function readSession(req) { const token=(req.headers.cookie||'').split('; ').find(c=>c.startsWith('loc_session='))?.slice(12); const session=token && db.sessions[hash(token)]; return session && session.expires>now() ? db.users.find(u=>u.id===session.userId) : null; }
function session(res,u,remember) { const token=crypto.randomBytes(32).toString('hex'); db.sessions[hash(token)]={userId:u.id,expires:now()+(remember?30:1)*86400000}; res.setHeader('Set-Cookie',`loc_session=${token}; HttpOnly; SameSite=Strict; Path=/${remember?'; Max-Age=2592000':''}`); }
async function body(req) { let text=''; for await(const chunk of req) { text+=chunk; if(text.length>32000) fail(413,'Request too large.'); } try{return JSON.parse(text||'{}');}catch{fail(400,'Invalid request.');} }

function emailToken(u,kind,address=u.email){
  db.emailTokens ||= [];
  db.emailTokens=db.emailTokens.filter(t=>t.expires>now()&&!(t.userId===u.id&&t.kind===kind));
  for(const m of db.mail||[])if(m.userId===u.id&&m.kind===kind&&['pending','failed'].includes(m.status)){m.status='superseded';delete m.text;}
  const token=crypto.randomBytes(32).toString('hex');
  db.emailTokens.push({hash:hash(token),userId:u.id,kind,email:address,expires:now()+30*60000});
  const purpose=kind==='reset'?'Reset your LOC password':'Verify your LOC email';
  enqueueMail(db,address,purpose,purpose+' using this one-time link (expires in 30 minutes):\n'+mailConfig.baseUrl+'/#'+kind+'='+token+'\n\nIf you did not request this, ignore this message.',{userId:u.id,kind});
}
function consumeEmailToken(token,kind){const t=(db.emailTokens||[]).find(t=>t.hash===hash(String(token||''))&&t.kind===kind);requireThat(t&&t.expires>now(),'This link expired or was already used. Request a new link.','token');db.emailTokens=db.emailTokens.filter(x=>x!==t);return t;}
function requireMail(){requireThat(mailConfig.enabled,'Email delivery is not configured. Use your recovery code.');}
let delivering=false;
async function flushMail(){
  if(delivering||!mailConfig.enabled)return;delivering=true;
  try{const message=(db.mail||[]).find(m=>m.status==='pending');if(!message)return;const copy=structuredClone(message);
    try{const status=await deliverMail(copy,mailConfig,dataDir);transaction(()=>{const live=db.mail.find(m=>m.id===copy.id);if(live.status!=='pending')return;live.status=status;live.sentAt=now();delete live.text;delete live.error;});}
    catch(error){transaction(()=>{const live=db.mail.find(m=>m.id===copy.id);if(live.status!=='pending')return;live.status='failed';live.attempts++;live.error='Email delivery failed. Check the service configuration and retry.';});}
  }finally{delivering=false;}
}

function auth(u) { if(!u) fail(401,'Your session expired. Sign in to continue.'); }
function api(req,res,pathname,b,u) {
  if(req.method==='GET' && pathname==='/api/state') return snapshot(u);
  if(req.method!=='POST') fail(405,'Method not supported.');
  if(pathname==='/api/auth/demo') { rateLimit(req); return transaction(()=>{u=createSample();session(res,u,true);return snapshot(u);}); }
  if(pathname==='/api/auth/signup') { rateLimit(req); return transaction(()=>{
    requireThat(clean(b.name).length>=2,'Enter your name.','name'); requireThat(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email(b.email)),'Enter a valid email address.','email');
    requireThat(!db.users.some(u=>u.email===email(b.email)),'An account already uses this email. Sign in instead.','email'); passwordValid(b.password);
    try{new Intl.DateTimeFormat('en',{timeZone:b.zone||'America/New_York'});}catch{fail(422,'Choose a valid time zone.','zone');} const recovery=crypto.randomBytes(18).toString('hex'); u={id:id(),name:clean(b.name),email:email(b.email),password:passwordHash(b.password),recovery:hash(recovery),zone:clean(b.zone)||'America/New_York',notifications:true};
    db.users.push(u); if(mailConfig.enabled)emailToken(u,'verify'); session(res,u,!!b.remember); return {...snapshot(u), recovery};
  }); }
  if(pathname==='/api/auth/login') { rateLimit(req); const found=db.users.find(x=>!x.sample&&x.email===email(b.email)); if(!found || !passwordMatch(typeof b.password==='string'?b.password:'',found.password)) fail(401,'Email or password is incorrect.'); return transaction(()=>{session(res,found,!!b.remember);return snapshot(found);}); }
  if(pathname==='/api/auth/reset') { rateLimit(req); return transaction(()=>{ const found=db.users.find(x=>!x.sample&&x.email===email(b.email)); if(!found||found.recovery!==hash(clean(b.recovery))) fail(422,'Email or recovery code is incorrect.','recovery'); passwordValid(b.password); found.password=passwordHash(b.password); const recovery=crypto.randomBytes(18).toString('hex'); found.recovery=hash(recovery); Object.keys(db.sessions).forEach(k=>{if(db.sessions[k].userId===found.id)delete db.sessions[k];}); session(res,found,false); return {...snapshot(found),recovery}; }); }
  if(pathname==='/api/auth/forgot'){rateLimit(req);requireMail();return transaction(()=>{const found=db.users.find(x=>!x.sample&&x.email===email(b.email));if(found)emailToken(found,'reset');return {...snapshot(u),message:'If that account exists, a reset link has been queued.'};});}
  if(pathname==='/api/auth/verify'){rateLimit(req);return transaction(()=>{const t=consumeEmailToken(b.token,'verify'),found=db.users.find(x=>x.id===t.userId);requireThat(found,'Account unavailable.');requireThat(!db.users.some(x=>x.id!==found.id&&x.email===t.email),'That email is already in use.');found.email=t.email;found.verified=true;delete found.pendingEmail;return {...snapshot(u),message:'Email verified. You can now accept invitations.'};});}
  if(pathname==='/api/auth/reset-link'){rateLimit(req);return transaction(()=>{passwordValid(b.password);const t=consumeEmailToken(b.token,'reset'),found=db.users.find(x=>x.id===t.userId);requireThat(found&&found.email===t.email,'This link no longer matches your account. Request a new one.');found.password=passwordHash(b.password);const recovery=crypto.randomBytes(18).toString('hex');found.recovery=hash(recovery);Object.keys(db.sessions).forEach(k=>{if(db.sessions[k].userId===found.id)delete db.sessions[k];});session(res,found,false);return {...snapshot(found),recovery};});}
  auth(u);
  if(pathname==='/api/account/email'){rateLimit(req);requireMail();return transaction(()=>{requireThat(!u.sample,'Create a personal account first.');requireThat(passwordMatch(b.password||'',u.password),'Enter your current password.','password');const address=email(b.email);requireThat(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address),'Enter a valid email.','email');requireThat(!db.users.some(x=>x.id!==u.id&&x.email===address),'This email is already in use.','email');u.pendingEmail=address;emailToken(u,'verify',address);return snapshot(u);});}
  if(pathname==='/api/account/resend'){rateLimit(req);requireMail();return transaction(()=>{requireThat(!u.sample,'Create a personal account first.');emailToken(u,'verify',u.pendingEmail||u.email);return snapshot(u);});}

  if(pathname==='/api/auth/logout') return transaction(()=>{ const token=(req.headers.cookie||'').split('; ').find(c=>c.startsWith('loc_session='))?.slice(12); if(token)delete db.sessions[hash(token)];res.setHeader('Set-Cookie','loc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return snapshot(null); });
  if(pathname==='/api/account') return transaction(()=>{ requireThat(clean(b.name).length>=2,'Enter your name.','name'); try{new Intl.DateTimeFormat('en',{timeZone:b.zone});}catch{fail(422,'Choose a valid time zone.','zone');} u.name=clean(b.name);u.zone=b.zone;u.notifications=!!b.notifications;db.leagues.forEach(l=>l.members.forEach(m=>{if(m.id===u.id)m.name=u.name;}));return snapshot(u); });
  if(pathname==='/api/account/password') return transaction(()=>{requireThat(!u.sample,'Sample accounts do not have passwords.');requireThat(passwordMatch(b.currentPassword||'',u.password),'Current password is incorrect.','currentPassword');passwordValid(b.password);u.password=passwordHash(b.password);Object.keys(db.sessions).forEach(k=>{if(db.sessions[k].userId===u.id)delete db.sessions[k];});session(res,u,false);return snapshot(u);});
  if(pathname==='/api/leagues') return transaction(()=>{const existing=b.requestId&&db.leagues.find(l=>l.owner===u.id&&l.requestId===b.requestId);const l=existing||newLeague(u,b);if(b.requestId)l.requestId=clean(b.requestId);return {...snapshot(u),createdId:l.id};});
  if(pathname==='/api/invitations') return transaction(()=>{
    const i=db.invites.find(i=>i.id===b.id&&i.email===u.email);if(!i)fail(404,'Invitation unavailable.'); const l=db.leagues.find(l=>l.id===i.leagueId);requireThat(l,'This league is no longer available.');
    if(b.action==='accept') { requireThat(!mailConfig.enabled||u.sample||u.verified,'Verify your email in Account before accepting invitations.'); requireThat(i.status==='pending','This invitation is no longer pending.');requireThat(l.status==='scheduled'&&!l.locked,'This league is not accepting managers.');requireThat(l.members.length<l.capacity,'This league is full. Ask the commissioner for a place.');if(!member(l,u.id))l.members.push({id:u.id,name:u.name});i.status='accepted';activity(l,u.id,'Joined the league.'); }
    else if(b.action==='decline')i.status='declined';else if(b.action==='undo'&&i.status==='declined')i.status='pending';else fail(422,'Unsupported invitation action.');return snapshot(u);
  });
  const match=pathname.match(/^\/api\/leagues\/([^/]+)\/(\w+)$/);if(!match)fail(404,'Not found.');
  return transaction(()=>{
    const l=leagueFor(u.id,match[1]), action=match[2];
    if(action==='pick') pick(l,u.id,b.teamId,b.version,b.override ? clean(b.reason,500):null);
    else if(action==='queue') {
      requireThat(l.status!=='complete','The draft is complete.'); const pool=eligible(l,u.id).map(t=>t.id), q=l.queues[u.id]||[];
      if(b.action==='add') {requireThat(pool.includes(b.teamId),'That team is not eligible for your roster.');if(!q.includes(b.teamId))q.push(b.teamId);}
      else if(b.action==='remove'){const i=q.indexOf(b.teamId);if(i>=0)q.splice(i,1);}
      else if(['up','down'].includes(b.action)){const i=q.indexOf(b.teamId),j=i+(b.action==='up'?-1:1);if(i>=0&&j>=0&&j<q.length)[q[i],q[j]]=[q[j],q[i]];}
      else fail(422,'Unsupported queue action.');l.queues[u.id]=q;
    }
    else if(action==='chat') { requireThat(clean(b.text,500),'Write a message.','text'); l.chat.push({id:id(),userId:u.id,name:u.name,text:clean(b.text,500),at:now()});l.chat=l.chat.slice(-100); }
    else if(action==='leave') {requireThat(l.owner!==u.id,'Transfer the commissioner role before leaving.');requireThat(l.status==='scheduled','Managers cannot leave after a draft has started.');l.members=l.members.filter(m=>m.id!==u.id);delete l.queues[u.id];activity(l,u.id,'Left the league.');}
    else {
      commissioner(l,u.id);
      if(action==='settings') {requireThat(clean(b.name).length>=3,'Use at least 3 characters.','name');l.name=clean(b.name);l.description=clean(b.description,500);l.locked=!!b.locked;
        if(l.status==='scheduled'){requireThat([30,60,90,120].includes(+b.timer),'Choose a valid timer.','timer');const date=b.scheduled?Date.parse(b.scheduled):null;requireThat(!b.scheduled||(date>now()),'Choose a future date.','scheduled');l.timer=+b.timer;l.scheduled=date;l.order=b.order==='manual'?'manual':'random';}
        activity(l,u.id,'Updated league settings.');
      }
      else if(action==='order'){requireThat(l.status==='scheduled'&&l.order==='manual','Manual order can be set before the draft.');const i=l.members.findIndex(m=>m.id===b.memberId),j=i+(b.direction==='up'?-1:1);requireThat(i>=0&&j>=0&&j<l.members.length,'Cannot move this manager further.');[l.members[i],l.members[j]]=[l.members[j],l.members[i]];activity(l,u.id,'Updated the manual draft order.');}
      else if(action==='retrymail') {requireMail();const message=(db.mail||[]).find(m=>m.inviteId===b.inviteId&&m.status==='failed'&&db.invites.some(i=>i.id===m.inviteId&&i.leagueId===l.id));requireThat(message,'No failed delivery to retry.');message.status='pending';delete message.error;}
      else if(action==='invite') {
        requireThat(l.status==='scheduled'&&!l.locked,'Unlock this scheduled league to invite managers.');const entries=[...new Set(String(b.emails||'').split(/[\s,;]+/).filter(Boolean).map(email))];requireThat(entries.length&&entries.length<=12,'Enter 1–12 email addresses.','emails');
        const results=entries.map(address=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))return{email:address,status:'failed',reason:'Invalid email'};if(l.members.some(m=>db.users.find(u=>u.id===m.id)?.email===address))return{email:address,status:'failed',reason:'Already a member'};const existing=db.invites.find(i=>i.leagueId===l.id&&i.email===address);if(existing){existing.status='pending';}else db.invites.push({id:id(),leagueId:l.id,email:address,status:'pending',at:now()});const invitation=existing||db.invites.at(-1);if(mailConfig.enabled&&!u.sample&&!((db.mail||[]).some(m=>m.inviteId===invitation.id&&['pending','sent'].includes(m.status))))enqueueMail(db,address,'You’re invited to '+l.name,`${u.name} invited you to ${l.name}. Sign in or create an account with this email to review the invitation: ${mailConfig.baseUrl}/invitations`,{inviteId:invitation.id});return{email:address,status:mailConfig.enabled&&!u.sample?'pending':'available'};});
        activity(l,u.id,`Created ${results.filter(r=>r.status!=='failed').length} invitations. ${mailConfig.enabled&&!u.sample?'Email delivery queued.':'No email sent.'}`);return {...snapshot(u),inviteResults:results};
      }
      else if(action==='remove') {requireThat(l.status==='scheduled','Members can only be removed before drafting.');requireThat(b.memberId!==u.id,'Transfer ownership before leaving.');requireThat(member(l,b.memberId),'Manager not found.');const target=l.members.find(m=>m.id===b.memberId);l.members=l.members.filter(m=>m.id!==b.memberId);delete l.queues[b.memberId];activity(l,u.id,`Removed ${target.name}.`);}
      else if(action==='transfer') {requireThat(b.memberId!==u.id&&member(l,b.memberId),'Choose another league manager.','memberId');l.owner=b.memberId;activity(l,u.id,`Transferred commissioner role to ${l.members.find(m=>m.id===b.memberId).name}.`);}
      else if(action==='status') {
        if(b.status==='live') {
          requireThat(['scheduled','paused'].includes(l.status),'Only scheduled or paused drafts can start.');requireThat(l.members.length===l.capacity,'Fill every manager slot before starting.');
          if(l.status==='scheduled'&&l.order==='random'){for(let i=l.members.length-1;i>0;i--){const j=crypto.randomInt(i+1);[l.members[i],l.members[j]]=[l.members[j],l.members[i]];}}
          if(l.status==='scheduled')l.draftStartedAt=now();l.deadline=now()+(l.remaining ?? l.timer*1000);l.remaining=null;l.status='live';
        } else if(b.status==='paused'){requireThat(l.status==='live','Only a live draft can pause.');l.remaining=Math.max(1000,l.deadline-now());l.deadline=null;l.status='paused';} else fail(422,'Unsupported draft state.');
        l.version++;activity(l,u.id,`${l.status==='live'?'Started/resumed':'Paused'} the draft.`);
      }
      else if(action==='reset') {requireThat(clean(b.reason).length>=5,'Explain why you are resetting this draft.','reason');l.picks=[];l.queues={};l.draftStartedAt=null;l.deadline=null;l.remaining=null;l.status='scheduled';l.version++;activity(l,u.id,`Reset draft and cleared rosters/scores. Reason: ${clean(b.reason,500)}`);}
      else if(action==='score') {
        requireThat(l.status==='complete','Finish the draft before entering results.');const p=l.picks.find(p=>p.id===b.pickId);requireThat(p,'Choose a drafted team.','pickId');requireThat(clean(b.reason).length>=5,'Explain the result or correction.','reason');const old=points(p);
        if(b.mode==='override'){requireThat(Number.isInteger(+b.points)&&+b.points>=0&&+b.points<=100,'Use a whole number from 0 to 100.','points');p.override=+b.points;}else {requireThat(b.finish===''||(Number.isInteger(+b.finish)&&+b.finish>=1&&+b.finish<=32),'Choose a finish from 1 to 32, or pending.','finish');p.finish=b.finish===''?null:+b.finish;p.override=null;}
        activity(l,u.id,`${p.team.name}: ${old} → ${points(p)} points. ${clean(b.reason,500)}`);
      }
      else if(action==='correct') {requireThat(l.status==='paused'||l.status==='complete','Pause the draft before correcting a pick.');const p=l.picks.find(p=>p.id===b.pickId),t=teams(l).find(t=>t.id===b.teamId);requireThat(p&&t&&p.team.sport===t.sport,'Choose an available team in the same sport.','teamId');requireThat(!l.picks.some(other=>other.id!==p.id&&other.team.id===t.id),'That team is already drafted.','teamId');requireThat(clean(b.reason).length>=5,'Explain this correction.','reason');const old=p.team.name;p.team=t;p.finish=null;p.override=null;l.version++;activity(l,u.id,`Corrected ${old} → ${t.name}; score reset to pending. ${clean(b.reason,500)}`);}
      else fail(404,'Action unavailable.');
    }
    return snapshot(u);
  });
}
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
  try {
    const host=req.headers.host;
    if(![`localhost:${port}`,`127.0.0.1:${port}`].includes(host))fail(403,'Localhost access only.');
    const url=new URL(req.url,`http://${host}`);if(req.method==='POST'&&url.pathname.startsWith('/api/')){const began=Date.now();res.on('finish',()=>{try{recordOutcome(dataDir,url.pathname,res.statusCode,Date.now()-began);}catch{console.error('Could not save aggregate outcome metrics.');}});}
    if(url.pathname.startsWith('/api/')) {
      if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==`http://${host}`)fail(403,'Cross-origin request rejected.');
      const b=req.method==='POST'?await body(req):{};advanceClocks();const result=api(req,res,url.pathname,b,readSession(req));res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));return;
    }
    if(req.method!=='GET')fail(405,'Method not supported.');
    const allowed=['/ui-state.js','/script.js','/styles.css','/favicon.svg']; let file;
    if(allowed.includes(url.pathname))file=path.join(root,url.pathname.slice(1));
    else if(url.pathname==='/assets/loc-hero.png')file=path.join(root,'assets','loc-hero.png');
    else if(!path.extname(url.pathname)||url.pathname==='/index.html')file=path.join(root,'index.html');
    else fail(404,'Not found.');
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
  } catch(error){res.statusCode=error.status||500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.status?error.message:'Unable to save this change. Please retry.',field:error.field}));if(!error.status)console.error(error);}
});
const mailTimer=setInterval(()=>flushMail().catch(()=>{}),1000);
const timer=setInterval(()=>{try{advanceClocks();}catch(e){console.error('Clock save failed:',e.message);}},500);
server.listen(port,'127.0.0.1',()=>console.log(`LOC local: http://localhost:${port} · data: ${dataDir}`));
function stop(){clearInterval(timer);clearInterval(mailTimer);server.close(()=>process.exit(0));}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
