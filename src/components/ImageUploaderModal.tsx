import React, { useState, useMemo, useEffect } from 'react';
import { VOCAB_BANK, VocabularyWord } from '../data';
import { saveImageToStorage, getAllStoredImageIds } from '../utils/imageStorage';

interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PendingUpload {
  file: File;
  id: number;
  word?: VocabularyWord;
  previewUrl?: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMessage?: string;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadSaved = async () => {
      const storedIds = await getAllStoredImageIds();
      try {
        const res = await fetch('/api/vocab-images');
        if (res.ok) {
          const files: string[] = await res.json();
          const serverIds = files
            .map(f => parseInt(f.replace(/\.\w+$/, ''), 10))
            .filter(n => !isNaN(n));
          const merged = Array.from(new Set([...storedIds, ...serverIds])).sort((a, b) => a - b);
          setSavedIds(merged);
          return;
        }
      } catch (e) {
        // ignore
      }
      setSavedIds(storedIds.sort((a, b) => a - b));
    };

    loadSaved();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newUploads: PendingUpload[] = [];
    const count = files.length;

    Array.from(files).forEach((file, index) => {
      // Try to parse ID from filename (e.g., "1_cha.jpg", "2_osoi.jpg", "5._te.jpg", "10_otoko.jpg", "824_xxx.jpg")
      const match = file.name.match(/^(\d+)/);
      let detectedId = match ? parseInt(match[1], 10) : 1;
      
      const matchedWord = VOCAB_BANK.find(w => w.id === detectedId);

      // Only generate preview URL for the first 40 files to keep browser memory lightweight for 800+ files
      const previewUrl = index < 40 ? URL.createObjectURL(file) : undefined;

      newUploads.push({
        file,
        id: detectedId,
        word: matchedWord,
        previewUrl,
        status: 'pending'
      });
    });

    setUploads(prev => [...prev, ...newUploads]);
    setCompletedCount(0);
    setErrorCount(0);
  };

  const handleIdChange = (index: number, newId: number) => {
    setUploads(prev => {
      const copy = [...prev];
      copy[index].id = newId;
      copy[index].word = VOCAB_BANK.find(w => w.id === newId);
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // High-performance concurrent upload worker pool (4 parallel uploads)
  const handleUploadAll = async () => {
    if (uploads.length === 0) return;
    setIsSaving(true);
    setCompletedCount(0);
    setErrorCount(0);

    const CONCURRENCY = 4;
    let nextIndex = 0;
    let done = 0;
    let errors = 0;

    const worker = async () => {
      while (nextIndex < uploads.length) {
        const currentIndex = nextIndex++;
        const item = uploads[currentIndex];

        setUploads(prev => {
          const c = [...prev];
          if (c[currentIndex]) c[currentIndex].status = 'uploading';
          return c;
        });

        try {
          const base64 = await fileToBase64(item.file);
          // 1. Save to client-side IndexedDB for permanent persistence across sessions
          await saveImageToStorage(item.id, base64);

          // 2. Also save to server disk
          try {
            await fetch('/api/upload-vocab-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: item.id,
                base64
              })
            });
          } catch (netErr) {
            console.warn('Server sync warning (stored in IndexedDB):', netErr);
          }

          done++;
          setCompletedCount(done);
          setUploads(prev => {
            const c = [...prev];
            if (c[currentIndex]) c[currentIndex].status = 'done';
            return c;
          });
        } catch (err: any) {
          errors++;
          setErrorCount(errors);
          setUploads(prev => {
            const c = [...prev];
            if (c[currentIndex]) {
              c[currentIndex].status = 'error';
              c[currentIndex].errorMessage = err.message || 'Failed';
            }
            return c;
          });
        }
      }
    };

    const workers = Array.from({ length: Math.min(CONCURRENCY, uploads.length) }, () => worker());
    await Promise.all(workers);

    setIsSaving(false);
    setSavedIds(prev => Array.from(new Set([...prev, ...uploads.filter(u => u.status === 'done').map(u => u.id)])).sort((a, b) => a - b));
    if (onSuccess) onSuccess();
  };

  const progressPercent = uploads.length > 0 
    ? Math.round(((completedCount + errorCount) / uploads.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-surface-variant/20 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-surface-variant/20 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">photo_library</span>
            </div>
            <div>
              <h2 className="font-title-lg font-bold text-on-surface">Upload Flashcard Images</h2>
              <p className="text-on-surface-variant font-body-sm text-xs">
                Supports bulk uploads (up to all 824 vocabulary images at once!)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface-variant/20 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Saved Status Banner */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-container border border-surface-variant/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
              <span className="text-on-surface font-medium">
                Active in Library: <strong className="text-primary font-bold">{savedIds.length}</strong> / 824 custom images
              </span>
            </div>
            {savedIds.length > 0 && (
              <span className="text-on-surface-variant text-[11px]">
                Cards: {savedIds.length <= 12 ? savedIds.join(', ') : `${savedIds.slice(0, 10).join(', ')}... (+${savedIds.length - 10} more)`}
              </span>
            )}
          </div>

          {/* Dropzone */}
          <label className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all text-center group">
            <span className="material-symbols-outlined text-primary text-[42px] mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
            <span className="font-title-sm font-semibold text-on-surface">
              Click to select all files or drag & drop them here
            </span>
            <span className="font-body-sm text-on-surface-variant text-xs mt-1">
              Select 10, 100, or all 824 images. Names like <code className="bg-surface-container px-1 py-0.5 rounded font-mono">1_cha.jpg</code>, <code className="bg-surface-container px-1 py-0.5 rounded font-mono">10_otoko.jpg</code> auto-link to IDs!
            </span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={e => handleFiles(e.target.files)}
            />
          </label>

          {/* Progress Bar during saving */}
          {isSaving && (
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-primary/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Uploading images...
                </span>
                <span className="text-on-surface">
                  {completedCount} of {uploads.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-200 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploads Summary and List */}
          {uploads.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant px-1">
                <span>
                  Ready to import: <strong className="text-on-surface">{uploads.length} images</strong>
                  {completedCount > 0 && <span className="text-green-600 ml-2">({completedCount} saved)</span>}
                  {errorCount > 0 && <span className="text-error ml-2">({errorCount} failed)</span>}
                </span>
                {!isSaving && (
                  <button 
                    onClick={() => { setUploads([]); setCompletedCount(0); setErrorCount(0); }} 
                    className="text-error hover:underline"
                  >
                    Clear list
                  </button>
                )}
              </div>

              {/* Grid of items (capped display for smooth rendering of 800+ files) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                {uploads.slice(0, 50).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-surface-variant/20 bg-surface-container-lowest shadow-sm"
                  >
                    {item.previewUrl ? (
                      <img 
                        src={item.previewUrl} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-on-surface text-xs truncate">
                          {item.word ? `${item.word.kanji} (${item.word.english})` : `Word #${item.id}`}
                        </span>
                        {!isSaving && (
                          <button 
                            onClick={() => handleRemove(idx)}
                            className="text-on-surface-variant hover:text-error text-xs p-0.5"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-on-surface-variant">ID:</span>
                        <input 
                          type="number" 
                          min={1} 
                          max={VOCAB_BANK.length}
                          value={item.id}
                          disabled={isSaving}
                          onChange={e => handleIdChange(idx, parseInt(e.target.value) || 1)}
                          className="w-12 px-1 py-0.5 text-[11px] rounded border border-surface-variant/40 bg-surface text-center font-bold"
                        />
                        <span className="text-[10px] text-on-surface-variant truncate max-w-[80px]">
                          {item.file.name}
                        </span>
                      </div>

                      <div className="mt-0.5 text-[10px]">
                        {item.status === 'pending' && <span className="text-on-surface-variant">Ready</span>}
                        {item.status === 'uploading' && <span className="text-primary animate-pulse font-medium">Uploading...</span>}
                        {item.status === 'done' && <span className="text-green-600 font-semibold">✓ Saved</span>}
                        {item.status === 'error' && <span className="text-error font-semibold">{item.errorMessage || 'Failed'}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {uploads.length > 50 && (
                <div className="p-2 text-center text-xs text-on-surface-variant bg-surface-container rounded-xl font-medium">
                  + {uploads.length - 50} more images ready to save (all will be processed in parallel)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-variant/20 bg-surface-container-lowest flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Target: <code className="bg-surface-variant/30 px-1 py-0.5 rounded font-mono">/public/vocab-images/</code>
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-on-surface-variant hover:bg-surface-variant/20 transition-colors"
            >
              {completedCount === uploads.length && uploads.length > 0 ? 'Close' : 'Cancel'}
            </button>
            <button 
              onClick={handleUploadAll}
              disabled={uploads.length === 0 || isSaving}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-primary text-on-primary hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  Saving {completedCount}/{uploads.length}...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save {uploads.length > 0 ? `${uploads.length} Images` : 'Images'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
