import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ExportProgress } from '../render-export';
import { useConfig } from './theme';
import { Header, IconButton, ProgressBar, DurationBadge, comingSoon, fmtClock } from './components';

export interface ProjectCardInfo {
  id: string;
  name: string;
  updatedAt: number;
  durationMs: number;
  clipCount: number;
}

interface Props {
  projects: ProjectCardInfo[];
  exp?: ExportProgress;
  exportName: string;
  exportRes: '720p' | '1080p';
  onNewVideo: () => void;
  onDialogue: () => void;
  onCharacters?: () => void;
  onOpenProject: (id: string) => void;
  onProjectMenu: (p: ProjectCardInfo) => void;
  onDismissExport: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (ms: number) => {
  const d = new Date(ms);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

function exportCopy(exp: ExportProgress, name: string, res: string) {
  switch (exp.status) {
    case 'running':
    case 'queued':
      return { title: `Exporting '${name}' ${res}`, status: 'Keep the app open until it finishes' };
    case 'done':
      return { title: `Exported '${name}' ${res}`, status: 'Export finished' };
    case 'cancelled':
      return { title: `Export of '${name}' cancelled`, status: 'Nothing was saved' };
    default:
      return { title: `Export of '${name}' failed`, status: exp.errorMessage ?? 'Unknown error' };
  }
}

export function ProjectsScreen(p: Props) {
  const { theme: t } = useConfig();
  const running = !!p.exp && (p.exp.status === 'running' || p.exp.status === 'queued');
  const copy = p.exp ? exportCopy(p.exp, p.exportName, p.exportRes) : undefined;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: t.spacing, paddingBottom: 24 }}>
      <Header
        title="Projects"
        subtitle="Your videos, all in one place"
        right={
          <View style={{ flexDirection: 'row' }}>
            <IconButton name="search-outline" label="Search" onPress={() => comingSoon('Search')} />
            <IconButton name="options-outline" label="Filter" onPress={() => comingSoon('Filter')} />
            <IconButton name="ellipsis-vertical" label="More" onPress={() => comingSoon('More')} />
          </View>
        }
      />

      {p.onCharacters && (
        <Pressable
          onPress={p.onCharacters}
          style={{ backgroundColor: t.surface, borderRadius: t.radiusSmall, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Ionicons name="person-circle-outline" size={22} color={t.text} />
          <Text style={{ color: t.text, fontWeight: '600', flex: 1 }}>Character Library</Text>
          <Text style={{ color: t.textMuted, fontSize: 12 }}>Stills, mouth boxes, voices</Text>
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={p.onNewVideo} style={{ flex: 1, borderRadius: t.radius, overflow: 'hidden' }}>
          <LinearGradient
            colors={[t.primaryDeep, t.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: t.spacing, minHeight: 170, justifyContent: 'space-between' }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="add" size={26} color={t.text} />
            </View>
            <View>
              <Text style={{ color: t.text, fontSize: 18, fontWeight: '700' }}>New Video</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>
                Start from scratch or a template
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.text} style={{ position: 'absolute', right: 12, top: 14 }} />
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={p.onDialogue}
          style={{
            flex: 1,
            borderRadius: t.radius,
            backgroundColor: t.surface,
            padding: t.spacing,
            minHeight: 170,
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: t.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons name="waveform" size={24} color={t.background} />
          </View>
          <View>
            <Text style={{ color: t.text, fontSize: 18, fontWeight: '700' }}>Dialogue Studio</Text>
            <Text style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>Turn ideas into natural dialogue</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={t.text} style={{ position: 'absolute', right: 12, top: 14 }} />
        </Pressable>
      </View>

      {p.exp && copy && (
        <View
          style={{
            marginTop: t.spacing,
            backgroundColor: t.surface,
            borderRadius: t.radius,
            padding: 12,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <LinearGradient
            colors={[t.primaryDeep, t.primary]}
            style={{ width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="play" size={20} color={t.text} />
          </LinearGradient>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: t.text, fontWeight: '600', flex: 1 }} numberOfLines={1}>
                {copy.title}
              </Text>
              {!running && (
                <Pressable onPress={p.onDismissExport} hitSlop={8}>
                  <Ionicons name="close" size={18} color={t.textMuted} />
                </Pressable>
              )}
            </View>
            {running && (
              <>
                <ProgressBar progress={p.exp.progress} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: t.textMuted, fontSize: 12 }}>{copy.status}</Text>
                  <Text style={{ color: t.text, fontSize: 12, fontWeight: '600' }}>
                    {Math.round(p.exp.progress * 100)}%
                  </Text>
                </View>
              </>
            )}
            {!running && <Text style={{ color: t.textMuted, fontSize: 12 }}>{copy.status}</Text>}
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: t.spacing + 4, marginBottom: 12 }}>
        <Text style={{ color: t.text, fontSize: t.sectionSize, fontWeight: '600' }}>Recent Projects</Text>
        <Pressable onPress={() => comingSoon('See all')}>
          <Text style={{ color: t.primary, fontWeight: '600' }}>See all &gt;</Text>
        </Pressable>
      </View>

      {p.projects.length === 0 ? (
        <Text style={{ color: t.textMuted, fontSize: 14 }}>No projects yet. Tap New Video to start.</Text>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }}>
          {p.projects.map((proj, i) => (
            <Pressable key={proj.id} onPress={() => p.onOpenProject(proj.id)} style={{ width: '48%' }}>
              <LinearGradient
                colors={i % 2 === 0 ? [t.primaryDeep, t.primary] : ['#2A3B6B', '#34508A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ height: 150, borderRadius: t.radiusSmall, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="play-circle-outline" size={34} color="rgba(255,255,255,0.85)" />
                <View style={{ position: 'absolute', right: 8, bottom: 8 }}>
                  <DurationBadge label={fmtClock(proj.durationMs)} />
                </View>
              </LinearGradient>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: t.text, fontWeight: '600', flex: 1 }} numberOfLines={1}>
                  {proj.name}
                </Text>
                <IconButton
                  name="ellipsis-vertical"
                  size={16}
                  label="Project menu"
                  onPress={() => p.onProjectMenu(proj)}
                />
              </View>
              <Text style={{ color: t.textMuted, fontSize: 12 }}>
                {fmtDate(proj.updatedAt)} · {proj.clipCount} {proj.clipCount === 1 ? 'clip' : 'clips'}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export function showProjectMenu(proj: ProjectCardInfo, onOpen: () => void, onDelete: () => void) {
  Alert.alert(proj.name, undefined, [
    { text: 'Open', onPress: onOpen },
    { text: 'Delete', style: 'destructive', onPress: onDelete },
    { text: 'Cancel', style: 'cancel' },
  ]);
}
