/**
 * Waveform generation for audio files
 * @module media-engine/waveform-generator
 */

import type { WaveformData } from '@omnicut/core';

/**
 * Generate waveform data from audio/video file
 */
export async function generateWaveform(
  file: File,
  options: {
    samplesPerPoint?: number;
    maxPoints?: number;
  } = {}
): Promise<WaveformData> {
  const { samplesPerPoint = 512, maxPoints = 1000 } = options;

  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get channel data (use first channel for mono, or mix for stereo)
    const channelData = audioBuffer.getChannelData(0);
    const totalSamples = channelData.length;

    // Calculate actual samples per point
    const actualSamplesPerPoint = Math.max(
      samplesPerPoint,
      Math.floor(totalSamples / maxPoints)
    );

    const numPoints = Math.floor(totalSamples / actualSamplesPerPoint);

    // Generate peaks and RMS values
    const peaks: number[] = [];
    const rms: number[] = [];

    for (let i = 0; i < numPoints; i++) {
      const start = i * actualSamplesPerPoint;
      const end = Math.min(start + actualSamplesPerPoint, totalSamples);

      let peak = 0;
      let sumSquares = 0;
      let count = 0;

      for (let j = start; j < end; j++) {
        const value = Math.abs(channelData[j]!);
        peak = Math.max(peak, value);
        sumSquares += value * value;
        count++;
      }

      peaks.push(peak);
      rms.push(Math.sqrt(sumSquares / count));
    }

    return {
      peaks,
      rms,
      samplesPerPoint: actualSamplesPerPoint,
      totalSamples,
    };
  } catch (error) {
    console.error('[Waveform Generator] Error:', error);
    throw new Error('Failed to generate waveform');
  } finally {
    await audioContext.close();
  }
}
