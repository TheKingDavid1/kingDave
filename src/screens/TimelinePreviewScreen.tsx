import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useConfig } from './theme';
import type { Timeline, Clip } from '../timeline-engine';

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

interface Props { timeline: Timeline; onClose: () => void }

// Plays the timeline clips back-to-back like an export would. Tap a clip block to jump to it.
export function TimelinePreviewScreen({ timeline, onClose }: Props) {
  const { theme: t } = useConfig();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(0);
  const clips: Clip[] = timeline.clips;
  const current = clips[Math.min(idx, clips.length - 1)];
  const before = clips.slice(0, Math.min(idx, clips.length)).reduce((n, c) => n + c.durationMs, 0);
  const total = clips.reduce((n, c) => n + c.durationMs, 0);
  const globalPos = before + pos;
  useEffect(() => { setPos(0); }, [idx]);

  if (!current) return null;
  return (
    <View style={s.root}>
      <Video
        source={{ uri: current.uri }}
        style={s.video}
        resizeMode="contain"
        paused={!playing}
        onProgress={(e: { currentTime: number }) => setPos(e.currentTime * 1000)}
        onEnd={() => { if (idx + 1 < clips.length) setIdx(idx + 1); else setPlaying(false); }}
      />
      <Text style={{ color: t.text, textAlign: 'center', marginTop: 10, fontVariant: ['tabular-nums'] }}>
        {fmt(globalPos)} / {fmt(total)} · clip {Math.min(idx + 1, clips.length)}/{clips.length}
      </Text>
      <View style={[s.strip, { marginHorizontal: 16, marginTop: 14 }]}>
        {clips.map((c, i) => (
          <Pressable key={c.id} onPress={() => setIdx(i)}
            style={[s.block, { flex: Math.max(1, Math.round(c.durationMs / 1000)), backgroundColor: i === idx ? t.primary : t.surfaceElevated, borderColor: i === idx ? t.accent : 'transparent' }]}>
            <Text numberOfLines={1} style={{ color: i === idx ? '#fff' : t.text, fontSize: 10 }}>{fmt(c.durationMs)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.row}>
        <Pressable onPress={() => setPlaying(p => !p)} style={[s.btn, { borderColor: t.primary }]}>
          <Text style={{ color: t.primary }}>{playing ? 'PAUSE' : 'PLAY'}</Text>
        </Pressable>
        <Pressable onPress={() => setIdx(Math.max(0, idx - 1))} style={[s.btn, { borderColor: t.primary }]}>
          <Text style={{ color: t.primary }}>prev</Text>
        </Pressable>
        <Pressable onPress={() => setIdx(Math.min(clips.length - 1, idx + 1))} style={[s.btn, { borderColor: t.primary }]}>
          <Text style={{ color: t.primary }}>next</Text>
        </Pressable>
      </View>
      <Pressable onPress={onClose}>
        <Text style={{ color: t.primary, padding: 16, textAlign: 'center' }}>Close preview</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d10', justifyContent: 'center' },
  video: { width: '100%', height: 380 },
  strip: { flexDirection: 'row', height: 42, gap: 3 },
  block: { borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 14 },
  btn: { borderWidth: 1.5, borderRadius: 999, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
});
