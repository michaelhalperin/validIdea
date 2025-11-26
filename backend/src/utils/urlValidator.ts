import https from 'https';
import http from 'http';
import { URL } from 'url';

export async function validateUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Perform HEAD request to validate URL
    return new Promise((resolve) => {
      const protocol = url.protocol === 'https:' ? https : http;
      
      const req = protocol.request(
        {
          method: 'HEAD',
          hostname: url.hostname,
          path: url.pathname + url.search,
          timeout: 5000,
        },
        (res) => {
          resolve(res.statusCode! >= 200 && res.statusCode! < 400);
        }
      );

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  } catch {
    return false;
  }
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(urlObj.hostname);
  } catch {
    return false;
  }
}

export function isSlideUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return (
      hostname.includes('slideshare') ||
      hostname.includes('googleslides') ||
      hostname.includes('prezi') ||
      hostname.includes('canva.com/presentation')
    );
  } catch {
    return false;
  }
}

