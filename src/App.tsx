import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TimelineScreen } from './screens/TimelineScreen';
import { DEFAULT_CONFIG } from './ui-config';
export default function App(){ return <><StatusBar style="light"/><TimelineScreen config={DEFAULT_CONFIG}/></>; }
