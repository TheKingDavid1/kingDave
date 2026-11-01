const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('root app provides ConfigContext before mounting TimelineScreen', () => {
  const app = read('src/App.tsx');
  assert.match(app, /<ConfigContext\.Provider value=\{DEFAULT_CONFIG\}>[\s\S]*<TimelineScreen config=\{DEFAULT_CONFIG\}\s*\/>[\s\S]*<\/ConfigContext.Provider>/);
});

test('launch restores projects without preventing the Projects screen from rendering', () => {
  const screen = read('src/screens/TimelineScreen.tsx');
  assert.match(screen, /useState<TabName>\('projects'\)/);
  assert.match(screen, /listProjects\(\)[\s\S]*refreshProjects\(\)[\s\S]*catch\(\(e\) => console\.warn\('restore failed'/);
  assert.match(screen, /<ProjectsScreen[\s\S]*onNewVideo=\{newVideo\}/);
});

test('new video enters Studio, then video import reaches the selected clip in the timeline', () => {
  const screen = read('src/screens/TimelineScreen.tsx');
  assert.match(screen, /function newVideo\(\)[\s\S]*setTab\('studio'\)/);
  assert.match(screen, /getMediaPermission\(\)[\s\S]*requestMediaPermission\(\)[\s\S]*getAssetsAsync\(\{ mediaType: 'video'/);
  assert.match(screen, /makeClip\(\{ uri: a\.uri, durationMs: a\.duration \* 1000, label: a\.filename \}\)/);
  assert.match(screen, /addClips\(t2, \[clip\]\)/);
  assert.match(screen, /<ImportSheet visible=\{!!picker\}/);
});

test('Studio enters real single-clip and full-timeline players, with export smoke path', () => {
  const studio = read('src/screens/StudioScreen.tsx');
  const screen = read('src/screens/TimelineScreen.tsx');
  const clipPlayer = read('src/screens/ClipPreviewScreen.tsx');
  const timelinePlayer = read('src/screens/TimelinePreviewScreen.tsx');
  const exporter = read('src/render-export/index.ts');
  assert.match(studio, /setPrevAll\(true\)/);
  assert.match(studio, /setPrevOne\(c\)/);
  assert.match(clipPlayer, /<Video[\s\S]*source=\{\{ uri: clip\.uri \}\}[\s\S]*paused=\{!playing\}/);
  assert.match(timelinePlayer, /<Video[\s\S]*source=\{\{ uri: current\.uri \}\}[\s\S]*onEnd=\{\(\) => \{/);
  assert.match(screen, /await engine\.export\(timeline, \{ resolution: res, encoder: 'hardware-h264' \}, setExp\)/);
  assert.match(exporter, /await merge\(urls, \{ outputExt: 'mp4' \}\)/);
  assert.match(exporter, /await compress\(toLocalPath\(merged\.outputPath\)/);
});
