/**
 * Effect Preview Renderer
 * Applies effects to video frames in real-time for preview
 */

import type { Effect } from '@omnicut/core';
import { applyEffectsToFrame } from '@omnicut/media-engine';

/**
 * Create an effect preview renderer
 */
export function createEffectPreviewRenderer() {
  let animationFrameId: number | null = null;
  let isRendering = false;

  return {
    /**
     * Start rendering effects to canvas
     */
    start(
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement,
      effects: Effect[]
    ): void {
      if (isRendering) return;

      isRendering = true;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = () => {
        if (!isRendering) return;

        // Check if video is ready
        if (video.readyState >= 2) {
          // Set canvas size to match video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;
          }

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Apply effects if any
          if (effects.length > 0) {
            try {
              applyEffectsToFrame(canvas, ctx, effects);
            } catch (error) {
              console.error('[EffectPreview] Failed to apply effects:', error);
            }
          }
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    },

    /**
     * Stop rendering
     */
    stop(): void {
      isRendering = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    /**
     * Check if rendering
     */
    isRendering(): boolean {
      return isRendering;
    },
  };
}
