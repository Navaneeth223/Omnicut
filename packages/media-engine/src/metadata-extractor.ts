/**
 * Metadata extraction from media files
 * @module media-engine/metadata-extractor
 */

import { ffmpegManager } from './ffmpeg-manager';
import type { MediaMetadata } from '@omnicut/core';

/**
 * Extracted metadata
 */
export interface ExtractedMetadata {
  /** Duration in seconds */
  duration?: number;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Frame rate */
  frameRate?: number;
  /** Sample rate in Hz */
  sampleRate?: number;
  /** Audio channels */
  channels?: number;
  /** Codec name */
  codec?: string;
  /** Bitrate in bps */
  bitrate?: number;
  /** Color space */
  colorSpace?: string;
  /** Has alpha channel */
  hasAlpha?: boolean;
  /** Additional metadata */
  metadata: MediaMetadata;
}

/**
 * Extract metadata from a media file using FFmpeg
 */
export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  const ffmpeg = await ffmpegManager.getFFmpeg();

  try {
    // Write file to FFmpeg virtual filesystem
    const inputName = 'input' + getFileExtension(file.name);
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Run ffprobe to get metadata
    // Note: FFmpeg.wasm doesn't have ffprobe, so we'll use ffmpeg with -i flag
    // This will output file info to stderr
    let metadata: ExtractedMetadata = {
      metadata: {},
    };

    // For now, return basic metadata
    // TODO: Parse FFmpeg output to extract detailed metadata
    metadata = {
      duration: await getVideoDuration(file),
      metadata: {},
    };

    // Clean up
    await ffmpeg.deleteFile(inputName);

    return metadata;
  } catch (error) {
    console.error('[Metadata Extractor] Error:', error);
    throw new Error('Failed to extract metadata');
  }
}

/**
 * Get video duration using HTML5 video element
 */
async function getVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(undefined);
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Convert File to Uint8Array
 */
async function fetchFile(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
}
