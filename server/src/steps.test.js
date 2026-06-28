import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, computeStatus, sanitizeCompleted } from './steps.js';

test('status is "planned" when no steps are completed', () => {
  assert.equal(computeStatus([]), 'planned');
});

test('status is "ongoing" when some steps are completed', () => {
  assert.equal(computeStatus([STEPS[0].id]), 'ongoing');
});

test('status is "done" when every step is completed', () => {
  const all = STEPS.map((s) => s.id);
  assert.equal(computeStatus(all), 'done');
});

test('sanitizeCompleted drops unknown and duplicate ids', () => {
  const input = [STEPS[0].id, STEPS[0].id, 'not_a_real_step'];
  assert.deepEqual(sanitizeCompleted(input), [STEPS[0].id]);
});

test('unknown ids do not make a release look done', () => {
  const all = STEPS.map((s) => s.id);
  // one real step swapped for junk should not count as fully done
  const tampered = [...all.slice(1), 'junk'];
  assert.equal(computeStatus(tampered), 'ongoing');
});
