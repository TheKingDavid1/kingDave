export interface WhisperModel{ id:string;label:string;fileName:string;downloadUrl?:string;}
// Supply a verified model download and license before enabling first-run model setup.
export const WHISPER_MODELS:WhisperModel[]=[{id:'tiny-en',label:'Whisper Tiny English',fileName:'ggml-tiny.en.bin'}];
