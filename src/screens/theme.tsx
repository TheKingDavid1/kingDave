import React,{createContext,useContext} from 'react';
import type {UiConfig} from '../ui-config';
export const ConfigContext=createContext<UiConfig>({theme:{background:'#0B0D14',surface:'#171A25',surfaceElevated:'#222637',primary:'#7C5CFC',primaryDeep:'#4934A8',accent:'#54D6C8',text:'#fff',textMuted:'#9AA0B4',spacing:16,radius:20,radiusSmall:12,sectionSize:18}});
export function useConfig(){return useContext(ConfigContext);}
export const makeStyles=(_c:UiConfig)=>({});
