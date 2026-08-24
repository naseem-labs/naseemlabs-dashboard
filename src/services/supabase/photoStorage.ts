import { getSupabaseClient } from '../../lib/supabase';
import type { DbLeadPhoto } from './types';

const PATIENT_PHOTOS_BUCKET = 'patient-photos';
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60;

export function normalizePatientPhotoStoragePath(storagePath: string): string {
  const prefix = `${PATIENT_PHOTOS_BUCKET}/`;
  if (storagePath.startsWith(prefix)) {
    return storagePath.slice(prefix.length);
  }
  return storagePath;
}

function isStoredPatientPhoto(photo: DbLeadPhoto): boolean {
  return Boolean(photo.storage_path) && !photo.storage_path.startsWith('pending/');
}

export async function createSignedPhotoUrls(
  photos: DbLeadPhoto[],
): Promise<Record<string, string>> {
  const supabase = getSupabaseClient();
  const signedUrls: Record<string, string> = {};

  await Promise.all(
    photos.filter(isStoredPatientPhoto).map(async (photo) => {
      const objectPath = normalizePatientPhotoStoragePath(photo.storage_path);
      const { data, error } = await supabase.storage
        .from(PATIENT_PHOTOS_BUCKET)
        .createSignedUrl(objectPath, SIGNED_URL_EXPIRY_SECONDS);

      if (error) {
        console.warn(
          `[photoStorage] Failed to sign URL for photo ${photo.id} (${objectPath}):`,
          error.message,
        );
      } else if (data?.signedUrl) {
        signedUrls[photo.id] = data.signedUrl;
      }
    }),
  );

  return signedUrls;
}
