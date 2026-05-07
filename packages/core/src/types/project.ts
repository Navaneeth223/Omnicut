/**
 * Core project data structures for OmniCut
 * @module types/project
 */

import type { Timeline } from './timeline';
import type { MediaPool } from './media';
import type { ColorGradingState } from './color';
import type { AudioMixerState } from './audio';
import type { ExportPreset } from './export';
import type { PluginState } from './plugin';

/**
 * Main OmniCut project structure
 * Contains all data needed to save/load a complete editing session
 */
export interface OmniCutProject {
  /** Unique project identifier (UUID v4) */
  id: string;
  /** Project format version for migration compatibility */
  version: string;
  /** Human-readable project name */
  name: string;
  /** Optional project description */
  description?: string;
  /** Project creation timestamp */
  createdAt: Date;
  /** Last modification timestamp */
  updatedAt: Date;
  /** Project-wide settings */
  settings: ProjectSettings;
  /** Timeline data (tracks, clips, markers) */
  timeline: Timeline;
  /** Media pool (imported assets) */
  mediaPool: MediaPool;
  /** Color grading state */
  colorGrading: ColorGradingState;
  /** Audio mixer state */
  audioMixer: AudioMixerState;
  /** Export presets */
  exportPresets: ExportPreset[];
  /** Active plugins and their state */
  plugins: PluginState[];
  /** Custom metadata (extensible) */
  metadata: Record<string, unknown>;
}

/**
 * Project-wide settings that affect rendering and playback
 */
export interface ProjectSettings {
  /** Video resolution */
  resolution: Resolution;
  /** Frame rate (fps) */
  frameRate: FrameRate;
  /** Aspect ratio */
  aspectRatio: AspectRatio;
  /** Audio sample rate (Hz) */
  sampleRate: SampleRate;
  /** Audio bit depth */
  bitDepth: BitDepth;
  /** Color space for video */
  colorSpace: ColorSpace;
  /** HDR mode */
  hdrMode: HDRMode;
  /** Proxy mode for performance */
  proxyMode: ProxyMode;
  /** Auto-save interval in seconds (0 = disabled) */
  autoSaveInterval: number;
}

/**
 * Video resolution in pixels
 */
export interface Resolution {
  width: number;
  height: number;
}

/**
 * Common frame rates (frames per second)
 */
export type FrameRate = 23.976 | 24 | 25 | 29.97 | 30 | 50 | 59.94 | 60 | 120;

/**
 * Common aspect ratios
 */
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9' | '2.39:1' | 'custom';

/**
 * Audio sample rates in Hz
 */
export type SampleRate = 44100 | 48000 | 96000 | 192000;

/**
 * Audio bit depth
 */
export type BitDepth = 16 | 24 | 32;

/**
 * Color space standards
 */
export type ColorSpace = 'Rec.709' | 'Rec.2020' | 'P3-D65' | 'sRGB' | 'Adobe RGB';

/**
 * HDR modes
 */
export type HDRMode = 'SDR' | 'HDR10' | 'HDR10+' | 'HLG' | 'Dolby Vision';

/**
 * Proxy resolution modes for performance
 */
export type ProxyMode = 'none' | 'quarter' | 'half' | 'full';

/**
 * Common video resolutions as presets
 */
export const COMMON_RESOLUTIONS: Record<string, Resolution> = {
  '8K': { width: 7680, height: 4320 },
  '4K_UHD': { width: 3840, height: 2160 },
  '4K_DCI': { width: 4096, height: 2160 },
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
  '480p': { width: 854, height: 480 },
  'Instagram_Square': { width: 1080, height: 1080 },
  'Instagram_Story': { width: 1080, height: 1920 },
  'TikTok': { width: 1080, height: 1920 },
  'YouTube_Shorts': { width: 1080, height: 1920 },
};

/**
 * Calculate aspect ratio from resolution
 */
export function calculateAspectRatio(resolution: Resolution): number {
  return resolution.width / resolution.height;
}

/**
 * Get aspect ratio string from resolution
 */
export function getAspectRatioString(resolution: Resolution): string {
  const ratio = calculateAspectRatio(resolution);
  
  // Check common ratios
  if (Math.abs(ratio - 16 / 9) < 0.01) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.01) return '9:16';
  if (Math.abs(ratio - 1) < 0.01) return '1:1';
  if (Math.abs(ratio - 4 / 3) < 0.01) return '4:3';
  if (Math.abs(ratio - 21 / 9) < 0.01) return '21:9';
  if (Math.abs(ratio - 2.39) < 0.01) return '2.39:1';
  
  return 'custom';
}

/**
 * Create a new project with default settings
 */
export function createDefaultProject(name: string): Omit<OmniCutProject, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    version: '1.0.0',
    name,
    description: '',
    settings: {
      resolution: COMMON_RESOLUTIONS['1080p']!,
      frameRate: 30,
      aspectRatio: '16:9',
      sampleRate: 48000,
      bitDepth: 24,
      colorSpace: 'Rec.709',
      hdrMode: 'SDR',
      proxyMode: 'none',
      autoSaveInterval: 60,
    },
    timeline: {
      id: '',
      duration: 0,
      playhead: 0,
      tracks: [],
      markers: [],
      zoomLevel: 1,
      scrollPosition: 0,
      snapping: {
        enabled: true,
        snapToClips: true,
        snapToPlayhead: true,
        snapToMarkers: true,
        snapToGrid: false,
        gridSize: 1,
        threshold: 10,
      },
    },
    mediaPool: {
      id: '',
      items: [],
      bins: [],
      smartBins: [],
    },
    colorGrading: {
      nodes: [],
      activeNodeId: null,
      gallery: [],
    },
    audioMixer: {
      channels: [],
      buses: [],
      masterBus: {
        id: 'master',
        name: 'Master',
        volume: 0,
        pan: 0,
        muted: false,
        solo: false,
        effects: [],
        output: 'master',
      },
    },
    exportPresets: [],
    plugins: [],
    metadata: {},
  };
}
