import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, inactiveCatalogEntries } from '../catalog.js';

test('season catalogs contain complete verified fields without duplicate choices', () => {
  const expectedCounts = {
    NBA: 30,
    NFL: 32,
    MLB: 30,
    NHL: 32,
    'NCAA Football': 266,
    'NCAA Basketball': 365,
    'UEFA Champions League': 38,
    NASCAR: 15,
    'Masters Tournament': 91
  };

  for (const [sport, expected] of Object.entries(expectedCounts)) {
    assert.equal(catalog[sport].length, expected, `${sport} should have ${expected} choices`);
    assert.equal(new Set(catalog[sport]).size, expected, `${sport} should not have duplicate choices`);
  }

  const championsLeagueField = catalog['UEFA Champions League'].filter(
    name => !inactiveCatalogEntries['UEFA Champions League'].has(name)
  );
  assert.equal(championsLeagueField.length, 36);
  assert.equal(new Set(championsLeagueField).size, 36);
});

