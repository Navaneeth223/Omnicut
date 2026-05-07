/**
 * Timeline data structures
 * @module types/timeline
 */

import type { Effect } from './effects';
import type { KeyframeTrack } from './keyframes';
import type { ClipColorGrade } from './color';

/**
 * Timeline containing all tracks, clips, and markers
 */
export interface Timeline {
  /** Unique timeline identifier */
  id: string;
  /** Total duration in seconds */
  duration: number;
  /** Current playhead position in seconds */
  playhead: number;
  /** In point for preview range (optional) */
  inPoint?: number;
  /** Out point for preview range (optional) */
  outPoint?: number;
  /** All tracks in the timeline */
  tracks: Track[];
  /** Timeline markers */
  markers: Marker[];
  /** Current zoom level (1 = default) */
  zoomLevel: number;
  /** Horizontal scroll position in pixels */
  scrollPosition: number;
  /** Snapping configuration */
  snapping: SnappingConfig;
}

/**
 * Track types available in the timeline
 */
export type TrackType = 'video' | 'audio' | 'subtitle' | 'effect' | 'adjustment' | 'generator';

/**
 * A single track in the timeline
 */
export interface Track {
  /** Unique track identifier */
  id: string;
  /** Track type */
  type: TrackType;
  /** Track name */
  name: string;
  /** Track index (0 = bottom) */
  index: number;
  /** Whether track is locked (no editing) */
  locked: boolean;
  /** Whether track is muted */
  muted: boolean;
  /** Whether track is soloed */
  solo: boolean;
  /** Whether track is visible */
  visible: boolean;
  /** Track height in pixels */
  height: number;
  /** Track color (hex) */
  color: string;
  /** Clips on this track */
  clips: Clip[];
  /** Track-level effects */
  effects: Effect[];
  /** Volume (audio tracks only, 0-1) */
  volume?: number;
  /** Pan (audio tracks only, -1 to 1) */
  pan?: number;
  /** Blend mode (video tracks only) */
  blend?: BlendMode;
  /** Opacity (video tracks only, 0-1) */
  opacity?: number;
}

/**
 * Blend modes for video compositing
 */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
  | 'add'
  | 'subtract';

/**
 * A clip on the timeline
 */
export interface Clip {
  /** Unique clip identifier */
  id: string;
  /** Parent track ID */
  trackId: string;
  /** Reference to media pool item */
  mediaId: string;
  /** Media item ID (for backward compatibility) */
  mediaItemId?: string;
  /** Media URL (for direct access) */
  mediaUrl?: string;
  /** Source URL (for backward compatibility) */
  source?: string;
  /** Clip type (for quick access) */
  type?: 'video' | 'audio' | 'image';
  /** Clip name */
  name: string;
  /** Position on timeline in seconds */
  startTime: number;
  /** Duration on timeline in seconds */
  duration: number;
  /** In-point within source media in seconds */
  mediaStart: number;
  /** Out-point within source media in seconds */
  mediaEnd: number;
  /** Trim start (for trimming) */
  trimStart: number;
  /** Trim end (for trimming) */
  trimEnd: number;
  /** Playback speed (1.0 = normal, 2.0 = 2x, -1.0 = reverse) */
  speed: number;
  /** Clip-level effects */
  effects: Effect[];
  /** Keyframe tracks for animated properties */
  keyframes: KeyframeTrack[];
  /** Color grade applied to this clip */
  colorGrade?: ClipColorGrade;
  /** Audio levels for waveform display */
  audioLevels?: AudioLevel[];
  /** 2D transform properties */
  transform: Transform2D;
  /** Crop settings */
  crop: Crop;
  /** Stabilization configuration */
  stabilization?: StabilizationConfig;
  /** IDs of linked clips (for audio/video sync) */
  linked?: string[];
}

/**
 * 2D transform properties
 */
export interface Transform2D {
  /** X position in pixels */
  x: number;
  /** Y position in pixels */
  y: number;
  /** Scale X (1.0 = 100%) */
  scaleX: number;
  /** Scale Y (1.0 = 100%) */
  scaleY: number;
  /** Rotation in degrees */
  rotation: number;
  /** Anchor point X (0-1, relative to clip size) */
  anchorX: number;
  /** Anchor point Y (0-1, relative to clip size) */
  anchorY: number;
  /** Opacity (0-1) */
  opacity: number;
}

/**
 * Crop settings
 */
export interface Crop {
  /** Left crop in pixels */
  left: number;
  /** Right crop in pixels */
  right: number;
  /** Top crop in pixels */
  top: number;
  /** Bottom crop in pixels */
  bottom: number;
}

/**
 * Video stabilization configuration
 */
export interface StabilizationConfig {
  /** Whether stabilization is enabled */
  enabled: boolean;
  /** Smoothness level (0-1) */
  smoothness: number;
  /** Stabilization method */
  method: 'position' | 'position-rotation' | 'full';
  /** Crop mode */
  cropMode: 'stabilize-only' | 'auto-crop' | 'synthesize-edges';
}

/**
 * Audio level data for waveform visualization
 */
export interface AudioLevel {
  /** Time in seconds */
  time: number;
  /** Peak level (0-1) */
  peak: number;
  /** RMS level (0-1) */
  rms: number;
}

/**
 * Timeline marker
 */
export interface Marker {
  /** Unique marker identifier */
  id: string;
  /** Time position in seconds */
  time: number;
  /** Marker label */
  label: string;
  /** Marker color (hex) */
  color: string;
  /** Marker type */
  type: 'chapter' | 'comment' | 'todo' | 'custom';
  /** Optional marker duration (for chapter markers) */
  duration?: number;
  /** Optional comment text */
  comment?: string;
}

/**
 * Snapping configuration
 */
export interface SnappingConfig {
  /** Whether snapping is enabled globally */
  enabled: boolean;
  /** Snap to clip edges */
  snapToClips: boolean;
  /** Snap to playhead */
  snapToPlayhead: boolean;
  /** Snap to markers */
  snapToMarkers: boolean;
  /** Snap to grid */
  snapToGrid: boolean;
  /** Grid size in seconds */
  gridSize: number;
  /** Snap threshold in pixels */
  threshold: number;
}

/**
 * Create a default track
 */
export function createDefaultTrack(type: TrackType, index: number): Omit<Track, 'id'> {
  const baseTrack = {
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`,
    index,
    locked: false,
    muted: false,
    solo: false,
    visible: true,
    height: type === 'audio' ? 80 : 120,
    color: getDefaultTrackColor(type),
    clips: [],
    effects: [],
  };

  if (type === 'audio') {
    return {
      ...baseTrack,
      volume: 1,
      pan: 0,
    };
  }

  if (type === 'video') {
    return {
      ...baseTrack,
      blend: 'normal',
      opacity: 1,
    };
  }

  return baseTrack;
}

/**
 * Get default color for track type
 */
function getDefaultTrackColor(type: TrackType): string {
  const colors: Record<TrackType, string> = {
    video: '#3b6ee8',
    audio: '#16a34a',
    subtitle: '#9333ea',
    effect: '#ea580c',
    adjustment: '#f59e0b',
    generator: '#8b5cf6',
  };
  return colors[type];
}

/**
 * Create a default clip
 */
export function createDefaultClip(
  trackId: string,
  mediaId: string,
  startTime: number,
  duration: number
): Omit<Clip, 'id'> {
  return {
    trackId,
    mediaId,
    name: 'Clip',
    startTime,
    duration,
    mediaStart: 0,
    mediaEnd: duration,
    trimStart: 0,
    trimEnd: duration,
    speed: 1,
    effects: [],
    keyframes: [],
    transform: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 1,
    },
    crop: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  };
}

/**
 * Convert seconds to timecode string (HH:MM:SS:FF)
 */
export function secondsToTimecode(seconds: number, frameRate: number): string {
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
 * Convert timecode string to seconds
 */
export function timecodeToSeconds(timecode: string, frameRate: number): number {
  const parts = timecode.split(':').map(Number);
  if (parts.length !== 4) {
    throw new Error('Invalid timecode format. Expected HH:MM:SS:FF');
  }

  const [hours = 0, minutes = 0, seconds = 0, frames = 0] = parts;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const frameSeconds = frames / frameRate;

  return totalSeconds + frameSeconds;
}
