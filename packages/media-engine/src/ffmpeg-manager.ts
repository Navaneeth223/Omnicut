/**
 * FFmpeg.wasm manager
 * @module media-engine/ffmpeg-manager
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

/**
 * FFmpeg manager singleton
 * Handles FFmpeg.wasm initialization and lifecycle
 */
class FFmpegManager {
  private ffmpeg: FFmpeg | null = null;
  private loading: Promise<void> | null = null;
  private loaded = false;

  /**
   * Get FFmpeg instance (lazy initialization)
   */
  async getFFmpeg(): Promise<FFmpeg> {
    if (this.ffmpeg && this.loaded) {
      return this.ffmpeg;
    }

    if (this.loading) {
      await this.loading;
      return this.ffmpeg!;
    }

    this.loading = this.initialize();
    await this.loading;
    return this.ffmpeg!;
  }

  /**
   * Initialize FFmpeg.wasm
   */
  private async initialize(): Promise<void> {
    try {
      this.ffmpeg = new FFmpeg();

      // Set up logging
      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
      });

      // Set up progress tracking
      this.ffmpeg.on('progress', ({ progress, time }) => {
        console.log('[FFmpeg Progress]', `${(progress * 100).toFixed(2)}%`, `Time: ${time}ms`);
      });

      // Load FFmpeg core
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      this.loaded = true;
      console.log('[FFmpeg] Loaded successfully');
    } catch (error) {
      console.error('[FFmpeg] Failed to load:', error);
      throw new Error('Failed to initialize FFmpeg');
    }
  }

  /**
   * Check if FFmpeg is loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Terminate FFmpeg instance
   */
  async terminate(): Promise<void> {
    if (this.ffmpeg && this.loaded) {
      await this.ffmpeg.terminate();
      this.ffmpeg = null;
      this.loaded = false;
      this.loading = null;
    }
  }
}

// Export singleton instance
export const ffmpegManager = new FFmpegManager();
