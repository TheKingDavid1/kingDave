import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Timeline} from '../timeline-engine';
const INDEX='dave.projects.index.v1', prefix='dave.project.v1.';
export interface ProjectIndexEntry{id:string;name:string;updatedAt:number;}
export async function listProjects():Promise<ProjectIndexEntry[]>{return JSON.parse((await AsyncStorage.getItem(INDEX))||'[]');}
export async function saveProject(project:Timeline):Promise<void>{await AsyncStorage.setItem(prefix+project.id,JSON.stringify(project));const all=await listProjects();await AsyncStorage.setItem(INDEX,JSON.stringify([{id:project.id,name:project.name,updatedAt:project.updatedAt},...all.filter(x=>x.id!==project.id)].sort((a,b)=>b.updatedAt-a.updatedAt)));}
export async function loadProject(id:string):Promise<Timeline|undefined>{const raw=await AsyncStorage.getItem(prefix+id);if(!raw)return undefined;const t=JSON.parse(raw) as Timeline;return {...t,clips:Array.isArray(t.clips)?t.clips:[],captions:Array.isArray(t.captions)?t.captions:[]};}
export async function deleteProject(id:string):Promise<void>{await AsyncStorage.removeItem(prefix+id);await AsyncStorage.setItem(INDEX,JSON.stringify((await listProjects()).filter(x=>x.id!==id)));}
