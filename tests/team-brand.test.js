import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teamBrand } from '../team-brand.js';
import { catalog } from '../catalog.js';

test('draft contender marks use standard professional team abbreviations', () => {
  assert.equal(teamBrand({ name:'New York Knicks', sport:'NBA' }).initials, 'NYK');
  assert.equal(teamBrand({ name:'Los Angeles Lakers', sport:'NBA' }).initials, 'LAL');
  assert.equal(teamBrand({ name:'Kansas City Chiefs', sport:'NFL' }).initials, 'KC');
  assert.equal(teamBrand({ name:'New York Yankees', sport:'MLB' }).initials, 'NYY');
  assert.equal(teamBrand({ name:'Toronto Maple Leafs', sport:'NHL' }).initials, 'TOR');
});

test('college, club and racing contenders use compact organization codes', () => {
  assert.equal(teamBrand({ name:'Duke', sport:'NCAA Basketball' }).initials, 'DUK');
  assert.equal(teamBrand({ name:'North Carolina', sport:'NCAA Basketball' }).initials, 'UNC');
  assert.equal(teamBrand({ name:'Real Madrid', sport:'UEFA Champions League' }).initials, 'RMA');
  assert.equal(teamBrand({ name:'Hendrick Motorsports', sport:'NASCAR' }).initials, 'HMS');
});

test('Masters contenders use initials from the golfer name and retain special team colors', () => {
  const golfer = teamBrand({ name:'Scottie Scheffler', sport:'Masters Tournament' });
  assert.equal(golfer.initials, 'SS');
  assert.equal(teamBrand({ name:'Rory McIlroy', sport:'Masters Tournament' }).initials, 'RM');
  assert.equal(teamBrand({ name:'New York Knicks', sport:'NBA' }).background, '#006BB6');
  assert.equal(teamBrand({ name:'Duke', sport:'NCAA Basketball' }).background, '#00539B');
  assert.equal(teamBrand({ name:'North Carolina', sport:'NCAA Basketball' }).background, '#7BAFD4');
  assert.equal(teamBrand({ name:'North Carolina', sport:'NCAA Basketball' }).foreground, '#08111f');
});

test('every NBA, NFL, MLB, and NHL catalog team has its own mapped team palette', () => {
  for (const sport of ['NBA','NFL','MLB','NHL']) {
    for (const name of catalog[sport]) {
      const brand=teamBrand({ name, sport });
      assert.notEqual(brand.background, '#20364e', `${sport} ${name} should not use the generic palette`);
    }
  }
});
