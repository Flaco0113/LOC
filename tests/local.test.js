import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'loc-verification-'));
const port=4185, base=`http://localhost:${port}`;
let proc;
async function start(){proc=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port),LOC_DATA_DIR:dataDir,LOC_EMAIL_MODE:'disabled'},stdio:['ignore','pipe','pipe']});let output='';proc.stderr.on('data',d=>output+=d);await Promise.race([once(proc.stdout,'data'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Server did not start '+output)),10000).unref())]);}
async function stop(){if(proc&&proc.exitCode===null){proc.kill();await once(proc,'exit');}}
function client(){return{cookie:'',async call(url,data,status=200){const r=await fetch(base+url,{method:data===undefined?'GET':'POST',headers:{Cookie:this.cookie,...(data===undefined?{}:{'Content-Type':'application/json',Origin:base})},body:data===undefined?undefined:JSON.stringify(data)});const c=r.headers.get('set-cookie');if(c){this.cookie=c.split(';')[0];this.rawCookie=c;}const body=await r.json();assert.equal(r.status,status,JSON.stringify(body));return body;}};}
test('Local account → league → invitation → fair draft → results → persistence',async t=>{
  await start();t.after(stop);
  const people=Array.from({length:5},client), ids=[];
  await t.test('New accounts are empty, passwords hashed, sessions HttpOnly',async()=>{
    for(let i=0;i<people.length;i++){const r=await people[i].call('/api/auth/signup',{name:`Manager ${i}`,email:`manager${i}@test.local`,password:'long local passphrase',zone:'America/New_York',remember:true});ids.push(r.user.id);assert.equal(r.leagues.length,0);assert.ok(r.recovery);assert.ok(people[i].cookie);}
    const store=JSON.parse(fs.readFileSync(path.join(dataDir,'store.json')));assert.ok(store.users.every(u=>u.password&&!u.password.includes('long local')));assert.match(people[0].rawCookie,/HttpOnly/);assert.match(people[0].rawCookie,/SameSite=Strict/);
  });
  let lid;
  const owner=people[0],member=people[1],outsider=people[4];
  const action=(name)=>`/api/leagues/${lid}/${name}`;
  await t.test('Creation saves all configuration and scopes membership',async()=>{
    const r=await owner.call('/api/leagues',{name:'Verification Cup',description:'Local persistence test',season:2026,capacity:4,sports:['NBA','NFL'],timer:30,order:'manual',scheduled:new Date(Date.now()+86400000).toISOString()});lid=r.createdId;const l=r.leagues[0];assert.equal(l.timer,30);assert.equal(l.order,'manual');assert.ok(l.scheduled);assert.equal(l.picks.length,0);assert.equal((await outsider.call('/api/state')).leagues.length,0);await outsider.call(action('settings'),{name:'No access'},404);await owner.call(action('pick'),{teamId:'NBA:0',version:0},422);assert.equal((await owner.call('/api/state')).leagues[0].status,'scheduled');
  });
  await t.test('Invitations support partial failure, decline/undo, and acceptance',async()=>{
    const r=await owner.call(action('invite'),{emails:'manager1@test.local, manager2@test.local, manager3@test.local, bad'});assert.equal(r.inviteResults.filter(r=>r.status==='failed').length,1);
    for(let i=1;i<4;i++){const inv=(await people[i].call('/api/state')).invitations[0];if(i===1){await people[i].call('/api/invitations',{id:inv.id,action:'decline'});await people[i].call('/api/invitations',{id:inv.id,action:'undo'});}await people[i].call('/api/invitations',{id:inv.id,action:'accept'});}assert.equal((await owner.call('/api/state')).leagues[0].members.length,4);
  });
  await t.test('Queues are private and support ordered moves',async()=>{
    await owner.call(action('queue'),{action:'add',teamId:'NBA:0'});await owner.call(action('queue'),{action:'add',teamId:'NBA:1'});const r=await owner.call(action('queue'),{action:'up',teamId:'NBA:1'});assert.deepEqual(r.leagues[0].queues[ids[0]],['NBA:1','NBA:0']);assert.equal((await member.call('/api/state')).leagues[0].queues[ids[0]],undefined);
  });
  await t.test('Only commissioner controls draft; turn and concurrency are enforced',async()=>{
    await member.call(action('status'),{status:'live'},403);let r=await owner.call(action('status'),{status:'live'});const version=r.leagues[0].version;
    await member.call(action('pick'),{teamId:'NBA:2',version},403);
    const results=await Promise.all([owner.call(action('pick'),{teamId:'NBA:1',version}),owner.call(action('pick'),{teamId:'NBA:1',version},409)]);assert.equal(results[0].leagues[0].picks.length,1);
    r=await owner.call('/api/state');assert.ok(r.leagues[0].deadline>Date.now());assert.equal(r.leagues[0].current.id,ids[1]);
  });
  await t.test('Pause preserves clock; resume and sport eligibility work',async()=>{
    let r=await owner.call(action('status'),{status:'paused'});assert.equal(r.leagues[0].deadline,null);assert.ok(r.leagues[0].remaining>0);await member.call(action('pick'),{teamId:'NBA:2',version:r.leagues[0].version},422);r=await owner.call(action('status'),{status:'live'});
    for(let i=1;i<4;i++){r=await people[i].call(action('pick'),{teamId:`NBA:${i+1}`,version:r.leagues[0].version});}
    assert.equal(r.leagues[0].current.id,ids[3]);await people[3].call(action('pick'),{teamId:'NBA:5',version:r.leagues[0].version},409);
  });
  await t.test('Clock survives process restart and autopicks without an open page',async()=>{
    await stop();const file=path.join(dataDir,'store.json'),db=JSON.parse(fs.readFileSync(file));db.leagues[0].deadline=Date.now()-1000;fs.writeFileSync(file,JSON.stringify(db));await start();await new Promise(r=>setTimeout(r,800));const r=await owner.call('/api/state');assert.equal(r.leagues[0].picks.length,5);assert.equal(r.leagues[0].picks[4].team.sport,'NFL');assert.ok(r.leagues[0].activity.some(a=>a.text.startsWith('Timeout:')));
  });
  await t.test('Draft completes one slot per sport and scores are auditable',async()=>{
    let r=await owner.call('/api/state');for(let i=2;i>=0;i--)r=await people[i].call(action('pick'),{teamId:`NFL:${3-i}`,version:r.leagues[0].version});assert.equal(r.leagues[0].status,'complete');for(const uid of ids.slice(0,4))assert.equal(new Set(r.leagues[0].picks.filter(p=>p.userId===uid).map(p=>p.team.sport)).size,2);
    const pickId=r.leagues[0].picks[0].id;r=await owner.call(action('score'),{pickId,mode:'finish',finish:1,reason:'Verified local fixture'});assert.equal(r.leagues[0].picks[0].points,12);r=await owner.call(action('score'),{pickId,mode:'override',points:7,reason:'Commissioner correction'});assert.equal(r.leagues[0].picks[0].points,7);assert.ok(r.leagues[0].activity[0].text.includes('12 → 7'));
    r=await owner.call(action('correct'),{pickId,teamId:'NBA:0',reason:'Correct mistaken selection'});assert.equal(r.leagues[0].picks[0].points,0);assert.equal(r.leagues[0].picks[0].team.id,'NBA:0');
  });
  await t.test('Reset really clears picks; transfer changes authorization',async()=>{
    let r=await owner.call(action('reset'),{reason:'End of automated test'});assert.equal(r.leagues[0].picks.length,0);assert.equal(r.leagues[0].status,'scheduled');r=await owner.call(action('transfer'),{memberId:ids[1]});assert.equal(r.leagues[0].commissioner,false);await owner.call(action('status'),{status:'live'},403);await owner.call(action('leave'),{});assert.equal((await owner.call('/api/state')).leagues.length,0);
  });
  await t.test('Direct URLs work and private files cannot be served',async()=>{
    assert.equal((await fetch(base+'/leagues/'+lid+'/standings')).status,200);assert.equal((await fetch(base+'/.local/store.json')).status,404);assert.equal((await fetch(base+'/server.js')).status,404);const r=await fetch(base+'/api/account',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'});assert.equal(r.status,403);
  });
  await t.test('Creation retry is idempotent; preferences survive restart',async()=>{
    const data={name:'Retry Cup',season:2026,capacity:4,sports:['NBA'],timer:60,requestId:'repeatable-operation'};
    const a=await outsider.call('/api/leagues',data),b=await outsider.call('/api/leagues',data);assert.equal(a.createdId,b.createdId);assert.equal(b.leagues.length,1);
    await outsider.call('/api/account',{name:'Updated Manager',zone:'Europe/London',notifications:false});await stop();await start();const r=await outsider.call('/api/state');assert.equal(r.user.name,'Updated Manager');assert.equal(r.user.zone,'Europe/London');assert.equal(r.user.notifications,false);assert.equal(r.leagues.length,1);
  });
  await t.test('Recovery rotates code and sessions; password whitespace is retained',async()=>{
    const a=client(),b=client();const r=await a.call('/api/auth/signup',{name:'Recovery Test',email:'recovery@test.local',password:' spaced passphrase ',zone:'UTC'});
    await b.call('/api/auth/login',{email:'recovery@test.local',password:' spaced passphrase '});
    await a.call('/api/auth/reset',{email:'recovery@test.local',recovery:r.recovery,password:'replacement passphrase'});
    assert.equal((await b.call('/api/state')).user,null);
    await b.call('/api/auth/reset',{email:'recovery@test.local',recovery:r.recovery,password:'another replacement'},422);
    await b.call('/api/auth/login',{email:'recovery@test.local',password:'replacement passphrase'});
  });
});
