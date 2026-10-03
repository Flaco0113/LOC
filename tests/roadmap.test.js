import {test} from 'node:test';
import assert from 'node:assert/strict';
import {draftGuide,scenarioWarnings,scoreComparison,championshipCalendar,championshipImpact} from '../roadmap-model.js';
import {createKernel} from '../app-kernel.js';

test('Draft guidance excludes drafted, filled and already queued watch entries',()=>{
 const l={sports:['NBA','NFL','MLB'],picks:[{userId:'u',team:{id:'b',sport:'NBA'}},{userId:'v',team:{id:'f',sport:'NFL'}}],teams:[{id:'b',sport:'NBA'},{id:'f',sport:'NFL'},{id:'f2',sport:'NFL'},{id:'m',sport:'MLB'}],queues:{u:['f','f2']},research:{u:{b:{watched:true},f:{watched:true},f2:{watched:true},m:{watched:true}}}};
 const g=draftGuide(l,'u');assert.deepEqual(g.open,['NFL','MLB']);assert.deepEqual(g.uncovered,['MLB']);assert.deepEqual(g.watched.map(t=>t.id),['m']);
});
test('Scenario arithmetic replaces overrides, keeps pending zero and warns about conflicting champions',()=>{
 const l={sports:['NBA'],members:[{id:'a',name:'A'},{id:'b',name:'B'}],picks:[{id:'p',userId:'a',finish:null,override:25,team:{id:'t',name:'A team',sport:'NBA'}},{id:'q',userId:'b',finish:1,team:{id:'q',name:'B team',sport:'NBA'}}],editions:[{sport:'NBA',endMonth:'2027-06'}]};
 assert.equal(scoreComparison(l,{p:1}).find(r=>r.id==='a').total,12);assert.equal(scoreComparison(l,{p:null}).find(r=>r.id==='a').total,0);
 assert.equal(scenarioWarnings(l,{p:1}).length,1);assert.equal(l.picks[0].override,25);
 assert.equal(championshipCalendar(l,'a')[0].contenders[0].points,25);assert.equal(championshipImpact(l,'a').options.length,0);
});
test('Join preview is non-mutating and limited; queue additions validate eligibility and remain private',()=>{
 const kernel=createKernel({users:[],leagues:[],sessions:{},invites:[],revision:0});
 const req={method:'POST',headers:{},socket:{remoteAddress:'test'}},res={setHeader(){}};
 const signup=name=>kernel.api(req,res,'/api/auth/signup',{name,email:name+'@test.invalid',password:'long test passphrase'},null).user;
 const owner=signup('Owner'),friend=signup('Friend');
 const call=(u,path,b={})=>kernel.api(req,res,path,b,u);
 let state=call(owner,'/api/leagues',{name:'Preview Test',season:2026,capacity:2,sports:['NBA'],timer:60});
 const l=state.leagues[0],url=a=>'/api/leagues/'+l.id+'/'+a;
 state=call(owner,url('joincode'),{action:'generate'});
 const code=state.leagues[0].joinAccess.code;
 const preview=call(friend,'/api/join/preview',{code});
 assert.equal(preview.leagues.length,0);assert.equal(preview.joinPreview.joined,1);assert.equal(preview.joinPreview.queues,undefined);assert.equal(preview.joinPreview.research,undefined);
 call(friend,'/api/join',{code});
 const tid=l.teams[0].id;
 call(friend,url('research'),{teamId:tid,note:'private',watched:true});
 state=call(friend,url('queuewatched'),{teamIds:[tid,tid]});assert.deepEqual(state.leagues[0].queues[friend.id],[tid]);
 assert.throws(()=>call(owner,url('queuewatched'),{teamIds:[tid]}),/no longer watched/);
 assert.throws(()=>call(friend,url('queuewatched'),{teamIds:['invalid']}),/no longer watched/);
});
test('Fresh sample has explicit fictional history and an accessible finalized linked season',()=>{
 const kernel=createKernel({users:[],leagues:[],sessions:{},invites:[],revision:0});
 const s=kernel.api({method:'POST',headers:{},socket:{remoteAddress:'sample'}},{setHeader(){}},'/api/auth/demo',{},null);
 const l=s.leagues.find(x=>x.name==='Founders Cup');assert.ok(l.scoreHistory.length>1);assert.ok(l.picks.some(p=>p.finish==null));
 assert.ok(l.scoreLedger.every(x=>x.reason.includes('Fictional')));assert.equal(s.leagues.find(x=>x.id===l.previousLeagueId).competitionState,'archived');
});

