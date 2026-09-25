import { test } from 'node:test';
import assert from 'node:assert/strict';
import { picksUntilTurn, overrideTeams, scoreExplanation, leagueTimeframe } from '../ui-state.js';

test('Override search includes the whole undrafted catalog and explains filled slots', () => {
  const teams = Array.from({ length: 80 }, (_,i) => ({ id: String(i), name: `Team ${i}`, sport: i < 40 ? 'NBA' : 'NFL' }));
  const league = { teams, current: { id: 'a' }, picks: [{ userId: 'a', team: teams[0] }] };
  assert.equal(overrideTeams(league).length, 79);
  assert.equal(overrideTeams(league, ' TEAM 79 ')[0].id, '79');
  assert.equal(overrideTeams(league, '', 'NFL').length, 40);
  assert.match(overrideTeams(league, 'Team 1')[0].unavailableReason, /already/);
  assert.equal(overrideTeams(league, 'Team 79')[0].unavailableReason, '');
  assert.deepEqual(overrideTeams(league, 'no match'), []);
  league.picks.push({ userId: 'b', team: teams[79] });
  assert.deepEqual(overrideTeams(league, 'Team 79'), []);
});

test('Scoring explains outcomes, bonuses, pending results and zero overrides honestly', () => {
  const p = { team: { sport: 'NBA' }, override: null, finish: 2 };
  assert.match(scoreExplanation(p), /Reached the final.*8 points.*1-point.*9 points/);
  assert.match(scoreExplanation({ ...p, finish: 1 }), /Won the championship.*12 points/);
  assert.match(scoreExplanation({ ...p, team: { sport: 'Masters Tournament' } }), /^Finished runner-up/);
  assert.match(scoreExplanation({ ...p, finish: 12 }), /12th place.*0 points/);
  assert.match(scoreExplanation({ ...p, finish: 21 }), /21st place/);
  assert.match(scoreExplanation({ ...p, finish: null }), /not been recorded/);
  assert.match(scoreExplanation({ ...p, override: 0 }), /set this score to 0 points/);
});

test('League end follows the last included championship and handles year boundaries', () => {
  const league = { season: 2026, scheduled: Date.UTC(2026,8,1), sports: ['NFL','NHL','MLB'] };
  const t = leagueTimeframe(league);
  assert.equal(new Date(t.end).toISOString().slice(0,10), '2027-06-30');
  assert.deepEqual(t.lastSports, ['NHL']);
  assert.equal(t.start, league.scheduled);
  assert.equal(t.startKnown, true);
  assert.deepEqual(leagueTimeframe({ ...league, sports: ['NBA','NHL'] }).lastSports, ['NBA','NHL']);
  const unscheduled = leagueTimeframe({ ...league, scheduled: null, createdAt: Date.UTC(2026,8,1) });
  assert.equal(unscheduled.startKnown, false);
  assert.equal(unscheduled.end, t.end);
  const future = leagueTimeframe({ season: 2028, createdAt: Date.UTC(2026,8,1), sports: ['NFL'] });
  assert.equal(new Date(future.end).toISOString().slice(0,10), '2028-02-29');
});

test('Turn distance respects both directions of a snake draft and completion', () => {
  const league = { members: ['a','b','c','d'].map(id => ({ id })), sports: ['NBA','NFL'], picks: [] };
  assert.equal(picksUntilTurn(league, 'd'), 3);
  league.picks = Array(3).fill({});
  assert.equal(picksUntilTurn(league, 'd'), 0);
  league.picks = Array(4).fill({});
  assert.equal(picksUntilTurn(league, 'd'), 0);
  assert.equal(picksUntilTurn(league, 'a'), 3);
  league.picks = Array(5).fill({});
  assert.equal(picksUntilTurn(league, 'd'), null);
  league.picks = Array(8).fill({});
  assert.equal(picksUntilTurn(league, 'a'), null);
});
