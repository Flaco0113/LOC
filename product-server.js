import {ensureProductState, projectedStandings, scoreValue} from './product-model.js';
export function recordScore(l,p,old,reason,u,ctx){
  const at=Date.now();l.scoreUpdatedAt=at;l.scoreRevision++;
  l.scoreLedger.unshift({id:ctx.id(),at,pickId:p.id,teamId:p.team.id,team:p.team.name,sport:p.team.sport,userId:p.userId,oldPoints:old,newPoints:scoreValue(p),finish:p.finish,override:p.override,actor:u.name,reason,rulesVersion:l.rulesVersion});
  l.scoreHistory.push({at,revision:l.scoreRevision,rows:projectedStandings(l).map(({id,total,rank})=>({id,total,rank}))});
}
export function productAction(l,u,action,b,ctx){
  const {requireThat:check,commissioner,activity,clean,id,newLeague,teams}=ctx;
  ensureProductState(l);
  if(action==='research'){
    check(teams(l).some(t=>t.id===b.teamId),'Choose a contender in this league.');
    const mine=l.research[u.id] ||= {};mine[b.teamId]={note:clean(b.note,500),watched:!!b.watched};return {};
  }
  if(action==='vote'){
    const poll=l.polls.find(p=>p.id===b.pollId);check(poll&&!poll.closed,'This poll is closed or unavailable.');
    check(Number.isInteger(+b.option)&&+b.option>=0&&+b.option<poll.options.length,'Choose a poll option.');poll.votes[u.id]=+b.option;return {};
  }
  if(action==='clearskipped'){
    const pool=teams(l).filter(t=>!l.picks.some(p=>p.team.id===t.id||(p.userId===u.id&&p.team.sport===t.sport))).map(t=>t.id);
    l.queues[u.id]=(l.queues[u.id]||[]).filter(t=>pool.includes(t));return {};
  }
  if(!['editions','scores','finalize','reopen','archive','renew','announcement','poll','closepoll','contenders'].includes(action))return null;
  commissioner(l,u.id);
  if(action==='editions'){
    check(l.status==='scheduled','Competition editions lock when drafting begins.');
    check(Array.isArray(b.editions)&&b.editions.length===l.sports.length,'Review every included competition.');
    const editions=l.sports.map(sport=>{const values=b.editions.filter(e=>e.sport===sport);check(values.length===1,'Each sport needs one edition.');const x=values[0];check(clean(x.name).length>=3,'Name every competition edition.');check(/^20\d{2}-(0[1-9]|1[0-2])$|^2100-(0[1-9]|1[0-2])$/.test(x.endMonth),'Use a valid championship month.');return {sport,name:clean(x.name),endMonth:x.endMonth,confirmed:!!x.confirmed};});
    l.editions=editions;activity(l,u.id,'Reviewed competition editions. Rules remain LOC placement v1.');return {};
  }
  if(action==='contenders'){
    check(l.status==='scheduled','The contender field locks when drafting begins.');check(l.sports.includes(b.sport),'Choose an included sport.');
    const names=String(b.names||'').split('\n').map(x=>clean(x)).filter(Boolean);check(names.length&&names.length<=300,'Enter 1–300 names, one per line.');
    l.extraTeams ||= [];const existing=new Set(teams(l).filter(t=>t.sport===b.sport).map(t=>t.name.toLowerCase()));
    for(const name of names)if(!existing.has(name.toLowerCase())){l.extraTeams.push({id:'custom:'+id(),name,sport:b.sport,rank:1000+l.extraTeams.length});existing.add(name.toLowerCase());}
    activity(l,u.id,`Updated the manually maintained ${b.sport} contender field.`);return {};
  }
  if(action==='announcement'){check(clean(b.text,1000).length>0,'Write an announcement.','text');l.announcements.unshift({id:id(),at:Date.now(),name:u.name,text:clean(b.text,1000)});l.announcements=l.announcements.slice(0,30);activity(l,u.id,'Posted a league announcement.');return {};}
  if(action==='poll'){const options=String(b.options||'').split('\n').map(x=>clean(x)).filter(Boolean);check(clean(b.question).length>=3&&options.length>=2&&options.length<=8,'Enter a question and 2–8 options.');l.polls.unshift({id:id(),question:clean(b.question),options,votes:{},closed:false});l.polls=l.polls.slice(0,10);return {};}
  if(action==='closepoll'){const p=l.polls.find(p=>p.id===b.pollId);check(p,'Poll unavailable.');p.closed=true;return {};}
  if(action==='scores'){
    check(l.competitionState==='active','Reopen this season before correcting scores.');check(l.status==='complete','Complete the draft before recording results.');
    check(Number(b.revision)===l.scoreRevision,'Scores changed. Reload the results and preview again.','revision');
    check(Array.isArray(b.results)&&b.results.length>0&&b.results.length<=l.picks.length,'Choose at least one result.');check(clean(b.reason,500).length>=5,'Add the result source or correction reason.','reason');
    check(new Set(b.results.map(r=>r.pickId)).size===b.results.length,'Each result can appear only once.');
    const next=b.results.map(r=>{const p=l.picks.find(p=>p.id===r.pickId);check(p,'A selected pick no longer exists.');const finish=r.finish===''||r.finish==null?null:Number(r.finish);check(finish===null||(Number.isInteger(finish)&&finish>=1&&finish<=32),'Use a whole-number place from 1–32, or pending.');return {p,finish};});
    for(const {p,finish} of next){const old=scoreValue(p);p.finish=finish;p.override=null;recordScore(l,p,old,clean(b.reason,500),u,ctx);}
    activity(l,u.id,`Recorded ${next.length} results. ${clean(b.reason,500)}`);return {};
  }
  if(action==='finalize'){
    check(l.competitionState==='active'&&l.status==='complete','Only a completed draft in an active season can be finalized.');
    check(l.picks.length&&l.picks.every(p=>p.finish!=null||p.override!=null),'Record a result for every drafted contender first.');
    check(b.confirmed===true,'Confirm that all included competitions have ended.');check(clean(b.reason,500).length>=5,'Record the finalization source or explanation.','reason');
    l.competitionState='final';l.finalizedAt=Date.now();l.finalStandings=projectedStandings(l);l.finalizationReason=clean(b.reason,500);activity(l,u.id,'Finalized the season. '+l.finalizationReason);return {};
  }
  if(action==='reopen'){check(l.competitionState==='final','Only a final season can be reopened.');check(clean(b.reason,500).length>=5,'Explain the correction.','reason');l.competitionState='active';delete l.finalStandings;delete l.finalizedAt;activity(l,u.id,'Reopened scoring for correction: '+clean(b.reason,500));return {};}
  if(action==='archive'){check(l.competitionState==='final','Finalize the season before archiving.');l.competitionState='archived';activity(l,u.id,'Archived the final season.');return {};}
  if(action==='renew'){
    check(['final','archived'].includes(l.competitionState),'Finalize this season before renewing.');
    if(l.renewedId)return {createdId:l.renewedId};
    const next=newLeague(u,{name:clean(b.name)||l.name,season:Number(b.season),capacity:l.capacity,sports:l.sports,timer:l.timer,order:l.order});
    next.previousLeagueId=l.id;l.renewedId=next.id;next.extraTeams=structuredClone(l.extraTeams||[]);
    activity(next,u.id,`Created next season from ${l.name}. Managers must be invited and accept again.`);return {createdId:next.id};
  }
}
