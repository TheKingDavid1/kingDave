import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const studio = fs.readFileSync(new URL('../src/screens/StudioScreen.tsx', import.meta.url), 'utf8');
const timelineEngine = fs.readFileSync(new URL('../src/timeline-engine/timeline.ts', import.meta.url), 'utf8');

test('Studio exposes accessible clip reorder controls wired to timeline reorder', () => {
  assert.match(studio, /import \{ removeClip, reorderClips, setClipVolume \} from '\.\.\/timeline-engine'/);
  assert.match(studio, /label="Move clip earlier" disabled=\{i === 0\} onPress=\{\(\) => p\.onCommit\(x => reorderClips\(x, i, i - 1\)\)\}/);
  assert.match(studio, /label="Move clip later" disabled=\{i === p\.timeline\.clips\.length - 1\} onPress=\{\(\) => p\.onCommit\(x => reorderClips\(x, i, i \+ 1\)\)\}/);
});

test('Studio volume controls use the clamped timeline volume setter', () => {
  assert.match(studio, /label=\{`Lower volume, \$\{Math\.round\(c\.volume \* 100\)\} percent`\} onPress=\{\(\) => p\.onCommit\(x => setClipVolume\(x, c\.id, c\.volume - 0\.1\)\)\}/);
  assert.match(studio, /label=\{`Raise volume, \$\{Math\.round\(c\.volume \* 100\)\} percent`\} onPress=\{\(\) => p\.onCommit\(x => setClipVolume\(x, c\.id, c\.volume \+ 0\.1\)\)\}/);
  assert.match(timelineEngine, /export function setClipVolume\(t:Timeline,id:string,volume:number\)/);
});
