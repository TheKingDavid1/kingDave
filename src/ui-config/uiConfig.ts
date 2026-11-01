export interface Theme {background:string;surface:string;surfaceElevated:string;primary:string;primaryDeep:string;accent:string;text:string;textMuted:string;spacing:number;radius:number;radiusSmall:number;sectionSize:number;}
export interface UiConfig{theme:Theme;}
export const DEFAULT_CONFIG:UiConfig={theme:{background:'#0B0D14',surface:'#171A25',surfaceElevated:'#222637',primary:'#7C5CFC',primaryDeep:'#4934A8',accent:'#54D6C8',text:'#FFFFFF',textMuted:'#9AA0B4',spacing:16,radius:20,radiusSmall:12,sectionSize:18}};
