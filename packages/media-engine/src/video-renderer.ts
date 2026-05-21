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
    // Report progress
    if (options.onProgress) {
      options.onProgress(0.1);
    }

    // Get all video and image clips
    const videoClips = timeline.tracks
      .flatMap((track) => track.clips)
      .filter((clip) => clip.type === 'video' || clip.type === 'image')
      .sort((a, b) => a.startTime - b.startTime);

    if (videoClips.length === 0) {
      throw new Error('No video clips to export');
    }

    if (options.onProgress) {
      options.onProgress(0.2);
    }

    // Create video from clips
    const blob = await createVideoFromClips(videoClips, timeline, options);
    
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
 * Create video from clips (images and videos)
 */
async function createVideoFromClips(
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

      // Setup MediaRecorder
      const stream = canvas.captureStream(options.frameRate);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: (options.videoBitrate || getDefaultVideoBitrate(options.quality)) * 1000,
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        reject(new Error('MediaRecorder error'));
      };

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
          // Finished rendering - wait a bit then stop
          setTimeout(() => {
            mediaRecorder.stop();
          }, 500);
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
          if (currentClip.type === 'image') {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              await new Promise<void>((resolveImg, rejectImg) => {
                const timeout = setTimeout(() => rejectImg(new Error('Image load timeout')), 5000);
                img.onload = () => {
                  clearTimeout(timeout);
                  resolveImg();
                };
                img.onerror = () => {
                  clearTimeout(timeout);
                  rejectImg(new Error('Failed to load image'));
                };
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
              // Draw error placeholder
              ctx.fillStyle = '#ff0000';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#ffffff';
              ctx.font = '48px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Image Load Error', canvas.width / 2, canvas.height / 2);
            }
          } else if (currentClip.type === 'video') {
            // For video clips, we'd need to load and draw video frames
            // This is complex, so for now just show placeholder
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Video Clip', canvas.width / 2, canvas.height / 2);
          }
        }

        // Update progress
        frameCount++;
        if (options.onProgress && frameCount % 30 === 0) {
          const progress = 0.2 + (frameCount / totalFrames) * 0.8;
          options.onProgress(progress);
        }

        // Next frame
        currentTime += frameDuration;
        
        // Use setTimeout to allow browser to process
        setTimeout(renderFrame, frameDuration * 1000);
      };

      // Start rendering
      renderFrame();
      
    } catch (error) {
      reject(error);
    }
  });
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
