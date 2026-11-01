import * as FileSystem from 'expo-file-system';
import { merge, compress } from 'react-native-video-trim';
import type { Timeline, Clip } from '../timeline-engine';

export interface ExportProgress { status: 'queued' | 'running' | 'done' | 'cancelled' | 'error'; progress: number; errorMessage?: string; outputUri?: string; }
export interface ExportEngine { export(t: Timeline, o: { resolution: '720p' | '1080p'; encoder?: string }, cb: (p: ExportProgress) => void): Promise<void>; }

function toLocalPath(uri: string): string { return uri.replace('file://', ''); }

export const videoTrimExportEngine: ExportEngine = {
  async export(t, o, cb) {
    if (!t.clips.length) throw new Error('Timeline has no clips');
    const width = o.resolution === '720p' ? 720 : 1080;
    const height = o.resolution === '720p' ? 1280 : 1920;
    cb({ status: 'running', progress: 0.1 });
    const urls = t.clips.map((c: Clip) => toLocalPath(c.uri));
    const merged = await merge(urls, { outputExt: 'mp4' });
    cb({ status: 'running', progress: 0.7 });
    const scaled = await compress(toLocalPath(merged.outputPath), { width, height, outputExt: 'mp4', bitrate: o.resolution === '720p' ? 5_000_000 : 10_000_000 });
    cb({ status: 'done', progress: 1, outputUri: 'file://' + scaled.outputPath });
  },
};

export async function resolveExportEngine(): Promise<ExportEngine> { return videoTrimExportEngine; }
