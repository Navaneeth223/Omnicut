/**
 * Validation utilities
 * @module utils/validation
 */

import type { FrameRate, SampleRate, BitDepth } from '../types/project';

/**
 * Validate frame rate
 * @param frameRate - Frame rate to validate
 * @returns Whether frame rate is valid
 */
export function isValidFrameRate(frameRate: number): frameRate is FrameRate {
  const validRates: FrameRate[] = [23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 120];
  return validRates.includes(frameRate as FrameRate);
}

/**
 * Validate sample rate
 * @param sampleRate - Sample rate to validate
 * @returns Whether sample rate is valid
 */
export function isValidSampleRate(sampleRate: number): sampleRate is SampleRate {
  const validRates: SampleRate[] = [44100, 48000, 96000, 192000];
  return validRates.includes(sampleRate as SampleRate);
}

/**
 * Validate bit depth
 * @param bitDepth - Bit depth to validate
 * @returns Whether bit depth is valid
 */
export function isValidBitDepth(bitDepth: number): bitDepth is BitDepth {
  const validDepths: BitDepth[] = [16, 24, 32];
  return validDepths.includes(bitDepth as BitDepth);
}

/**
 * Validate resolution
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @returns Whether resolution is valid
 */
export function isValidResolution(width: number, height: number): boolean {
  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width > 0 &&
    height > 0 &&
    width <= 16384 &&
    height <= 16384
  );
}

/**
 * Validate time value
 * @param time - Time in seconds
 * @returns Whether time is valid
 */
export function isValidTime(time: number): boolean {
  return Number.isFinite(time) && time >= 0;
}

/**
 * Validate color hex string
 * @param color - Color hex string
 * @returns Whether color is valid
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Validate file path
 * @param path - File path
 * @returns Whether path is valid
 */
export function isValidFilePath(path: string): boolean {
  return path.length > 0 && path.length <= 4096;
}

/**
 * Clamp number to range
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalize value to 0-1 range
 * @param value - Value to normalize
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Normalized value
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Denormalize value from 0-1 range
 * @param value - Normalized value (0-1)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Denormalized value
 */
export function denormalize(value: number, min: number, max: number): number {
  return min + value * (max - min);
}
