import * as FileSystem from 'expo-file-system';
import { merge, compress } from 'react-native-video-trim';
import type { Timeline, Clip } from '../timeline-engine';

export interface ExportProgress { status: 'queued' | 'running' | 'done' | 'cancelled' | 'error'; progress: number; errorMessage?: string; outputUri?: string; }
export interface ExportEngine { export(t: Timeline, o: { resolution: '720p' | '1080p'; encoder?: string }, cb: (p: ExportProgress) => void): Promise<void>; }

/** Normalize Android MediaStore content URIs before handing media to the native trim module. */
export async function toLocalPath(uri: string): Promise<string> {
  if (uri.startsWith('file://')) return uri.slice('file://'.length);
  if (!uri.startsWith('content://')) return uri;
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error('Selected media is no longer available. Import it again.');
  const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!directory) throw new Error('App storage is unavailable for preparing the selected video.');
  const target = `${directory}export-input-${Date.now()}.mp4`;
  await FileSystem.copyAsync({ from: uri, to: target });
  return target.slice('file://'.length);
}

export const videoTrimExportEngine: ExportEngine = {
  async export(t, o, cb) {
    if (!t.clips.length) throw new Error('Timeline has no clips');
    const width = o.resolution === '720p' ? 720 : 1080;
    const height = o.resolution === '720p' ? 1280 : 1920;
    cb({ status: 'running', progress: 0.1 });
    const urls = await Promise.all(t.clips.map((c: Clip) => toLocalPath(c.uri)));
    const merged = await merge(urls, { outputExt: 'mp4' });
    cb({ status: 'running', progress: 0.7 });
    const mergedPath = await toLocalPath(merged.outputPath);
    const scaled = await compress(mergedPath, { width, height, outputExt: 'mp4', bitrate: o.resolution === '720p' ? 5_000_000 : 10_000_000 });
    cb({ status: 'done', progress: 1, outputUri: scaled.outputPath.startsWith('file://') ? scaled.outputPath : 'file://' + scaled.outputPath });
  },
};

export async function resolveExportEngine(): Promise<ExportEngine> { return videoTrimExportEngine; }
