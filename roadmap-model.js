import {projectedStandings, scoreValue} from './product-model.js';

// Deterministic helpers: no model, live schedule, or invented performance data.
export function draftGuide(l, uid) {
  const open = l.sports.filter(s => !l.picks.some(p => p.userId === uid && p.team.sport === s));
  const eligible = t => open.includes(t.sport) && !l.picks.some(p => p.team.id === t.id);
  const queue = (l.queues[uid] || []).map(id => l.teams.find(t => t.id === id)).filter(t => t && eligible(t));
  return {open, uncovered: open.filter(s => !queue.some(t => t.sport === s)), queue,
    watched: l.teams.filter(t => l.research?.[uid]?.[t.id]?.watched && eligible(t) && !queue.some(q => q.id === t.id))};
}
export function scenarioWarnings(l, changes) {
  const warnings = [];
  for (const sport of l.sports) {
    const finishes = l.picks.filter(p => p.team.sport === sport).map(p => ({name:p.team.name, place:changes[p.id] ?? p.finish}));
    for (const place of [1, 2]) if (finishes.filter(x => Number(x.place) === place).length > 1)
      warnings.push(`${sport}: more than one ${place === 1 ? 'champion' : 'runner-up'} selected. Confirm whether this competition permits ties.`);
  }
  return warnings;
}
export function scoreComparison(l, changes) {
  const current = projectedStandings(l);
  return projectedStandings(l, changes).map(r => {
    const before = current.find(x => x.id === r.id);
    return {...r, before:before.total, oldRank:before.rank, delta:r.total-before.total};
  });
}
export function championshipCalendar(l, uid) {
  return (l.editions || []).map(x => ({...x, contenders:l.picks.filter(p => p.userId === uid && p.team.sport === x.sport)
    .map(p => ({name:p.team.name, points:scoreValue(p), pending:p.finish == null && p.override == null}))}))
    .sort((a,b) => a.endMonth.localeCompare(b.endMonth));
}
export function championshipImpact(l, uid) {
  const current = projectedStandings(l), mine = current.find(r => r.id === uid);
  return {gap:Math.max(0, (current[0]?.total || 0)-(mine?.total || 0)),
    options:l.picks.filter(p => p.userId === uid && p.finish == null && p.override == null).map(p => {
      const row = scoreComparison(l, {[p.id]:1}).find(r => r.id === uid);
      return {pick:p, points:row.total, rank:row.rank, delta:row.delta};
    })};
}
