export const monthBySport = { NBA:6, NFL:2, MLB:11, NHL:6, 'NCAA Football':1, 'NCAA Basketball':4, 'UEFA Champions League':6, NASCAR:11, 'Masters Tournament':4 };
export const entityBySport = sport => sport === 'Masters Tournament' ? 'Golfer' : sport === 'NASCAR' ? 'Motorsport organization' : 'Team';
export const scoreValue = p => p.override != null ? Number(p.override) : p.finish ? Math.max(0,10-Number(p.finish))+(Number(p.finish)===1?3:Number(p.finish)===2?1:0) : 0;
export function defaultEditions(l) {
  const anchor = l.createdAt || l.activity?.find(a=>a.text==='Created the league.')?.at || Date.UTC(l.season,0,1);
  const start=Math.max(anchor,Date.UTC(l.season,0,1)), year=new Date(start).getUTCFullYear();
  return l.sports.map(sport=>{const m=monthBySport[sport];const y=Date.UTC(year,m,0,23,59,59)<start?year+1:year;return {sport,name:`${sport} championship ${y}`,endMonth:`${y}-${String(m).padStart(2,'0')}`,confirmed:false};});
}
export function ensureProductState(l) {
  l.editions ||= defaultEditions(l); l.rulesVersion ||= 'LOC placement v1';
  l.competitionState ||= 'active'; l.scoreLedger ||= []; l.scoreHistory ||= [];
  l.scoreRevision ||= 0; l.research ||= {}; l.polls ||= []; l.announcements ||= [];
  return l;
}
export function seasonPhase(l) {
  if(l.competitionState==='archived')return 'Archived';if(l.competitionState==='final')return 'Final';
  if(l.status==='scheduled')return 'Forming';if(l.status!=='complete')return 'Drafting';
  return l.picks.length&&l.picks.every(p=>p.finish!=null||p.override!=null)?'Awaiting confirmation':'In season';
}
export function queueReason(l,userId,teamId) {
  const t=l.teams.find(t=>t.id===teamId);if(!t)return 'No longer in catalog';
  if(l.picks.some(p=>p.team.id===teamId))return 'Already drafted';
  if(l.picks.some(p=>p.userId===userId&&p.team.sport===t.sport))return `${t.sport} slot filled`;
  return '';
}
export function projectedStandings(l,changes={}) {
  const rows=l.members.map(m=>({...m,total:l.picks.filter(p=>p.userId===m.id).reduce((sum,p)=>sum+scoreValue(Object.hasOwn(changes,p.id)?{...p,finish:changes[p.id],override:null}:p),0)})).sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name));
  rows.forEach((r,i)=>r.rank=i&&rows[i-1].total===r.total?rows[i-1].rank:i+1);return rows;
}
export function contributions(l,userId){return l.sports.map(sport=>({sport,total:l.picks.filter(p=>p.userId===userId&&p.team.sport===sport).reduce((s,p)=>s+scoreValue(p),0)}));}
export function outcomeLabel(p){return p.override!=null?'Manual score':p.finish===1?'Champion':p.finish===2?'Runner-up':p.finish?`Place ${p.finish}`:'Pending result';}
