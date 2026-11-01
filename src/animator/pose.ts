import type{SceneRecipe}from'./recipe';
export interface Pose{mouthLevel:number;blink:number;idleOffset:number;}
export function poseAt(recipe:SceneRecipe,timeMs:number,envelope:number):Pose{const phase=2*Math.PI*timeMs/recipe.idle.periodMs;return{mouthLevel:Math.max(0,Math.min(1,envelope)),blink:0,idleOffset:Math.sin(phase)*recipe.idle.amplitude};}
