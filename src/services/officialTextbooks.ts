import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

const urlCache = new Map<string, string>();

/**
 * Path convention: curriculum/{grade}/{subjectId}/textbook.pdf
 */
export function getStoragePathForTextbook(grade: number | string, subjectId: string): string {
  const cleanSubj = subjectId.toLowerCase().trim();
  return `curriculum/${grade}/${cleanSubj}/textbook.pdf`;
}

/**
 * Fetches real PDF download URLs from Firebase Storage by convention:
 * curriculum/{grade}/{subjectId}/textbook.pdf
 */
export async function getOfficialTextbookUrl(
  grade: number | string,
  subjectId: string,
  fallbackUrl?: string
): Promise<string | null> {
  const path = getStoragePathForTextbook(grade, subjectId);

  if (urlCache.has(path)) {
    return urlCache.get(path)!;
  }

  try {
    const storageRef = ref(storage, path);
    const downloadUrl = await getDownloadURL(storageRef);
    urlCache.set(path, downloadUrl);
    return downloadUrl;
  } catch (error) {
    if (fallbackUrl) {
      urlCache.set(path, fallbackUrl);
      return fallbackUrl;
    }
    // Return null when storage object has not been uploaded yet
    return null;
  }
}
