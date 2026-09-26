import {test} from 'node:test';import assert from 'node:assert/strict';
import {newPractice,practiceTurn,practicePick,practiceEligible,rivalries,recap,personalizedFeed,historyRows} from '../experience-model.js';
import {experienceAction} from '../experience-server.js';
const ctx={requireThat:(value,message)=>{if(!value)throw Error(message);},clean:(x,n=120)=>String(x??'').trim().slice(0,n),id:()=>crypto.randomUUID(),activity:()=>{}};
test('Practice completes snake draft with eligible timeout queues without touching source leagues',()=>{
 const p=newPractice();p.queue=['Football:2','Football:1'];practicePick(p,null,true);assert.equal(p.picks[0].team.id,'Football:2');
 const order=['you'];while(practiceTurn(p)){order.push(practiceTurn(p).id);practicePick(p,null,true);}assert.deepEqual(order,['you','bot1','bot2','bot3','bot3','bot2','bot1','you']);assert.equal(p.picks.length,8);assert.equal(new Set(p.picks.map(x=>x.team.id)).size,8);assert.equal(practiceEligible(p,'you').length,0);assert.equal(p.picks.at(-1).team.sport,'Basketball');assert.throws(()=>practicePick(p,'Football:0'));assert.equal(newPractice().picks.length,0);
});
test('Rivalries count only finalized linked accessible seasons and preserve ties',()=>{
 const members=[{id:'a',name:'A'},{id:'b',name:'B'}],make=(id,state,a,b)=>({id,season:2026,members,competitionState:state,finalStandings:[{id:'a',total:a},{id:'b',name:'B',total:b}]});const first=make('1','final',12,9),second={...make('2','archived',9,9),previousLeagueId:'1'},third={...make('3','active',0,20),previousLeagueId:'2'},other=make('4','final',0,100);assert.deepEqual(rivalries([first,second,third,other],second,'a')[0],{id:'b',name:'B',played:2,wins:1,losses:0,ties:1});
});
test('Personalized updates use owned/watched contenders and read preferences; recap omits private data',()=>{
 const l={name:'Cup',season:2026,sports:['NBA'],members:[{id:'a',name:'A'}],picks:[{id:'p',userId:'a',team:{id:'t',name:'Team',sport:'NBA'},finish:1}],research:{a:{x:{watched:true,note:'PRIVATE NOTE'}}},chat:[{text:'PRIVATE CHAT'}],scoreLedger:[{id:'1',teamId:'t',at:10,team:'Team',oldPoints:0,newPoints:12,sport:'NBA'},{id:'2',teamId:'x',at:20,sport:'NBA'},{id:'3',teamId:'other',at:30}],articles:[{id:'a',status:'published',sport:'NBA',updated:40,title:'Story',authorName:'A'},{id:'b',status:'draft',updated:50}],alertPreferences:{a:{read:['score:1']}}};
 assert.equal(personalizedFeed(l,'a').length,3);assert.equal(personalizedFeed(l,'a').find(x=>x.id==='score:1').read,true);l.alertPreferences.a.content=false;assert.equal(personalizedFeed(l,'a').length,2);assert.doesNotMatch(recap(l),/PRIVATE/);assert.match(recap(l),/Provisional/);assert.equal(historyRows({activity:[{at:5,text:'Reset draft and cleared rosters'}],scoreHistory:[{at:1},{at:6}]}).length,1);
});
test('Articles enforce authorship, source safety and private draft status; preferences stay user scoped',()=>{
 const l={owner:'a',sports:['NBA']},a={id:'a',name:'A'},b={id:'b',name:'B'},post={title:'Draft analysis',body:'A thoughtful league guide.',status:'draft',sport:'NBA',source:'https://example.com/story'};
 experienceAction(l,a,'article',post,ctx);const id=l.articles[0].id;assert.equal(l.articles[0].authorId,'a');assert.throws(()=>experienceAction(l,b,'article',{...post,id},ctx),/author/);assert.throws(()=>experienceAction(l,a,'article',{...post,source:'javascript:alert(1)'},ctx),/http/);experienceAction(l,a,'article',{...post,id,status:'published'},ctx);assert.throws(()=>experienceAction(l,b,'featurearticle',{id,featured:true},ctx),/commissioner/);experienceAction(l,a,'featurearticle',{id,featured:true},ctx);assert.equal(l.articles[0].featured,true);
 experienceAction(l,a,'alertpreferences',{sports:['NBA'],results:true,content:false,drafts:false},ctx);experienceAction(l,b,'alertpreferences',{sports:[],results:false,content:true,drafts:true},ctx);assert.equal(l.alertPreferences.a.results,true);assert.equal(l.alertPreferences.b.results,false);
});
