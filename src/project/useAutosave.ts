import {useEffect} from 'react';
import type {Timeline} from '../timeline-engine';
import {saveProject} from './projectStore';
export function useAutosave(project:Timeline,delayMs=500){useEffect(()=>{const h=setTimeout(()=>{void saveProject(project).catch(e=>console.warn('autosave failed',e));},delayMs);return()=>clearTimeout(h);},[project,delayMs]);}
