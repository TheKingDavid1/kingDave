import { makeClip } from '../timeline-engine';
import type { Clip } from '../timeline-engine';
import type { SceneRecipe } from './recipe';

/**
 * A generated animated-scene clip. It sits on the timeline like any clip, with its duration from the
 * voiceover. Its recipe is stored on the clip so the project autosaves it as JSON.
 */
export function makeGeneratedClip(input: { recipe: SceneRecipe; durationMs: number; label: string }): Clip {
  const base = makeClip({ uri: input.recipe.baseUri, durationMs: input.durationMs, label: input.label });
  return { ...base, generated: { kind: 'animated-scene', recipe: input.recipe } };
}
