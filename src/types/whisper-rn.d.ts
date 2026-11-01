declare module 'whisper.rn' {
  export interface WhisperSegment { text?: string; t0?: number; t1?: number; [k: string]: unknown }
  export interface WhisperTranscribeResult { result: string; segments?: WhisperSegment[]; [k: string]: unknown }
  export interface WhisperContext {
    transcribe(path: string, opts?: Record<string, unknown>): Promise<WhisperTranscribeResult>;
    release(): Promise<void>;
  }
  export function initWhisper(opts: { filePath: string; [k: string]: unknown }): Promise<WhisperContext>;
}
