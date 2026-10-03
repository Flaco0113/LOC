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
export function historyRows(l){const reset=l.activity?.find(a=>a.text.startsWith('Reset draft and cleared'))?.at||0;return (l.scoreHistory||[]).filter(x=>x.at>reset);}

export function seasonHighlights(l){
 const rows=l.finalStandings||projectedStandings(l),leader=rows[0];
 return {champions:rows.filter(r=>r.total===leader?.total).map(r=>r.name),
   margin:rows.length>1?rows[0].total-rows[1].total:null,final:['final','archived'].includes(l.competitionState)};
}
export function recapCard(l){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const rows=l.finalStandings||projectedStandings(l),height=230+rows.length*44;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${height}" viewBox="0 0 900 ${height}"><rect width="900" height="${height}" rx="24" fill="#0d1828"/><g font-family="Arial,sans-serif" fill="#eef4ff"><text x="40" y="48" font-size="18" fill="#ffa05b">LOC · ${l.sample?'FICTIONAL SAMPLE · ':''}${seasonHighlights(l).final?'FINAL RESULTS':'PROVISIONAL RESULTS'}</text><text x="40" y="98" font-size="26">${escape(l.name.slice(0,48))}</text><text x="40" y="132" font-size="16">${escape(l.seasonLabel||l.season)} · ${escape(l.rulesVersion||'LOC placement v1')}</text>${rows.map((r,i)=>`<text x="40" y="${184+i*44}" font-size="22">#${r.rank} ${escape(r.name.slice(0,40))}</text><text x="850" y="${184+i*44}" text-anchor="end" font-size="22">${r.total} pts</text>`).join('')}<text x="40" y="${height-24}" font-size="15" fill="#b6c4d8">Commissioner-entered results · No live data · loc-one.vercel.app</text></g></svg>`;
}

