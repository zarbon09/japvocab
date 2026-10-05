// Client-side persistent image storage using IndexedDB
// Ensures custom Google Flow artwork never disappears even if the cloud server restarts!

const DB_NAME = 'jlpt_vocab_images_db';
const DB_VERSION = 1;
const STORE_NAME = 'vocab_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImageToStorage(id: number, base64: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ id, data: base64, updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err);
  }
}

export async function getImageFromStorage(id: number): Promise<string | null> {
  try {
    const db = await openDB();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return null;
  }
}

export async function getAllStoredImageIds(): Promise<number[]> {
  try {
    const db = await openDB();
    return await new Promise<number[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = () => {
        resolve((request.result as number[]) || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return [];
  }
}

export async function getAllStoredImages(): Promise<Array<{ id: number; data: string }>> {
  try {
    const db = await openDB();
    return await new Promise<Array<{ id: number; data: string }>>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        resolve((request.result as Array<{ id: number; data: string }>) || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return [];
  }
}

export async function syncImagesWithServer(): Promise<void> {
  try {
    const res = await fetch('/api/vocab-images');
    if (!res.ok) return;
    const serverFiles: string[] = await res.json();
    const serverIds = new Set(
      serverFiles
        .map(f => parseInt(f.replace(/\.\w+$/, ''), 10))
        .filter(n => !isNaN(n))
    );

    // 1. Upload any local IndexedDB images that the server is missing
    const localImages = await getAllStoredImages();
    for (const item of localImages) {
      if (!serverIds.has(item.id)) {
        try {
          await fetch('/api/upload-vocab-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, base64: item.data })
          });
        } catch {
          // ignore network failure
        }
      }
    }
  } catch {
    // ignore
  }
}
