import type { Character, NormBox } from '../characters/types';
import { activeSlot } from '../characters/types';
import defaults from './defaults.json';

// A scene recipe is plain JSON: everything needed to re-animate a scene. It is stored on the
// timeline clip (generated.recipe), so it saves with the project. Envelope data is never stored;
// it is recomputed from audioUri when needed.

export type Emotion = 'neutral' | 'happy' | 'angry' | 'shocked';
export const EMOTIONS: Emotion[] = ['neutral', 'happy', 'angry', 'shocked'];

export interface SceneRecipe {
  version: 1;
  sceneId: string;
  characterId: string;
  characterName: string;
  /** 'clip' means an uploaded animation clip is the base and procedural layers are off */
  baseSource: 'still' | 'clip';
  baseUri: string;
  audioUri: string;
  durationMs: number;
  emotion: Emotion;
  mouthBox: NormBox;
  eyeBox: NormBox;
  idle: { amplitude: number; periodMs: number };
  blink: { minGapMs: number; maxGapMs: number; closeMs: number; seed: number };
  mouthThresholds: [number, number, number];
}

interface RecipeParams {
  idle: { amplitude: number; periodMs: number };
  blink: { minGapMs: number; maxGapMs: number; closeMs: number };
  mouthThresholds: [number, number, number];
}

// Same pattern as ui-config: bundled defaults fill any missing keys.
const PARAMS: RecipeParams = defaults as unknown as RecipeParams;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function newSceneId(): string {
  return `sc_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function buildSceneRecipe(input: {
  sceneId: string;
  character: Character;
  audioUri: string;
  durationMs: number;
  emotion: Emotion;
}): SceneRecipe {
  const slot = activeSlot(input.character);
  if (slot.kind === 'none' || !slot.uri) throw new Error(`${input.character.name} has no image or clip yet`);
  return {
    version: 1,
    sceneId: input.sceneId,
    characterId: input.character.id,
    characterName: input.character.name,
    baseSource: slot.kind === 'clip' ? 'clip' : 'still',
    baseUri: slot.uri,
    audioUri: input.audioUri,
    durationMs: Math.max(1, Math.round(input.durationMs)),
    emotion: input.emotion,
    mouthBox: input.character.mouthBox,
    eyeBox: input.character.eyeBox,
    idle: { ...PARAMS.idle },
    blink: { ...PARAMS.blink, seed: hashSeed(input.sceneId) },
    mouthThresholds: [...PARAMS.mouthThresholds] as [number, number, number],
  };
}

/** Validates a stored recipe; missing optional keys come from defaults. Unknown versions are refused. */
export function parseSceneRecipe(raw: unknown): SceneRecipe | undefined {
  const r = raw as Partial<SceneRecipe> | undefined;
  if (!r || r.version !== 1) return undefined;
  if (typeof r.sceneId !== 'string' || typeof r.baseUri !== 'string' || typeof r.audioUri !== 'string') return undefined;
  if (typeof r.durationMs !== 'number' || r.durationMs <= 0) return undefined;
  const emotion = EMOTIONS.includes(r.emotion as Emotion) ? (r.emotion as Emotion) : 'neutral';
  return {
    version: 1,
    sceneId: r.sceneId,
    characterId: String(r.characterId ?? ''),
    characterName: String(r.characterName ?? ''),
    baseSource: r.baseSource === 'clip' ? 'clip' : 'still',
    baseUri: r.baseUri,
    audioUri: r.audioUri,
    durationMs: r.durationMs,
    emotion,
    mouthBox: r.mouthBox ?? { x: 0.38, y: 0.58, w: 0.24, h: 0.1 },
    eyeBox: r.eyeBox ?? { x: 0.24, y: 0.36, w: 0.52, h: 0.1 },
    idle: { ...PARAMS.idle, ...(r.idle ?? {}) },
    blink: { ...PARAMS.blink, seed: hashSeed(r.sceneId), ...(r.blink ?? {}) },
    mouthThresholds: (r.mouthThresholds ?? PARAMS.mouthThresholds) as [number, number, number],
  };
}
