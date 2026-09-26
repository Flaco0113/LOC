import {scoreValue,projectedStandings} from './product-model.js';
export function seasonFamily(leagues,current){
 const found=new Set([current.id]);let changed=true;
 while(changed){changed=false;for(const l of leagues)if(!found.has(l.id)&&leagues.some(x=>found.has(x.id)&&(x.previousLeagueId===l.id||x.renewedId===l.id||l.previousLeagueId===x.id||l.renewedId===x.id))){found.add(l.id);changed=true;}}
 return leagues.filter(l=>found.has(l.id)).sort((a,b)=>a.season-b.season||(a.createdAt||0)-(b.createdAt||0));
}
export function rivalries(leagues,current,uid){
 const final=seasonFamily(leagues,current).filter(l=>['final','archived'].includes(l.competitionState)&&l.members.some(m=>m.id===uid));const rows=new Map();
 for(const l of final){const standings=l.finalStandings||projectedStandings(l),mine=standings.find(r=>r.id===uid);if(!mine)continue;for(const r of standings){if(r.id===uid)continue;const row=rows.get(r.id)||{id:r.id,name:r.name,played:0,wins:0,losses:0,ties:0};row.name=r.name;row.played++;if(mine.total>r.total)row.wins++;else if(mine.total<r.total)row.losses++;else row.ties++;rows.set(r.id,row);}}
 return [...rows.values()].sort((a,b)=>b.played-a.played||a.name.localeCompare(b.name));
}
export function recap(l){const rows=l.finalStandings||projectedStandings(l);return `${l.name} · ${l.season}\n${['final','archived'].includes(l.competitionState)?'Final season recap':'Provisional season recap'}${l.sample?' · Illustrative sample':''}\n${l.rulesVersion||'LOC placement v1'}\n\n${rows.map(r=>`#${r.rank} ${r.name} — ${r.total} points`).join('\n')}\n\n${l.picks.map(p=>`${l.members.find(m=>m.id===p.userId)?.name||'Manager'}: ${p.team.name} (${p.team.sport}) — ${scoreValue(p)} pts${p.override!=null?' · manual override':p.finish?' · place '+p.finish:' · pending'}`).join('\n')}\n\nCommissioner-entered results. No live feed. ${l.finalizationReason||'Results remain provisional until finalized.'}`;}
export function personalizedFeed(l,uid,now=Date.now()){
 const prefs=l.alertPreferences?.[uid]||{},sports=prefs.sports||[],notes=l.research?.[uid]||{},read=new Set(prefs.read||[]),own=new Set(l.picks.filter(p=>p.userId===uid).map(p=>p.team.id));
 const entries=[];
 if(prefs.results!==false)for(const x of l.scoreLedger||[])if((own.has(x.teamId)||notes[x.teamId]?.watched)&&(!sports.length||sports.includes(x.sport)))entries.push({id:'score:'+x.id,at:x.at,title:`${x.team}: ${x.oldPoints} → ${x.newPoints} pts`,body:x.reason,kind:'Result',target:'scoring'});
 if(prefs.content!==false)for(const x of l.articles||[])if(x.status==='published'&&(!x.sport||!sports.length||sports.includes(x.sport)))entries.push({id:'article:'+x.id+':'+x.updated,at:x.updated,title:x.title,body:`By ${x.authorName} · League-authored content`,kind:'Article',target:'content'});
 if(prefs.drafts!==false&&l.status==='scheduled'&&l.scheduled&&l.scheduled>=now&&l.scheduled-now<=7*86400000)entries.push({id:'draft:'+l.scheduled,at:l.scheduled,title:'Your draft is coming up',body:'Prepare your queue before the scheduled draft. Check the league for the time in your time zone.',kind:'Draft reminder',target:'draft'});
 return entries.sort((a,b)=>b.at-a.at).map(x=>({...x,read:read.has(x.id)}));
}
export function newPractice(){return {members:[{id:'you',name:'You'},{id:'bot1',name:'Blair (bot)'},{id:'bot2',name:'Casey (bot)'},{id:'bot3',name:'Jordan (bot)'}],sports:['Basketball','Football'],teams:['Basketball','Football'].flatMap(sport=>['Comets','Owls','Waves','Foxes','Stars','Bears'].map((name,i)=>({id:sport+':'+i,name:sport+' '+name,sport,rank:i+1}))),picks:[],queue:[],log:[],complete:false};}
export function practiceTurn(p){if(p.picks.length>=p.members.length*p.sports.length)return null;const n=p.picks.length,r=Math.floor(n/p.members.length),i=n%p.members.length;return p.members[r%2?p.members.length-1-i:i];}
export function practiceEligible(p,uid){return p.teams.filter(t=>!p.picks.some(x=>x.team.id===t.id||(x.userId===uid&&x.team.sport===t.sport)));}
export function practicePick(p,teamId,timeout=false){const turn=practiceTurn(p);if(!turn)throw Error('Practice draft is complete.');const available=practiceEligible(p,turn.id);const t=timeout?(turn.id==='you'?p.queue.map(id=>available.find(t=>t.id===id)).find(Boolean):null)||available[0]:available.find(t=>t.id===teamId);if(!t)throw Error('Choose an eligible contender.');p.picks.push({id:'practice-'+p.picks.length,userId:turn.id,team:t,finish:null,override:null,number:p.picks.length+1});p.log.unshift(`${turn.name} drafted ${t.name}${timeout?' at simulated timeout':''}.`);p.complete=!practiceTurn(p);return p;}
export function historyRows(l){const reset=l.activity?.find(a=>a.text.startsWith('Reset draft and cleared'))?.at||0;return (l.scoreHistory||[]).filter(x=>x.at>reset);}
