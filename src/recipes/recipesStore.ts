import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY='dave.recipes.v1';export interface RecipeStyle{captions?:string;pace?:string;transition?:string;music?:string;}
export interface Recipe{id:string;name:string;summary:string;style:RecipeStyle;createdAt:number;}
export async function listRecipes():Promise<Recipe[]>{return JSON.parse((await AsyncStorage.getItem(KEY))||'[]');}
export async function saveRecipe(input:{name:string;style:RecipeStyle;summary?:string}):Promise<Recipe>{const item:Recipe={id:`rc_${Date.now().toString(36)}`,name:input.name,summary:input.summary??summarizeStyle(input.style),style:input.style,createdAt:Date.now()};await AsyncStorage.setItem(KEY,JSON.stringify([item,...await listRecipes()]));return item;}
export function summarizeStyle(s:RecipeStyle){return [s.captions,s.pace,s.transition,s.music].filter(Boolean).join(' · ')||'Custom edit style';}
