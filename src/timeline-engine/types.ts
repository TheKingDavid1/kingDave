export type ClipKind = 'video' | 'image' | 'audio';
export interface Clip { id:string; uri:string; label:string; kind:ClipKind; durationMs:number; trimStartMs:number; trimEndMs:number; volume:number; generated?:{kind:'animated-scene';recipe:unknown}; }
export interface Timeline { id:string; name:string; createdAt:number; updatedAt:number; clips:Clip[]; captions:Caption[]; width:number; height:number; }
export interface Caption { id:string; text:string; startMs:number; endMs:number; style?:string; }
