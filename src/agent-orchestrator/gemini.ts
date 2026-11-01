import AsyncStorage from '@react-native-async-storage/async-storage';
const CONFIG_KEY='dave.ai.config.v1';
export class AgentError extends Error{}
export interface AiConfig{geminiApiKeys?:string[];geminiApiKey?:string;groqApiKeys?:string[];groqApiKey?:string;proxyUrl?:string;}
export async function saveAiConfig(config:AiConfig){
  const normalized:{geminiApiKeys?:string[];groqApiKeys?:string[];proxyUrl?:string}={};
  if(config.geminiApiKeys?.length)normalized.geminiApiKeys=config.geminiApiKeys.filter(Boolean);
  else if(config.geminiApiKey)normalized.geminiApiKeys=[config.geminiApiKey];
  if(config.groqApiKeys?.length)normalized.groqApiKeys=config.groqApiKeys.filter(Boolean);
  else if(config.groqApiKey)normalized.groqApiKeys=[config.groqApiKey];
  if(config.proxyUrl)normalized.proxyUrl=config.proxyUrl;
  await AsyncStorage.setItem(CONFIG_KEY,JSON.stringify(normalized));
}
async function readConfig():Promise<AiConfig>{return JSON.parse((await AsyncStorage.getItem(CONFIG_KEY))||'{}');}
export async function getAiConfig():Promise<AiConfig>{return readConfig();}
export async function getGeminiKeys():Promise<string[]>{
  const c=await readConfig();const keys=c.geminiApiKeys??(c.geminiApiKey?[c.geminiApiKey]:[]);
  if(!keys.length)throw new AgentError('Add at least one Gemini API key in AI settings first.');
  return keys;
}
export async function getGroqKeys():Promise<string[]>{
  const c=await readConfig();const keys=c.groqApiKeys??(c.groqApiKey?[c.groqApiKey]:[]);
  return keys;
}
// Round-robin cursor so consecutive requests spread across all keys (avoids per-key rate limits).
let geminiCursor=0;
export async function getGeminiKey():Promise<string>{const keys=await getGeminiKeys();const k=keys[geminiCursor%keys.length];geminiCursor++;return decryptRuntimeStub(k);}
let groqCursor=0;
export async function getGroqKey():Promise<string|null>{const keys=await getGroqKeys();if(!keys.length)return null;const k=keys[groqCursor%keys.length];groqCursor++;return decryptRuntimeStub(k);}
// Placeholder for the future encrypted-at-rest secret adapter. It is NOT cryptography; move keys to a Cloudflare Worker proxy before public release.
export function decryptRuntimeStub(ciphertext:string){return ciphertext;}
