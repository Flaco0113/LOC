import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mailConfiguration, deliverMail } from '../mail.js';

test('Email adapter requires explicit configuration and retries with the same idempotency key', async () => {
  assert.equal(mailConfiguration({}).enabled, false);
  assert.throws(() => mailConfiguration({ LOC_EMAIL_MODE:'resend' }));
  const config={ mode:'resend',key:'test-only-key',from:'test@example.invalid' }, message={id:'stable-id',to:'recipient@example.invalid',subject:'Test',text:'Test only'};
  const requests=[];
  const mock=async(url,request)=>{requests.push({url,request});return {ok:requests.length>1,status:503,json:async()=>({id:'provider-id'})};};
  await assert.rejects(deliverMail(message,config,'',mock), /503/);
  assert.equal(await deliverMail(message,config,'',mock),'sent');
  assert.equal(requests[0].request.headers['Idempotency-Key'],requests[1].request.headers['Idempotency-Key']);
  assert.equal(requests[0].url,'https://api.resend.com/emails');
  await assert.rejects(deliverMail(message,config,'',async()=>({ok:true,json:async()=>({})})), /did not confirm/);
});

test('Verification, resend, email change, reset, and invitation messages work without sending real mail', async t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'loc-email-')), port=4186, base=`http://localhost:${port}`;
  let proc, cookie='';
  async function start(){proc=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:String(port),LOC_DATA_DIR:dir,LOC_EMAIL_MODE:'preview'},stdio:['ignore','pipe','pipe']});await Promise.race([once(proc.stdout,'data'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Startup timed out')),10000).unref())]);}
  async function stop(){if(proc?.exitCode===null){proc.kill();await once(proc,'exit');}}
  t.after(stop);await start();
  const db=()=>JSON.parse(fs.readFileSync(path.join(dir,'store.json')));
  async function call(url,data,status=200){const r=await fetch(base+url,{method:data===undefined?'GET':'POST',headers:{Cookie:cookie,'Content-Type':'application/json',Origin:base},body:data===undefined?undefined:JSON.stringify(data)});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const result=await r.json();assert.equal(r.status,status,JSON.stringify(result));return result;}
  const token=kind=>{const m=db().mail.filter(m=>m.kind===kind).at(-1);const text=m.text||JSON.parse(fs.readFileSync(path.join(dir,'mail-preview',m.id+'.json'))).text;return text.match(/#(?:verify|reset)=([a-f0-9]+)/)[1];};
  let r=await call('/api/auth/signup',{name:'Email Test',email:'verify@example.invalid',password:'test passphrase only',zone:'UTC'});
  assert.equal(r.emailMode,'preview');assert.equal(r.user.verified,false);assert.equal(r.emailStatus.status,'pending');
  const first=token('verify');await call('/api/account/resend',{});const second=token('verify');assert.notEqual(first,second);
  await call('/api/auth/verify',{token:first},422);r=await call('/api/auth/verify',{token:second});assert.equal(r.user.verified,true);
  await call('/api/auth/verify',{token:second},422);
  await call('/api/account/email',{email:'changed@example.invalid',password:'wrong'},422);
  r=await call('/api/account/email',{email:'changed@example.invalid',password:'test passphrase only'});assert.equal(r.user.email,'verify@example.invalid');assert.equal(r.user.pendingEmail,'changed@example.invalid');
  r=await call('/api/auth/verify',{token:token('verify')});assert.equal(r.user.email,'changed@example.invalid');assert.equal(r.user.pendingEmail,null);
  await call('/api/auth/forgot',{email:'changed@example.invalid'});const reset=token('reset'),oldCookie=cookie;
  r=await call('/api/auth/reset-link',{token:reset,password:'new test passphrase'});assert.ok(r.recovery);assert.notEqual(cookie,oldCookie);
  await call('/api/auth/reset-link',{token:reset,password:'another passphrase'},422);
  const old=await fetch(base+'/api/state',{headers:{Cookie:oldCookie}});assert.equal((await old.json()).user,null);
  const known=await call('/api/auth/forgot',{email:'changed@example.invalid'}),unknown=await call('/api/auth/forgot',{email:'unknown@example.invalid'});assert.equal(known.message,unknown.message);
  const expired=token('reset');await stop();const stored=db();stored.emailTokens.forEach(x=>x.expires=0);fs.writeFileSync(path.join(dir,'store.json'),JSON.stringify(stored));await start();await call('/api/auth/reset-link',{token:expired,password:'valid new passphrase'},422);
  r=await call('/api/leagues',{name:'Email Cup',season:2026,capacity:4,sports:['NBA'],timer:60});const lid=r.createdId;
  r=await call(`/api/leagues/${lid}/invite`,{emails:'invite@example.invalid,bad'});assert.equal(r.inviteResults[0].status,'pending');assert.equal(r.inviteResults[1].status,'failed');
  const msg=db().mail.find(m=>m.inviteId);assert.ok(msg);assert.match(msg.text,/\/invitations/);
  const before=db().mail.length;await call(`/api/leagues/${lid}/invite`,{emails:'invite@example.invalid'});assert.equal(db().mail.length,before);
  const deadline=Date.now()+10000;while(db().mail.find(m=>m.id===msg.id).status==='pending'&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,200));
  assert.equal(db().mail.find(m=>m.id===msg.id).status,'preview');assert.ok(fs.existsSync(path.join(dir,'mail-preview',msg.id+'.json')));
  assert.equal((await fetch(base+'/.local/mail-preview/'+msg.id+'.json')).status,404);
  // A configured service requires verified identity before accepting email-address invitations.
  cookie='';await call('/api/auth/signup',{name:'Invited Test',email:'invite@example.invalid',password:'another test passphrase',zone:'UTC'});
  r=await call('/api/state');const invite=r.invitations[0];await call('/api/invitations',{id:invite.id,action:'accept'},422);
  await call('/api/auth/verify',{token:token('verify')});r=await call('/api/invitations',{id:invite.id,action:'accept'});assert.equal(r.leagues[0].id,lid);
});
