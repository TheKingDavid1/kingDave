import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { createTimeline, makeClip, addClips, totalDurationMs, clipDurationMs } from '../timeline-engine';
import type { Clip, Timeline } from '../timeline-engine';
import { requestMediaPermission, getMediaPermission } from '../permissions-manager';
import { useAutosave, listProjects, loadProject, deleteProject } from '../project';
import { resolveExportEngine, type ExportProgress } from '../render-export';
import type { UiConfig } from '../ui-config';
import { ConfigContext, makeStyles } from './theme';
import { TabBar, type TabName } from './components';
import { ProjectsScreen, showProjectMenu, type ProjectCardInfo } from './ProjectsScreen';
import { StudioScreen } from './StudioScreen';
import { AgentScreen } from './AgentScreen';
import { DialogueScreen } from './DialogueScreen';
import { RecipesScreen } from './RecipesScreen';
import { ImportSheet } from './ImportSheet';
import { CaptionScreen } from './CaptionScreen';
import { CharacterLibraryScreen } from '../characters/CharacterLibraryScreen';
import { AnimateSheet, type AudioAttachment } from '../animator/AnimateSheet';
import { listCharacters, saveCharacter, deleteCharacter } from '../characters/characterStore';
import type { Character } from '../characters/types';
import { makeGeneratedClip } from '../animator/clipFactory';

const UNDO_LIMIT = 50;

/**
 * App shell: owns the timeline (single source of truth, autosaved), undo history, the export job,
 * and the tab/overlay navigation. Screens are pure presentation over these.
 */
export function TimelineScreen({ config, onOpenCaptions: _unused }: { config: UiConfig; onOpenCaptions?: (clip: Clip) => void }) {
  const t = config.theme;
  const s = useMemo(() => makeStyles(config), [config]);
  const [tab, setTab] = useState<TabName>('projects');
  const [timeline, setTimeline] = useState<Timeline>(() => createTimeline());
  const [history, setHistory] = useState<Timeline[]>([]);
  const [projects, setProjects] = useState<ProjectCardInfo[]>([]);
  const [picker, setPicker] = useState<MediaLibrary.Asset[] | undefined>();
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [exp, setExp] = useState<ExportProgress | undefined>();
  const [overlay, setOverlay] = useState<'none' | 'dialogue' | 'characters' | 'animate'>('none');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [animateFor, setAnimateFor] = useState<{ characterId?: string; lineLabel?: string; audio?: AudioAttachment }>({});
  useEffect(() => {
    if (overlay === 'characters' || overlay === 'animate') listCharacters().then(setCharacters).catch(() => setCharacters([]));
  }, [overlay]);
  const [captionClip, setCaptionClip] = useState<Clip | undefined>();

  useAutosave(timeline);

  const refreshProjects = useCallback(async () => {
    const list = await listProjects();
    const cards: ProjectCardInfo[] = [];
    for (const e of list.slice(0, 20)) {
      const full = await loadProject(e.id).catch(() => undefined);
      const clips = full?.clips ?? [];
      cards.push({
        id: e.id,
        name: e.name,
        updatedAt: e.updatedAt,
        clipCount: clips.length,
        durationMs: full ? totalDurationMs(full) : 0,
      });
    }
    setProjects(cards);
  }, []);

  // Restore the last project on launch (if any).
  useEffect(() => {
    (async () => {
      const list = await listProjects();
      if (list[0]) {
        const t2 = await loadProject(list[0].id);
        if (t2) setTimeline(t2);
      }
      await refreshProjects();
    })().catch((e) => console.warn('restore failed', e));
  }, [refreshProjects]);

  // Every edit goes through commit so undo can step back.
  const commit = useCallback((fn: (t2: Timeline) => Timeline) => {
    setTimeline((prev) => {
      const next = fn(prev);
      if (next !== prev) setHistory((h) => [...h.slice(-(UNDO_LIMIT - 1)), prev]);
      return next;
    });
  }, []);

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setTimeline(prev);
      return h.slice(0, -1);
    });
  }

  function newVideo() {
    setTimeline(createTimeline());
    setHistory([]);
    setOverlay('none');
    setTab('studio');
  }

  async function openImporter() {
    let perm = await getMediaPermission();
    if (perm !== 'granted') perm = await requestMediaPermission();
    if (perm !== 'granted') {
      Alert.alert('Gallery access needed', 'Allow video access to import clips.');
      return;
    }
    const res = await MediaLibrary.getAssetsAsync({ mediaType: 'video', first: 50, sortBy: [MediaLibrary.SortBy.creationTime] });
    setPicker(res.assets);
  }

  function importAsset(a: MediaLibrary.Asset) {
    const clip = makeClip({ uri: a.uri, durationMs: a.duration * 1000, label: a.filename });
    commit((t2) => addClips(t2, [clip]));
    setPicker(undefined);
  }

  async function runExport(res: '720p' | '1080p') {
    setResolution(res);
    if (timeline.clips.length === 0) return Alert.alert('Nothing to export', 'Add at least one clip.');
    setTab('projects');
    try {
      setExp({ status: 'running', progress: 0 });
      const engine = await resolveExportEngine();
      await engine.export(timeline, { resolution: res, encoder: 'hardware-h264' }, setExp);
    } catch (e) {
      setExp({ status: 'error', progress: 0, errorMessage: (e as Error).message });
    }
  }

  async function openProject(id: string) {
    const t2 = await loadProject(id);
    if (!t2) return Alert.alert('Not found', 'That project could not be opened.');
    setTimeline(t2);
    setHistory([]);
    setTab('studio');
  }

  function projectMenu(p: ProjectCardInfo) {
    showProjectMenu(
      p,
      () => openProject(p.id),
      () =>
        Alert.alert('Delete project?', `"${p.name}" will be removed from this device.`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteProject(p.id);
              if (p.id === timeline.id) {
                setTimeline(createTimeline());
                setHistory([]);
              }
              await refreshProjects();
            },
          },
        ]),
    );
  }

  const exportName = timeline.name;
  const showExportBanner = !!exp;
  const bannerExp = showExportBanner ? exp : undefined;

  let body: React.ReactNode;
  if (captionClip) {
    body = <CaptionScreen clip={captionClip} config={config} onBack={() => setCaptionClip(undefined)} />;
  } else if (overlay === 'dialogue') {
    body = (
      <DialogueScreen
        onBack={() => setOverlay('none')}
        onCharacters={() => setOverlay('characters')}
        onAnimate={(lineLabel) => {
          setAnimateFor({ lineLabel });
          setOverlay('animate');
        }}
      />
    );
  } else if (overlay === 'characters') {
    body = (
      <CharacterLibraryScreen
        characters={characters}
        onBack={() => setOverlay('none')}
        onSave={async (c) => {
          await saveCharacter(c);
          setCharacters(await listCharacters());
        }}
        onDelete={async (id) => {
          await deleteCharacter(id);
          setCharacters(await listCharacters());
        }}
        onAnimate={(c) => {
          setAnimateFor({ characterId: c.id });
          setOverlay('animate');
        }}
      />
    );
  } else if (overlay === 'animate') {
    body = (
      <AnimateSheet
        characters={characters}
        initialCharacterId={animateFor.characterId}
        lineLabel={animateFor.lineLabel}
        initialAudio={animateFor.audio}
        onClose={() => setOverlay('none')}
        onOpenCharacters={() => setOverlay('characters')}
        onAudioChange={(a) => setAnimateFor((s) => ({ ...s, audio: a }))}
        onSendToTimeline={(p) => {
          const clip = makeGeneratedClip({ recipe: p.recipe, durationMs: p.durationMs, label: p.label });
          commit((t2) => addClips(t2, [clip]));
          setOverlay('none');
        }}
      />
    );
  } else if (tab === 'projects') {
    body = (
      <ProjectsScreen
        projects={projects}
        exp={bannerExp}
        exportName={exportName}
        exportRes={resolution}
        onNewVideo={newVideo}
        onDialogue={() => setOverlay('dialogue')}
        onCharacters={() => setOverlay('characters')}
        onOpenProject={openProject}
        onProjectMenu={projectMenu}
        onDismissExport={() => setExp(undefined)}
      />
    );
  } else if (tab === 'studio') {
    body = (
      <StudioScreen
        timeline={timeline}
        onCommit={commit}
        onUndo={undo}
        canUndo={history.length > 0}
        onImport={openImporter}
        onExport={runExport}
        onOpenCaptions={setCaptionClip}
      />
    );
  } else if (tab === 'agent') {
    body = <AgentScreen timeline={timeline} onCommit={commit} />;
  } else {
    body = <RecipesScreen />;
  }

  return (
    <ConfigContext.Provider value={config}>
      <View style={{ flex: 1, backgroundColor: t.background }}>
        <View style={{ flex: 1, paddingTop: 4 }}>{body}</View>
        {!captionClip && overlay === 'none' && <TabBar active={tab} onChange={setTab} />}
        <ImportSheet visible={!!picker} assets={picker ?? []} onPick={importAsset} onClose={() => setPicker(undefined)} />
      </View>
    </ConfigContext.Provider>
  );
}
