import type {Clip,Timeline} from './types';
const id=()=>`cl_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
export function createTimeline(name='Untitled video'):Timeline{return {id:id(),name,createdAt:Date.now(),updatedAt:Date.now(),clips:[],captions:[],width:1080,height:1920};}
export function makeClip(x:{uri:string;durationMs:number;label?:string;kind?:Clip['kind']}):Clip{return {id:id(),uri:x.uri,label:x.label??'Clip',kind:x.kind??'video',durationMs:Math.max(1,x.durationMs),trimStartMs:0,trimEndMs:Math.max(1,x.durationMs),volume:1};}
export function addClips(t:Timeline,clips:Clip[]):Timeline{return {...t,clips:[...t.clips,...clips],updatedAt:Date.now()};}
export function removeClip(t:Timeline,id:string):Timeline{return {...t,clips:t.clips.filter(c=>c.id!==id),updatedAt:Date.now()};}
export function reorderClips(t:Timeline,from:number,to:number):Timeline{const clips=[...t.clips];if(from<0||from>=clips.length||to<0||to>=clips.length)return t;const [c]=clips.splice(from,1);clips.splice(to,0,c);return {...t,clips,updatedAt:Date.now()};}
export function updateClip(t:Timeline,id:string,patch:Partial<Clip>):Timeline{return {...t,clips:t.clips.map(c=>c.id===id?{...c,...patch}:c),updatedAt:Date.now()};}
export const clipDurationMs=(c:Clip)=>Math.max(0,(c.trimEndMs||c.durationMs)-(c.trimStartMs||0));
export const totalDurationMs=(t:Timeline)=>t.clips.reduce((n,c)=>n+clipDurationMs(c),0);
