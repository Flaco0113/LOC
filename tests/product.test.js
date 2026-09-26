import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {projectedStandings,scoreValue,queueReason} from '../product-model.js';
test('Scenario replaces current points and preserves shared ranks',()=>{const l={members:[{id:'a',name:'A'},{id:'b',name:'B'}],picks:[{id:'p',userId:'a',finish:2},{id:'q',userId:'b',finish:1}]};assert.equal(scoreValue({finish:1}),12);assert.equal(scoreValue({finish:2}),9);assert.deepEqual(projectedStandings(l,{p:1}).map(r=>[r.total,r.rank]),[[12,1],[12,1]]);assert.equal(l.picks[0].finish,2);assert.equal(queueReason({...l,teams:[{id:'t',sport:'NBA'}],picks:[{team:{id:'t'}}]},'a','t'),'Already drafted');});
test('Local championship tools persist, enforce permissions, isolate notes and lock final scores',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'loc-product-')),base='http://localhost:4188';let proc;
 async function start(){proc=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'4188',LOC_DATA_DIR:dir,LOC_EMAIL_MODE:'disabled'},windowsHide:true,stdio:['ignore','pipe','pipe']});await once(proc.stdout,'data');}
 async function stop(){if(proc.exitCode===null){proc.kill();await once(proc,'exit');}}
 await start();t.after(stop);
 function client(){return {cookie:'',async call(url,data,status=200){const res=await fetch(base+url,{method:data===undefined?'GET':'POST',headers:{Cookie:this.cookie,Origin:base,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});if(res.headers.get('set-cookie'))this.cookie=res.headers.get('set-cookie').split(';')[0];const result=await res.json();assert.equal(res.status,status,JSON.stringify(result));return result;}};}
 const owner=client(),other=client();let state=await owner.call('/api/auth/demo',{}),l=state.leagues.find(l=>l.status==='complete'),lid=l.id;const url=action=>`/api/leagues/${lid}/${action}`;
 await other.call('/api/auth/signup',{name:'Other manager',email:'other@qa.local',password:'a long test passphrase'});
 await other.call(url('research'),{teamId:l.teams[0].id,note:'No access'},404);
 await owner.call(url('research'),{teamId:l.teams[0].id,note:'Private research',watched:true});
 await owner.call(url('scores'),{revision:l.scoreRevision,results:[{pickId:l.picks[0].id,finish:1}],reason:'Commissioner source reviewed'});
 await owner.call(url('scores'),{revision:l.scoreRevision,results:[{pickId:l.picks[0].id,finish:2}],reason:'Stale result attempt'},422);
 l=(await owner.call('/api/state')).leagues.find(x=>x.id===lid);assert.equal(l.scoreLedger[0].newPoints,12);assert.equal(l.scoreHistory.length,1);
 await owner.call(url('announcement'),{text:'Welcome to the final round'});await owner.call(url('poll'),{question:'Next sport?',options:'NBA\nNFL'});
 l=(await owner.call('/api/state')).leagues.find(x=>x.id===lid);await owner.call(url('vote'),{pollId:l.polls[0].id,option:1});
 await owner.call(url('finalize'),{confirmed:false,reason:'All final results reviewed'},422);
 await owner.call(url('finalize'),{confirmed:true,reason:'All final results reviewed'});
 await owner.call(url('score'),{pickId:l.picks[0].id,finish:2,reason:'No editing final'},422);await owner.call(url('reset'),{reason:'No resetting final'},422);
 await owner.call(url('reopen'),{reason:'Correct commissioner entry'});await owner.call(url('finalize'),{confirmed:true,reason:'All final results verified'});await owner.call(url('archive'),{});
 state=await owner.call(url('renew'),{name:'Next championship',season:2027});const nextId=state.createdId;assert.equal((await owner.call(url('renew'),{season:2027})).createdId,nextId);
 lid=nextId;l=state.leagues.find(x=>x.id===lid);assert.equal(l.picks.length,0);assert.equal(l.members.length,1);
 await owner.call(url('contenders'),{sport:'NBA',names:'New contender\nNew contender'});l=(await owner.call('/api/state')).leagues.find(x=>x.id===lid);assert.equal(l.teams.filter(t=>t.name==='New contender').length,1);
 await owner.call(url('editions'),{editions:l.editions.map(e=>({...e,endMonth:'2027-12'}))});
 await owner.call(url('invite'),{emails:'other@qa.local'});const invite=(await other.call('/api/state')).invitations[0];await other.call('/api/invitations',{id:invite.id,action:'accept'});
 await owner.call(url('research'),{teamId:l.teams[0].id,note:'Owner only',watched:true});const view=(await other.call('/api/state')).leagues[0];assert.equal(JSON.stringify(view.research).includes('Owner only'),false);
 await other.call(url('scores'),{},403);await other.call(url('editions'),{},403);
 await owner.call(url('article'),{title:'Private draft guide',body:'A locally authored guide for our next draft.',status:'draft',sport:'NBA'});
 let articles=(await owner.call('/api/state')).leagues.find(x=>x.id===lid).articles;const articleId=articles[0].id;
 assert.equal((await other.call('/api/state')).leagues[0].articles.length,0);
 await other.call(url('article'),{id:articleId,title:'Unauthorized edit',body:'This must not be allowed.',status:'published',sport:'NBA'},422);
 await owner.call(url('article'),{id:articleId,title:'Published draft guide',body:'A locally authored guide for our next draft.',status:'published',sport:'NBA'});
 assert.equal((await other.call('/api/state')).leagues[0].articles.length,1);
 await owner.call(url('alertpreferences'),{sports:['NBA'],results:true,content:false,drafts:true});
 assert.equal(Object.keys((await other.call('/api/state')).leagues[0].alertPreferences).length,1);
 const exported=await fetch(base+url('export')+'?format=recap',{headers:{Cookie:owner.cookie}});assert.equal(exported.status,200);assert.match(exported.headers.get('content-disposition'),/attachment/);assert.doesNotMatch(await exported.text(),/Owner only/);
 assert.equal((await fetch(base+url('export')+'?format=recap')).status,401);
 await stop();await start();l=(await owner.call('/api/state')).leagues.find(x=>x.id===lid);assert.equal(l.articles[0].title,'Published draft guide');assert.equal(Object.values(l.alertPreferences)[0].content,false);assert.equal(l.editions[0].endMonth,'2027-12');assert.ok(Object.values(l.research).some(notes=>Object.values(notes).some(n=>n.note==='Owner only')));
});
