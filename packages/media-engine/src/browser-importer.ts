/**
 * Browser-based Media Importer
 * Uses browser APIs to import and process media files
 */

import type { MediaItem } from '@omnicut/core';
import { generateId } from '@omnicut/core';

export interface ImportResult {
  item: MediaItem | null;
  errors: string[];
}

export interface ImportOptions {
  generateThumbnail?: boolean;
  generateWaveform?: boolean;
}

export type ProgressCallback = (current: number, total: number) => void;

/**
 * Create a media importer
 */
export function createMediaImporter() {
  return {
    /**
     * Import files
     */
    async importFiles(
      files: File[],
      options: ImportOptions = {},
      onProgress?: ProgressCallback
    ): Promise<ImportResult[]> {
      const results: ImportResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        onProgress?.(i + 1, files.length);

        try {
          const item = await importFile(file, options);
          results.push({ item, errors: [] });
        } catch (error) {
          results.push({
            item: null,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          });
        }
      }

      return results;
    },
  };
}

/**
 * Import a single file
 */
async function importFile(
  file: File,
  options: ImportOptions
): Promise<MediaItem> {
  const type = getMediaType(file.type);
  const url = URL.createObjectURL(file);

  // Get duration and dimensions
  const metadata = await extractMetadata(file, url, type);

  // Generate thumbnail if requested
  let thumbnailUrl: string | undefined;
  if (options.generateThumbnail && (type === 'video' || type === 'image')) {
    thumbnailUrl = await generateThumbnail(url, type);
  }

  // Generate waveform if requested
  let waveformData: number[] | undefined;
  if (options.generateWaveform && type === 'audio') {
    waveformData = await generateWaveform(url);
  }

  const item: MediaItem = {
    id: generateId(),
    name: file.name,
    path: url,
    url,
    type,
    mimeType: file.type || 'unknown',
    size: file.size,
    duration: metadata.duration,
    width: metadata.width,
    height: metadata.height,
    frameRate: metadata.frameRate,
    sampleRate: metadata.sampleRate,
    channels: metadata.channels,
    codec: 'unknown',
    bitrate: 0,
    thumbnail: thumbnailUrl,
    waveform: waveformData ? {
      peaks: waveformData,
      rms: waveformData.map(v => v * 0.7),
      samplesPerPoint: 1024,
      totalSamples: waveformData.length * 1024,
    } : undefined,
    metadata: {},
    tags: [],
    rating: 0,
    usageCount: 0,
    importedAt: new Date(file.lastModified),
  };

  return item;
}

/**
 * Get media type from MIME type
 */
function getMediaType(mimeType: string): 'video' | 'audio' | 'image' {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  return 'video'; // default
}

/**
 * Extract metadata from media file
 */
async function extractMetadata(
  file: File,
  url: string,
  type: 'video' | 'audio' | 'image'
): Promise<{
  duration?: number;
  width?: number;
  height?: number;
  frameRate?: number;
  channels?: number;
  sampleRate?: number;
}> {
  if (type === 'video') {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          frameRate: 30, // Default, can't easily detect from browser
        });
        video.remove();
      };

      video.onerror = () => {
        resolve({ duration: 0, width: 1920, height: 1080, frameRate: 30 });
        video.remove();
      };

      video.src = url;
    });
  }

  if (type === 'audio') {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        resolve({
          duration: audio.duration,
          channels: 2, // Default
          sampleRate: 48000, // Default
        });
        audio.remove();
      };

      audio.onerror = () => {
        resolve({ duration: 0, channels: 2, sampleRate: 48000 });
        audio.remove();
      };

      audio.src = url;
    });
  }

  if (type === 'image') {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          duration: 5, // Default duration for images
        });
      };

      img.onerror = () => {
        resolve({ width: 1920, height: 1080, duration: 5 });
      };

      img.src = url;
    });
  }

  return {};
}

/**
 * Generate thumbnail from video or image
 */
async function generateThumbnail(
  url: string,
  type: 'video' | 'image'
): Promise<string> {
  if (type === 'image') {
    return url; // Use the image itself as thumbnail
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous';

    video.onloadeddata = () => {
      // Seek to 1 second or 10% of duration
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = (320 * video.videoHeight) / video.videoWidth;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnailUrl);
        } else {
          reject(new Error('Could not get canvas context'));
        }
        video.remove();
      } catch (error) {
        reject(error);
        video.remove();
      }
    };

    video.onerror = () => {
      reject(new Error('Could not load video'));
      video.remove();
    };

    video.src = url;
  });
}

/**
 * Generate waveform data from audio
 */
async function generateWaveform(url: string): Promise<number[]> {
  // Simplified waveform generation
  // In a real implementation, this would use Web Audio API
  const samples = 100;
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    // Generate fake waveform data for now
    waveform.push(Math.random() * 0.8 + 0.2);
  }

  return waveform;
}
