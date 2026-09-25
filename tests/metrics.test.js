import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {recordOutcome} from '../metrics.js';

test('Outcome instrumentation aggregates results without identifiers or sensitive contents',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'loc-metrics-'));
  recordOutcome(dir,'/api/leagues/private-league-id/pick',200,35);
  recordOutcome(dir,'/api/leagues/another-private-id/pick',409,20);
  recordOutcome(dir,'/api/leagues/another-private-id/pick',200,15);
  recordOutcome(dir,'/api/secret@example.invalid',404,10);
  const text=fs.readFileSync(path.join(dir,'metrics.json'),'utf8'),rows=Object.values(JSON.parse(text));
  assert.equal(rows.length,2);assert.equal(rows[0].count,2);assert.equal(rows[0].totalMs,50);
  assert.doesNotMatch(text,/private|secret|@/);
});
