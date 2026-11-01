import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import { Header } from './components';
import { useConfig } from './theme';
import type { Clip } from '../timeline-engine';

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

interface Props {
  clip: Clip;
  onBack: () => void;
}

// Full-screen clip preview with timestamps and play/pause, capcut style.
export function ClipPreviewScreen({ clip, onBack }: Props) {
  const { theme: t } = useConfig();
  const ref = useRef<VideoRef>(null);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);


  const pct = dur > 0 ? pos / dur : 0;

  return (
    <View style={st.root}>
      <Header title="Preview" subtitle={clip.label ?? 'clip'} />
      <Video
        ref={ref}
        source={{ uri: clip.uri }}
        style={st.video}
        resizeMode="contain"
        paused={!playing}
        onProgress={(e: { currentTime: number }) => setPos(e.currentTime * 1000)}
        onEnd={() => setPlaying(false)}
      />
      <View style={st.controls}>
        <Text style={{ color: t.text, fontVariant: ['tabular-nums'] }}>{fmt(pos)}</Text>
        <Pressable onPress={() => setPlaying(p => !p)} style={[st.playBtn, { borderColor: t.primary }]}>
          <Text style={{ color: t.primary, fontSize: 18 }}>{playing ? '||' : '>'}</Text>
        </Pressable>
        <Text style={{ color: t.text, fontVariant: ['tabular-nums'] }}>{fmt(dur)}</Text>
      </View>
      <View style={st.trackWrap}>
        <View style={[st.track, { backgroundColor: t.textMuted }]}>
          <View style={[st.fill, { backgroundColor: t.primary, width: `${Math.round(pct * 100)}%` }]} />
        </View>
        <View style={[st.thumb, { backgroundColor: t.primary, left: `${Math.min(98, Math.max(0, pct * 100))}%` }]} />
      </View>
      <Pressable onPress={onBack}>
        <Text style={{ color: t.primary, padding: 16, textAlign: 'center' }}>Back to timeline</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d10', justifyContent: 'center' },
  video: { width: '100%', height: 420 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 16 },
  playBtn: { borderWidth: 1.5, borderRadius: 999, width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  trackWrap: { marginHorizontal: 24, marginTop: 20, height: 24, justifyContent: 'center' },
  track: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
  thumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, marginLeft: -8 },
});
