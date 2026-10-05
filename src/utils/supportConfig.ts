// Support & Buy Me a Coffee Configuration

const BMAC_KEY = 'visual_japanese_bmac_url';
export const DEFAULT_BMAC_URL = 'https://buymeacoffee.com/amlensingha';
export const SUPPORT_EMAIL = 'amlensingha@gmail.com';

export function getBmacUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_BMAC_URL;
  return localStorage.getItem(BMAC_KEY) || DEFAULT_BMAC_URL;
}

export function setBmacUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim();
  if (cleanUrl) {
    localStorage.setItem(BMAC_KEY, cleanUrl);
  } else {
    localStorage.removeItem(BMAC_KEY);
  }
}
