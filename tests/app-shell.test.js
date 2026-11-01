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

test('launch to Studio to gallery import hands the selected media through to project preview', () => {
  const screen = read('src/screens/TimelineScreen.tsx');
  const importer = read('src/screens/ImportSheet.tsx');
  const studio = read('src/screens/StudioScreen.tsx');
  const player = read('src/screens/TimelinePreviewScreen.tsx');
  assert.match(screen, /function newVideo\(\)[\s\S]*setTab\('studio'\)/);
  assert.match(screen, /getMediaPermission\(\)[\s\S]*requestMediaPermission\(\)[\s\S]*getAssetsAsync\(\{ mediaType: 'video'/);
  assert.match(importer, /onPress=\{\(\) => p\.onPick\(item\)\}/);
  assert.match(screen, /makeClip\(\{ uri: a\.uri, durationMs: a\.duration \* 1000, label: a\.filename \}\)/);
  assert.match(screen, /addClips\(t2, \[clip\]\)/);
  assert.match(studio, /setPrevAll\(true\)/);
  assert.match(player, /<Video[\s\S]*source=\{\{ uri: current\.uri \}\}[\s\S]*onEnd=\{\(\) => \{/);
});

test('AI agent actions apply to the same timeline and autosave persists edits before export', () => {
  const screen = read('src/screens/TimelineScreen.tsx');
  const agent = read('src/screens/AgentScreen.tsx');
  const actions = read('src/agent-orchestrator/actions.ts');
  const autosave = read('src/project/useAutosave.ts');
  assert.match(screen, /<AgentScreen timeline=\{timeline\} onCommit=\{commit\}/);
  assert.match(agent, /applyActions\(p\.timeline,actions\)/);
  assert.match(agent, /p\.onCommit\(\(\)=>r\.timeline\)/);
  assert.match(actions, /case'trim_clip'/);
  assert.match(autosave, /saveProject/);
  assert.match(screen, /await engine\.export\(timeline, \{ resolution: res, encoder: 'hardware-h264' \}, setExp\)/);
});

test('export prepares Android content URIs and exposes explicit export error states', () => {
  const exporter = read('src/render-export/index.ts');
  const screen = read('src/screens/TimelineScreen.tsx');
  assert.match(exporter, /uri\.startsWith\('content:\/\/'\)/);
  assert.match(exporter, /copyAsync\(\{ from: uri, to: target \}\)/);
  assert.match(exporter, /await merge\(urls, \{ outputExt: 'mp4' \}\)/);
  assert.match(exporter, /await compress\(mergedPath/);
  assert.match(screen, /setExp\(\{ status: 'error', progress: 0, errorMessage:/);
});
