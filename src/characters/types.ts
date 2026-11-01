export interface NormBox{x:number;y:number;w:number;h:number;}
export interface Character{id:string;name:string;stillUri?:string;clipUri?:string;voiceUri?:string;mouthBox:NormBox;eyeBox:NormBox;createdAt:number;}
export function activeSlot(c:Character):{kind:'still'|'clip'|'none';uri?:string}{if(c.clipUri)return{kind:'clip',uri:c.clipUri};if(c.stillUri)return{kind:'still',uri:c.stillUri};return{kind:'none'};}
