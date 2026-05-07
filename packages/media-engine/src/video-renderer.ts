/**
 * Video Renderer
 * Renders timeline to video file using FFmpeg.wasm
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { Timeline, Clip, Effect, Transition } from '@omnicut/core';
import { ffmpegManager } from './ffmpeg-manager';

export interface RenderOptions {
  format: 'mp4' | 'webm' | 'mov';
  codec: 'h264' | 'h265' | 'vp9' | 'av1';
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  audioBitrate: number;
  videoBitrate?: number;
  onProgress?: (progress: number) => void;
}

export interface RenderResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  duration?: number;
}

/**
 * Render timeline to video
 */
export async function renderTimeline(
  timeline: Timeline,
  options: RenderOptions
): Promise<RenderResult> {
  const startTime = Date.now();

  try {
    // Get FFmpeg instance
    const ffmpeg = await ffmpegManager.getFFmpeg();

    // Set up progress tracking
    if (options.onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        options.onProgress!(progress);
      });
    }

    // Prepare input files
    await prepareInputFiles(ffmpeg, timeline);

    // Build FFmpeg command
    const command = buildFFmpegCommand(timeline, options);

    // Execute FFmpeg
    await ffmpeg.exec(command);

    // Get output file
    const outputFileName = `output.${options.format}`;
    const data = await ffmpeg.readFile(outputFileName);

    // Create blob
    const blob = new Blob([data], {
      type: getMimeType(options.format),
    });

    // Clean up
    await cleanupFiles(ffmpeg, timeline);

    const duration = Date.now() - startTime;

    return {
      success: true,
      blob,
      duration,
    };
  } catch (error) {
    console.error('[Renderer] Failed to render:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Prepare input files for FFmpeg
 */
async function prepareInputFiles(ffmpeg: FFmpeg, timeline: Timeline): Promise<void> {
  const processedUrls = new Set<string>();

  for (const track of timeline.tracks) {
    for (const clip of track.clips) {
      const url = clip.mediaUrl || clip.source;
      if (!url || processedUrls.has(url)) continue;

      try {
        // Fetch file data
        const data = await fetchFile(url);
        
        // Write to FFmpeg virtual filesystem
        const fileName = getFileNameFromUrl(url, clip.id);
        await ffmpeg.writeFile(fileName, data);
        
        processedUrls.add(url);
      } catch (error) {
        console.error(`[Renderer] Failed to load file: ${url}`, error);
      }
    }
  }
}

/**
 * Build FFmpeg command
 */
function buildFFmpegCommand(timeline: Timeline, options: RenderOptions): string[] {
  const command: string[] = [];

  // Get all clips sorted by start time
  const allClips = timeline.tracks
    .flatMap((track) => track.clips)
    .sort((a, b) => a.startTime - b.startTime);

  if (allClips.length === 0) {
    throw new Error('No clips to render');
  }

  // For simple case: concatenate all video clips
  // In a real implementation, this would handle:
  // - Multiple tracks
  // - Overlapping clips
  // - Effects
  // - Transitions
  // - Audio mixing

  // Add input files
  for (const clip of allClips) {
    const fileName = getFileNameFromUrl(clip.mediaUrl || clip.source, clip.id);
    command.push('-i', fileName);
  }

  // Set output options
  command.push(
    '-c:v', getVideoCodec(options.codec),
    '-preset', getPreset(options.quality),
    '-crf', getCRF(options.quality),
    '-s', `${options.resolution.width}x${options.resolution.height}`,
    '-r', options.frameRate.toString(),
    '-c:a', 'aac',
    '-b:a', `${options.audioBitrate}k`,
    '-movflags', '+faststart',
    `output.${options.format}`
  );

  return command;
}

/**
 * Get video codec for FFmpeg
 */
function getVideoCodec(codec: string): string {
  switch (codec) {
    case 'h264':
      return 'libx264';
    case 'h265':
      return 'libx265';
    case 'vp9':
      return 'libvpx-vp9';
    case 'av1':
      return 'libaom-av1';
    default:
      return 'libx264';
  }
}

/**
 * Get encoding preset
 */
function getPreset(quality: string): string {
  switch (quality) {
    case 'low':
      return 'ultrafast';
    case 'medium':
      return 'medium';
    case 'high':
      return 'slow';
    case 'ultra':
      return 'veryslow';
    default:
      return 'medium';
  }
}

/**
 * Get CRF (Constant Rate Factor) for quality
 */
function getCRF(quality: string): string {
  switch (quality) {
    case 'low':
      return '28';
    case 'medium':
      return '23';
    case 'high':
      return '18';
    case 'ultra':
      return '15';
    default:
      return '23';
  }
}

/**
 * Get MIME type for format
 */
function getMimeType(format: string): string {
  switch (format) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'video/mp4';
  }
}

/**
 * Get file name from URL
 */
function getFileNameFromUrl(url: string, clipId: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    return fileName || `clip_${clipId}.mp4`;
  } catch {
    // If URL parsing fails, use clip ID
    return `clip_${clipId}.mp4`;
  }
}

/**
 * Clean up temporary files
 */
async function cleanupFiles(ffmpeg: FFmpeg, timeline: Timeline): Promise<void> {
  try {
    const processedUrls = new Set<string>();

    for (const track of timeline.tracks) {
      for (const clip of track.clips) {
        const url = clip.mediaUrl || clip.source;
        if (!url || processedUrls.has(url)) continue;

        const fileName = getFileNameFromUrl(url, clip.id);
        try {
          await ffmpeg.deleteFile(fileName);
        } catch {
          // Ignore errors
        }

        processedUrls.add(url);
      }
    }

    // Delete output file
    try {
      await ffmpeg.deleteFile('output.mp4');
      await ffmpeg.deleteFile('output.webm');
      await ffmpeg.deleteFile('output.mov');
    } catch {
      // Ignore errors
    }
  } catch (error) {
    console.error('[Renderer] Cleanup failed:', error);
  }
}

/**
 * Estimate output file size
 */
export function estimateFileSize(
  timeline: Timeline,
  options: RenderOptions
): number {
  const duration = timeline.duration;
  const videoBitrate = options.videoBitrate || getDefaultVideoBitrate(options.quality);
  const audioBitrate = options.audioBitrate;

  // Size in bytes = (video bitrate + audio bitrate) * duration / 8
  const sizeInBytes = ((videoBitrate + audioBitrate) * duration) / 8;

  return Math.round(sizeInBytes);
}

/**
 * Get default video bitrate based on quality
 */
function getDefaultVideoBitrate(quality: string): number {
  switch (quality) {
    case 'low':
      return 1000; // 1 Mbps
    case 'medium':
      return 2500; // 2.5 Mbps
    case 'high':
      return 5000; // 5 Mbps
    case 'ultra':
      return 10000; // 10 Mbps
    default:
      return 2500;
  }
}
