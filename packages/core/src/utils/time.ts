/**
 * Time and timecode utilities
 * @module utils/time
 */

/**
 * Format seconds as HH:MM:SS
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds as timecode (HH:MM:SS:FF)
 * @param seconds - Time in seconds
 * @param frameRate - Frame rate
 * @returns Timecode string
 */
export function formatTimecode(seconds: number, frameRate: number): string {
  const totalFrames = Math.floor(seconds * frameRate);
  const frames = totalFrames % frameRate;
  const totalSeconds = Math.floor(totalFrames / frameRate);
  const secs = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const mins = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
}

/**
 * Parse timecode string to seconds
 * @param timecode - Timecode string (HH:MM:SS:FF)
 * @param frameRate - Frame rate
 * @returns Time in seconds
 */
export function parseTimecode(timecode: string, frameRate: number): number {
  const parts = timecode.split(':').map(Number);

  if (parts.length !== 4) {
    throw new Error('Invalid timecode format. Expected HH:MM:SS:FF');
  }

  const [hours = 0, minutes = 0, seconds = 0, frames = 0] = parts;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const frameSeconds = frames / frameRate;

  return totalSeconds + frameSeconds;
}

/**
 * Snap time to nearest frame
 * @param time - Time in seconds
 * @param frameRate - Frame rate
 * @returns Snapped time
 */
export function snapToFrame(time: number, frameRate: number): number {
  const frame = Math.round(time * frameRate);
  return frame / frameRate;
}

/**
 * Get frame number from time
 * @param time - Time in seconds
 * @param frameRate - Frame rate
 * @returns Frame number
 */
export function timeToFrame(time: number, frameRate: number): number {
  return Math.floor(time * frameRate);
}

/**
 * Get time from frame number
 * @param frame - Frame number
 * @param frameRate - Frame rate
 * @returns Time in seconds
 */
export function frameToTime(frame: number, frameRate: number): number {
  return frame / frameRate;
}

/**
 * Clamp time to range
 * @param time - Time to clamp
 * @param min - Minimum time
 * @param max - Maximum time
 * @returns Clamped time
 */
export function clampTime(time: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, time));
}
