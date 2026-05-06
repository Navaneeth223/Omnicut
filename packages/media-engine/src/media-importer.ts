/**
 * Media import functionality
 * @module media-engine/media-importer
 */

import type { MediaItem, MediaMetadata } from '@omnicut/core';
import { generateId } from '@omnicut/core';
import { ffmpegManager } from './ffmpeg-manager';
import { extractMetadata } from './metadata-extractor';
import { generateThumbnail } from './thumbnail-generator';
import { generateWaveform } from './waveform-generator';

/**
 * Import options
 */
export interface ImportOptions {
  /** Generate thumbnail */
  generateThumbnail?: boolean;
  /** Generate waveform (for audio/video) */
  generateWaveform?: boolean;
  /** Generate proxy */
  generateProxy?: boolean;
  /** Proxy resolution */
  proxyResolution?: 'quarter' | 'half';
}

/**
 * Import result
 */
export interface ImportResult {
  /** Imported media item */
  item: MediaItem;
  /** Any errors that occurred */
  errors: string[];
}

/**
 * Media importer class
 */
export class MediaImporter {
  /**
   * Import a single file
   */
  async importFile(file: File, options: ImportOptions = {}): Promise<ImportResult> {
    const errors: string[] = [];

    try {
      // Ensure FFmpeg is loaded
      await ffmpegManager.getFFmpeg();

      // Determine media type
      const type = this.getMediaType(file.type);

      // Extract metadata
      let metadata: MediaMetadata = {};
      let duration: number | undefined;
      let width: number | undefined;
      let height: number | undefined;
      let frameRate: number | undefined;
      let sampleRate: number | undefined;
      let channels: number | undefined;
      let codec: string | undefined;
      let bitrate: number | undefined;

      try {
        const extractedMetadata = await extractMetadata(file);
        metadata = extractedMetadata.metadata;
        duration = extractedMetadata.duration;
        width = extractedMetadata.width;
        height = extractedMetadata.height;
        frameRate = extractedMetadata.frameRate;
        sampleRate = extractedMetadata.sampleRate;
        channels = extractedMetadata.channels;
        codec = extractedMetadata.codec;
        bitrate = extractedMetadata.bitrate;
      } catch (error) {
        errors.push(`Failed to extract metadata: ${error}`);
      }

      // Generate thumbnail
      let thumbnail: string | undefined;
      if (options.generateThumbnail !== false && (type === 'video' || type === 'image')) {
        try {
          thumbnail = await generateThumbnail(file);
        } catch (error) {
          errors.push(`Failed to generate thumbnail: ${error}`);
        }
      }

      // Generate waveform
      let waveform;
      if (options.generateWaveform !== false && (type === 'audio' || type === 'video')) {
        try {
          waveform = await generateWaveform(file);
        } catch (error) {
          errors.push(`Failed to generate waveform: ${error}`);
        }
      }

      // Create media item
      const item: MediaItem = {
        id: generateId(),
        name: file.name,
        path: URL.createObjectURL(file),
        type,
        mimeType: file.type,
        size: file.size,
        duration,
        width,
        height,
        frameRate,
        sampleRate,
        channels,
        codec,
        bitrate,
        thumbnail,
        waveform,
        metadata,
        tags: [],
        rating: 0,
        usageCount: 0,
        importedAt: new Date(),
      };

      return { item, errors };
    } catch (error) {
      errors.push(`Failed to import file: ${error}`);
      throw new Error(`Import failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Import multiple files
   */
  async importFiles(
    files: File[],
    options: ImportOptions = {},
    onProgress?: (current: number, total: number) => void
  ): Promise<ImportResult[]> {
    const results: ImportResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      
      try {
        const result = await this.importFile(file, options);
        results.push(result);
      } catch (error) {
        results.push({
          item: null as any,
          errors: [`Failed to import ${file.name}: ${error}`],
        });
      }

      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    }

    return results;
  }

  /**
   * Determine media type from MIME type
   */
  private getMediaType(mimeType: string): MediaItem['type'] {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    return 'video'; // Default fallback
  }
}

/**
 * Create a media importer instance
 */
export function createMediaImporter(): MediaImporter {
  return new MediaImporter();
}
