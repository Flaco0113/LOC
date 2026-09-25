import { test } from 'node:test';
import assert from 'node:assert/strict';
import { picksUntilTurn } from '../ui-state.js';

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
