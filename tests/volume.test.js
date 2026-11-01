import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/timeline-engine/timeline.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const module = { exports: {} };
vm.runInNewContext(js, { module, exports: module.exports, Date, Math, Number });
const { createTimeline, makeClip, addClips, setClipVolume } = module.exports;

test('clip volume is clamped to the free 0 to 1 range', () => {
  const timeline = addClips(createTimeline(), [makeClip({ uri: 'file://a.mp4', durationMs: 2000 })]);
  const id = timeline.clips[0].id;
  assert.equal(setClipVolume(timeline, id, 0.4).clips[0].volume, 0.4);
  assert.equal(setClipVolume(timeline, id, -1).clips[0].volume, 0);
  assert.equal(setClipVolume(timeline, id, 2).clips[0].volume, 1);
  assert.equal(setClipVolume(timeline, id, Number.NaN), timeline);
  assert.equal(setClipVolume(timeline, 'missing', 0.5), timeline);
});
