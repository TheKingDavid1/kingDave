export interface Envelope{values:number[];sampleRate:number;}
// v2 placeholder: decode audio and compute an RMS envelope using a native audio adapter.
export async function buildEnvelope(_audioUri:string):Promise<Envelope>{throw new Error('Audio envelope extraction is not implemented yet');}
