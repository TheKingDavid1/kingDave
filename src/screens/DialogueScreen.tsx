import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Header } from './components';
import { useConfig } from './theme';

interface Props {
  onBack: () => void;
  onCharacters?: () => void;
  onAnimate?: (lineLabel?: string) => void;
}

export function DialogueScreen({ onBack, onCharacters, onAnimate }: Props) {
  const { theme: t } = useConfig();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header title="Dialogue Studio" subtitle="Write lines, then animate them" />
      {onCharacters && (
        <Pressable onPress={onCharacters}>
          <Text style={{ color: t.primary, marginTop: 12 }}>Manage characters</Text>
        </Pressable>
      )}
      {onAnimate && (
        <Pressable onPress={() => onAnimate(undefined)}>
          <Text style={{ color: t.primary, marginTop: 8 }}>Animate a line</Text>
        </Pressable>
      )}
      <Pressable onPress={onBack}>
        <Text style={{ color: t.primary, marginTop: 16 }}>Back</Text>
      </Pressable>
    </View>
  );
}
