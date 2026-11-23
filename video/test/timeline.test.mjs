import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTimeline, sceneAt } from '../engine/timeline.js';

const scenes = [
  { id: 'title', versions: ['full', 'digest'], duration: 4 },
  { id: 'practice', versions: ['full'], duration: 10 },
  { id: 'rule', versions: ['full', 'digest'], duration: { full: 8, digest: 5 } },
];

test('digest keeps only digest scenes', () => {
  const tl = buildTimeline(scenes, 'digest');
  assert.deepEqual(tl.items.map(i => i.scene.id), ['title', 'rule']);
});

test('items are contiguous and duration is the sum', () => {
  const tl = buildTimeline(scenes, 'full');
  assert.equal(tl.items[0].start, 0);
  for (let i = 1; i < tl.items.length; i++) assert.equal(tl.items[i].start, tl.items[i - 1].end);
  assert.equal(tl.duration, 4 + 10 + 8);
});

test('per-version duration is used', () => {
  assert.equal(buildTimeline(scenes, 'digest').duration, 4 + 5);
});

test('sceneAt returns next scene on boundary, clamps at end', () => {
  const tl = buildTimeline(scenes, 'full');
  assert.equal(sceneAt(tl, 3.99).scene.id, 'title');
  assert.equal(sceneAt(tl, 4).scene.id, 'practice');
  assert.equal(sceneAt(tl, 4).local, 0);
  const last = sceneAt(tl, 999);
  assert.equal(last.scene.id, 'rule');
  assert.equal(last.local, 8);
});
