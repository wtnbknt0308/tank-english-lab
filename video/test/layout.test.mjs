import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutPositions, seg, ease, mix } from '../engine/parts.js';

test('layoutPositions centers the row and keeps gaps without overlap', () => {
  const widths = [100, 200, 50];
  const xs = layoutPositions(widths, [2, 0, 1], 20, 1000);
  // 合計 = 50+100+200 + 20*2 = 390 → 左端 = (1000-390)/2 = 305
  assert.equal(xs[2], 305);
  assert.equal(xs[0], 305 + 50 + 20);
  assert.equal(xs[1], 305 + 50 + 20 + 100 + 20);
});

test('chunks missing from order get null', () => {
  const xs = layoutPositions([100, 100], [1], 20, 1000);
  assert.equal(xs[0], null);
  assert.equal(xs[1], 450);
});

test('seg/ease/mix are clamped helpers', () => {
  assert.equal(seg(5, 10, 20), 0);
  assert.equal(seg(15, 10, 20), 0.5);
  assert.equal(seg(25, 10, 20), 1);
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  assert.equal(mix(10, 20, 0.25), 12.5);
});
