import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TimelineScreen } from './screens/TimelineScreen';
import { ConfigContext } from './screens/theme';
import { DEFAULT_CONFIG } from './ui-config';

export default function App() {
  return (
    <ConfigContext.Provider value={DEFAULT_CONFIG}>
      <StatusBar style="light" />
      <TimelineScreen config={DEFAULT_CONFIG} />
    </ConfigContext.Provider>
  );
}
