import * as MediaLibrary from 'expo-media-library';

export type PermissionState = 'granted' | 'denied' | 'undetermined';

/** Read-only check, never prompts. */
export async function getMediaPermission(): Promise<PermissionState> {
  const res = await MediaLibrary.getPermissionsAsync(false, ['video']);
  return res.granted ? 'granted' : (res.canAskAgain ? 'undetermined' : 'denied');
}

/** Prompts the user for video library access (gallery import). */
export async function requestMediaPermission(): Promise<PermissionState> {
  const res = await MediaLibrary.requestPermissionsAsync(false, ['video']);
  return res.granted ? 'granted' : 'denied';
}

/** Gallery access for character reference images, clips and voiceover audio. */
export async function requestLibraryPermission(kind: 'photo' | 'video' | 'audio'): Promise<PermissionState> {
  const cur = await MediaLibrary.getPermissionsAsync(false, [kind]);
  if (cur.granted) return 'granted';
  const res = await MediaLibrary.requestPermissionsAsync(false, [kind]);
  return res.granted ? 'granted' : 'denied';
}

/** Saving exports to the gallery is a separate permission, asked only when needed. */
export async function requestSavePermission(): Promise<PermissionState> {
  const res = await MediaLibrary.requestPermissionsAsync(true);
  return res.granted ? 'granted' : 'denied';
}
