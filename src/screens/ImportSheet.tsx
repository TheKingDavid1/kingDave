import React from 'react';
import { Modal, View, Text, Pressable, FlatList, Image, useWindowDimensions } from 'react-native';
import type { Asset } from 'expo-media-library';
import { useConfig } from './theme';

export function ImportSheet(p: { visible: boolean; assets: Asset[]; onPick: (a: Asset) => void; onClose: () => void }) {
  const { theme: t } = useConfig();
  const { width } = useWindowDimensions();
  const cellWidth = Math.max(0, (width - 32) / 3);

  return (
    <Modal visible={p.visible} transparent animationType="slide" onRequestClose={p.onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#0008' }}>
        <View style={{ height: '75%', backgroundColor: t.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: '700' }}>Import video</Text>
            <Pressable onPress={p.onClose}><Text style={{ color: t.primary }}>Close</Text></Pressable>
          </View>
          <FlatList
            data={p.assets}
            keyExtractor={x => x.id}
            numColumns={3}
            renderItem={({ item }) => (
              <Pressable onPress={() => p.onPick(item)} style={{ width: cellWidth, padding: 4 }}>
                <Image source={{ uri: item.uri }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} />
                <Text numberOfLines={1} style={{ color: t.textMuted, fontSize: 11 }}>{item.filename}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
