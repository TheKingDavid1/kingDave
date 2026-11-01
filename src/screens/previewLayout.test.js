const test = require('node:test');
const assert = require('node:assert/strict');
const { getPreviewFrame } = require('./previewLayout');

test('keeps studio preview at 16:9 on a tall phone', () => {
  const frame = getPreviewFrame(360, 800);
  assert.deepEqual(frame, { width: 360, height: 202.5 });
});

test('caps a 16:9 preview to available vertical space', () => {
  const frame = getPreviewFrame(900, 400);
  assert.equal(frame.height, 184);
  assert.equal(frame.width / frame.height, 16 / 9);
});

test('returns zero-sized layout when dimensions are not ready', () => {
  assert.deepEqual(getPreviewFrame(0, 400), { width: 0, height: 0 });
  assert.deepEqual(getPreviewFrame(300, Number.NaN), { width: 0, height: 0 });
});
