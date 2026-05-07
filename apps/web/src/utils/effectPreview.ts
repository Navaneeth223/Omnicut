/**
 * Effect Preview Renderer
 * Applies effects to video frames in real-time for preview using WebGL
 */

import type { Effect } from '@omnicut/core';
import { EffectRenderer } from '../lib/effects/effect-renderer';
import { getEffectByType } from '../components/Effects/effectDefinitions';

/**
 * Create an effect preview renderer
 */
export function createEffectPreviewRenderer() {
  let animationFrameId: number | null = null;
  let isRendering = false;
  let effectRenderer: EffectRenderer | null = null;

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

      // Initialize WebGL renderer if not already created
      if (!effectRenderer) {
        try {
          effectRenderer = new EffectRenderer(canvas);
        } catch (error) {
          console.error('[EffectPreview] Failed to initialize WebGL:', error);
          // Fallback to 2D canvas rendering
          this.startFallback(video, canvas, effects);
          return;
        }
      }

      const render = () => {
        if (!isRendering) return;

        // Check if video is ready
        if (video.readyState >= 2 && effectRenderer) {
          // Set canvas size to match video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            const width = video.videoWidth || 1920;
            const height = video.videoHeight || 1080;
            effectRenderer.resize(width, height);
          }

          // Apply effects
          if (effects.length > 0) {
            try {
              // Apply each effect in sequence
              let source: HTMLVideoElement | HTMLCanvasElement = video;
              
              for (const effect of effects) {
                if (!effect.enabled) continue;

                const effectDef = getEffectByType(effect.type);
                if (!effectDef?.implemented) continue;

                // Convert effect parameters to renderer format
                const parameters: Record<string, number> = {};
                for (const [key, value] of Object.entries(effect.parameters || {})) {
                  if (typeof value === 'number') {
                    parameters[key] = value;
                  }
                }

                // Render effect
                effectRenderer.render(source, effect.type, parameters);
                
                // For multiple effects, use canvas as source for next effect
                source = canvas;
              }
            } catch (error) {
              console.error('[EffectPreview] Failed to apply effects:', error);
            }
          } else {
            // No effects, just render video
            try {
              effectRenderer.render(video, 'passthrough', {});
            } catch (error) {
              console.error('[EffectPreview] Failed to render video:', error);
            }
          }
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    },

    /**
     * Fallback to 2D canvas rendering (no effects)
     */
    startFallback(
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement,
      effects: Effect[]
    ): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = () => {
        if (!isRendering) return;

        if (video.readyState >= 2) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;
          }

          // Just draw video without effects
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
     * Dispose resources
     */
    dispose(): void {
      this.stop();
      if (effectRenderer) {
        effectRenderer.dispose();
        effectRenderer = null;
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
