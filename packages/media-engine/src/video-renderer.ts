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
    // For now, create a simple video from the first clip
    // This is a temporary solution until FFmpeg is properly configured
    
    // Report progress
    if (options.onProgress) {
      options.onProgress(0.1);
    }

    // Get all video clips
    const videoClips = timeline.tracks
      .flatMap((track) => track.clips)
      .filter((clip) => clip.type === 'video' || clip.type === 'image')
      .sort((a, b) => a.startTime - b.startTime);

    if (videoClips.length === 0) {
      throw new Error('No video clips to export');
    }

    if (options.onProgress) {
      options.onProgress(0.3);
    }

    // For images, create a canvas-based video
    if (videoClips[0].type === 'image') {
      const blob = await createVideoFromImages(videoClips, timeline, options);
      
      if (options.onProgress) {
        options.onProgress(1.0);
      }

      return {
        success: true,
        blob,
        duration: Date.now() - startTime,
      };
    }

    // For video clips, try to use the first video
    const firstClip = videoClips[0];
    const url = firstClip.mediaUrl || firstClip.source;

    if (options.onProgress) {
      options.onProgress(0.5);
    }

    // Fetch the video
    const response = await fetch(url);
    const blob = await response.blob();

    if (options.onProgress) {
      options.onProgress(1.0);
    }

    return {
      success: true,
      blob,
      duration: Date.now() - startTime,
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
 * Create video from images using canvas and MediaRecorder with audio
 */
async function createVideoFromImages(
  clips: Clip[],
  timeline: Timeline,
  options: RenderOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = options.resolution.width;
      canvas.height = options.resolution.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Create audio context for mixing audio tracks
      const audioContext = new AudioContext({ sampleRate: 48000 });
      const audioDestination = audioContext.createMediaStreamDestination();

      // Setup MediaRecorder with both video and audio
      const videoStream = canvas.captureStream(options.frameRate);
      
      // Combine video and audio streams
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);

      // Determine MIME type based on format
      let mimeType = 'video/webm;codecs=vp8,opus';
      if (options.format === 'webm') {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: options.videoBitrate || getDefaultVideoBitrate(options.quality) * 1000,
        audioBitsPerSecond: options.audioBitrate * 1000,
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        audioContext.close();
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        audioContext.close();
        reject(new Error('MediaRecorder error'));
      };

      // Load and play audio tracks
      const audioClips = timeline.tracks
        .flatMap(track => track.clips)
        .filter(clip => clip.type === 'audio' || clip.type === 'video');

      const audioPromises = audioClips.map(async (clip) => {
        try {
          const response = await fetch(clip.mediaUrl || clip.source);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 1.0;
          
          source.connect(gainNode);
          gainNode.connect(audioDestination);
          
          // Schedule audio to play at correct time
          source.start(audioContext.currentTime + clip.startTime);
          
          return source;
        } catch (error) {
          console.error('Failed to load audio:', error);
          return null;
        }
      });

      // Wait for audio to load
      Promise.all(audioPromises).then(() => {
        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms

        // Render frames
        let currentTime = 0;
        const frameDuration = 1 / options.frameRate;
        const totalDuration = timeline.duration;
        let frameCount = 0;
        const totalFrames = Math.ceil(totalDuration * options.frameRate);

        const renderFrame = async () => {
          if (currentTime >= totalDuration) {
            // Finished rendering
            mediaRecorder.stop();
            if (options.onProgress) {
              options.onProgress(1.0);
            }
            return;
          }

          // Find clip at current time
          let currentClip: Clip | null = null;
          for (const clip of clips) {
            if (currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration) {
              currentClip = clip;
              break;
            }
          }

          // Clear canvas
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw current clip
          if (currentClip) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              await new Promise<void>((resolveImg, rejectImg) => {
                img.onload = () => resolveImg();
                img.onerror = () => rejectImg(new Error('Failed to load image'));
                img.src = currentClip!.mediaUrl || currentClip!.source;
              });

              // Calculate scaling to fit
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;

              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            } catch (error) {
              console.error('Failed to draw image:', error);
            }
          }

          // Update progress
          frameCount++;
          if (options.onProgress && frameCount % 10 === 0) {
            options.onProgress(0.3 + (frameCount / totalFrames) * 0.7);
          }

          // Next frame
          currentTime += frameDuration;
          
          // Use setTimeout to allow browser to process
          setTimeout(renderFrame, frameDuration * 1000);
        };

        // Start rendering
        renderFrame();
      });
      
    } catch (error) {
      reject(error);
    }
  });
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
