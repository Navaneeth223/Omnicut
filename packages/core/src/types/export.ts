/**
 * Export and rendering types
 * @module types/export
 */

/**
 * Export preset configuration
 */
export interface ExportPreset {
  /** Unique preset identifier */
  id: string;
  /** Preset name */
  name: string;
  /** Preset category */
  category: ExportCategory;
  /** Container format */
  container: ContainerFormat;
  /** Video codec settings */
  video?: VideoCodecSettings;
  /** Audio codec settings */
  audio?: AudioCodecSettings;
  /** Output resolution (null = use project resolution) */
  resolution?: { width: number; height: number };
  /** Frame rate (null = use project frame rate) */
  frameRate?: number;
  /** Whether this is a built-in preset */
  builtIn: boolean;
}

/**
 * Export categories
 */
export type ExportCategory =
  | 'social-media'
  | 'broadcast'
  | 'web'
  | 'mobile'
  | 'archive'
  | 'custom';

/**
 * Container formats
 */
export type ContainerFormat =
  | 'mp4'
  | 'mov'
  | 'mkv'
  | 'avi'
  | 'webm'
  | 'mxf'
  | 'wav'
  | 'mp3'
  | 'flac'
  | 'aac'
  | 'gif'
  | 'png'
  | 'jpg'
  | 'tiff';

/**
 * Video codec settings
 */
export interface VideoCodecSettings {
  /** Codec name */
  codec: VideoCodec;
  /** Encoding profile */
  profile?: string;
  /** Encoding preset (speed vs quality) */
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
  /** Bitrate mode */
  bitrateMode: 'CBR' | 'VBR' | 'CRF';
  /** Target bitrate in bps (for CBR/VBR) */
  bitrate?: number;
  /** CRF value (for CRF mode, 0-51, lower = better quality) */
  crf?: number;
  /** Maximum bitrate in bps (for VBR) */
  maxBitrate?: number;
  /** Two-pass encoding */
  twoPass: boolean;
  /** GOP size (keyframe interval) */
  gopSize?: number;
  /** B-frames */
  bFrames?: number;
  /** Pixel format */
  pixelFormat?: string;
  /** Color space */
  colorSpace?: string;
  /** HDR metadata */
  hdr?: HDRMetadata;
}

/**
 * Video codecs
 */
export type VideoCodec =
  | 'h264'
  | 'h265'
  | 'av1'
  | 'vp9'
  | 'vp8'
  | 'prores'
  | 'dnxhd'
  | 'dnxhr'
  | 'cineform'
  | 'mjpeg'
  | 'mpeg2';

/**
 * Audio codec settings
 */
export interface AudioCodecSettings {
  /** Codec name */
  codec: AudioCodec;
  /** Bitrate in bps */
  bitrate: number;
  /** Sample rate in Hz */
  sampleRate: number;
  /** Bit depth */
  bitDepth?: number;
  /** Number of channels */
  channels: number;
  /** Channel layout */
  channelLayout?: 'mono' | 'stereo' | '5.1' | '7.1';
}

/**
 * Audio codecs
 */
export type AudioCodec =
  | 'aac'
  | 'mp3'
  | 'opus'
  | 'vorbis'
  | 'flac'
  | 'alac'
  | 'pcm'
  | 'ac3'
  | 'eac3';

/**
 * HDR metadata
 */
export interface HDRMetadata {
  /** HDR standard */
  standard: 'HDR10' | 'HDR10+' | 'HLG' | 'Dolby Vision';
  /** Master display color primaries */
  masterDisplay?: {
    redX: number;
    redY: number;
    greenX: number;
    greenY: number;
    blueX: number;
    blueY: number;
    whiteX: number;
    whiteY: number;
    maxLuminance: number;
    minLuminance: number;
  };
  /** Maximum content light level */
  maxCLL?: number;
  /** Maximum frame-average light level */
  maxFALL?: number;
}

/**
 * Export settings for dialog
 */
export interface ExportSettings {
  /** Output format */
  format: 'mp4' | 'webm' | 'mov';
  /** Video codec */
  codec: 'h264' | 'h265' | 'vp9' | 'av1';
  /** Output resolution */
  resolution: {
    width: number;
    height: number;
  };
  /** Frame rate */
  frameRate: number;
  /** Video bitrate in kbps */
  bitrate: number;
  /** Quality preset */
  quality: 'low' | 'medium' | 'high' | 'ultra';
  /** Audio codec */
  audioCodec: 'aac' | 'mp3' | 'opus';
  /** Audio bitrate in kbps */
  audioBitrate: number;
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
}

/**
 * Export job
 */
export interface ExportJob {
  /** Unique job identifier */
  id: string;
  /** Job name */
  name: string;
  /** Export preset */
  preset: ExportPreset;
  /** Output file path */
  outputPath: string;
  /** In point (seconds, null = start of timeline) */
  inPoint: number | null;
  /** Out point (seconds, null = end of timeline) */
  outPoint: number | null;
  /** Job status */
  status: ExportJobStatus;
  /** Progress (0-1) */
  progress: number;
  /** Current frame being rendered */
  currentFrame: number;
  /** Total frames to render */
  totalFrames: number;
  /** Estimated time remaining in seconds */
  estimatedTimeRemaining: number;
  /** Data rate in bps */
  dataRate: number;
  /** File size in bytes */
  fileSize: number;
  /** Error message (if failed) */
  error?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Start timestamp */
  startedAt?: Date;
  /** Completion timestamp */
  completedAt?: Date;
}

/**
 * Export job status
 */
export type ExportJobStatus =
  | 'queued'
  | 'preparing'
  | 'rendering'
  | 'finalizing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Built-in export presets
 */
export const BUILT_IN_PRESETS: Record<string, ExportPreset> = {
  YOUTUBE_1080P: {
    id: 'youtube-1080p',
    name: 'YouTube 1080p',
    category: 'social-media',
    container: 'mp4',
    video: {
      codec: 'h264',
      profile: 'high',
      preset: 'medium',
      bitrateMode: 'VBR',
      bitrate: 8_000_000,
      maxBitrate: 12_000_000,
      twoPass: false,
    },
    audio: {
      codec: 'aac',
      bitrate: 192_000,
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
    },
    resolution: { width: 1920, height: 1080 },
    builtIn: true,
  },
  YOUTUBE_4K: {
    id: 'youtube-4k',
    name: 'YouTube 4K',
    category: 'social-media',
    container: 'mp4',
    video: {
      codec: 'h265',
      profile: 'main',
      preset: 'medium',
      bitrateMode: 'VBR',
      bitrate: 45_000_000,
      maxBitrate: 60_000_000,
      twoPass: false,
    },
    audio: {
      codec: 'aac',
      bitrate: 320_000,
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
    },
    resolution: { width: 3840, height: 2160 },
    builtIn: true,
  },
  INSTAGRAM_FEED: {
    id: 'instagram-feed',
    name: 'Instagram Feed (1:1)',
    category: 'social-media',
    container: 'mp4',
    video: {
      codec: 'h264',
      profile: 'high',
      preset: 'medium',
      bitrateMode: 'VBR',
      bitrate: 5_000_000,
      maxBitrate: 8_000_000,
      twoPass: false,
    },
    audio: {
      codec: 'aac',
      bitrate: 128_000,
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
    },
    resolution: { width: 1080, height: 1080 },
    builtIn: true,
  },
  INSTAGRAM_REELS: {
    id: 'instagram-reels',
    name: 'Instagram Reels (9:16)',
    category: 'social-media',
    container: 'mp4',
    video: {
      codec: 'h264',
      profile: 'high',
      preset: 'medium',
      bitrateMode: 'VBR',
      bitrate: 5_000_000,
      maxBitrate: 8_000_000,
      twoPass: false,
    },
    audio: {
      codec: 'aac',
      bitrate: 128_000,
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
    },
    resolution: { width: 1080, height: 1920 },
    builtIn: true,
  },
  PRORES_422: {
    id: 'prores-422',
    name: 'ProRes 422',
    category: 'archive',
    container: 'mov',
    video: {
      codec: 'prores',
      profile: '422',
      preset: 'medium',
      bitrateMode: 'VBR',
      twoPass: false,
    },
    audio: {
      codec: 'pcm',
      bitrate: 1_536_000,
      sampleRate: 48000,
      bitDepth: 24,
      channels: 2,
      channelLayout: 'stereo',
    },
    builtIn: true,
  },
};

/**
 * Create a default export preset
 */
export function createDefaultExportPreset(name: string): Omit<ExportPreset, 'id'> {
  return {
    name,
    category: 'custom',
    container: 'mp4',
    video: {
      codec: 'h264',
      profile: 'high',
      preset: 'medium',
      bitrateMode: 'CRF',
      crf: 23,
      twoPass: false,
    },
    audio: {
      codec: 'aac',
      bitrate: 192_000,
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
    },
    builtIn: false,
  };
}

/**
 * Estimate file size based on settings
 */
export function estimateFileSize(
  preset: ExportPreset,
  durationSeconds: number
): number {
  let totalBitrate = 0;

  if (preset.video?.bitrate) {
    totalBitrate += preset.video.bitrate;
  }

  if (preset.audio?.bitrate) {
    totalBitrate += preset.audio.bitrate;
  }

  // Convert to bytes
  return (totalBitrate / 8) * durationSeconds;
}
