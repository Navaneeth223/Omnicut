/**
 * Advanced Export Types
 * Extended export options and formats
 */

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  category: 'video' | 'audio' | 'image' | 'gif';
  codecs: ExportCodec[];
  supportsAlpha: boolean;
  supportsAudio: boolean;
}

export interface ExportCodec {
  id: string;
  name: string;
  type: 'video' | 'audio';
  quality: 'low' | 'medium' | 'high' | 'lossless';
  bitrate?: number;
  supported: boolean;
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'social' | 'broadcast' | 'archive' | 'custom';
  format: string;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  videoBitrate: number;
  audioBitrate: number;
  videoCodec: string;
  audioCodec: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export interface ExportOptions {
  format: string;
  preset?: string;
  
  // Video settings
  resolution?: {
    width: number;
    height: number;
  };
  frameRate?: number;
  videoBitrate?: number;
  videoCodec?: string;
  videoQuality?: number; // 0-100
  
  // Audio settings
  audioBitrate?: number;
  audioCodec?: string;
  audioChannels?: 1 | 2 | 6 | 8;
  audioSampleRate?: 44100 | 48000 | 96000;
  
  // Advanced
  hardwareAcceleration?: boolean;
  twoPass?: boolean;
  startTime?: number;
  endTime?: number;
  includeAlpha?: boolean;
  
  // Metadata
  metadata?: {
    title?: string;
    author?: string;
    description?: string;
    copyright?: string;
    tags?: string[];
  };
}

export interface ExportJob {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  options: ExportOptions;
  outputPath?: string;
  outputSize?: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string;
}

export interface ExportQueue {
  jobs: ExportJob[];
  activeJob?: ExportJob;
  maxConcurrent: number;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  options: ExportOptions;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined export presets
export const EXPORT_PRESETS: ExportPreset[] = [
  // Web presets
  {
    id: 'web-1080p',
    name: 'Web 1080p',
    description: 'Optimized for web streaming',
    category: 'web',
    format: 'mp4',
    resolution: { width: 1920, height: 1080 },
    frameRate: 30,
    videoBitrate: 5000,
    audioBitrate: 192,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'high',
  },
  {
    id: 'web-720p',
    name: 'Web 720p',
    description: 'Balanced quality and file size',
    category: 'web',
    format: 'mp4',
    resolution: { width: 1280, height: 720 },
    frameRate: 30,
    videoBitrate: 2500,
    audioBitrate: 128,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'medium',
  },
  
  // Social media presets
  {
    id: 'youtube-1080p',
    name: 'YouTube 1080p',
    description: 'Optimized for YouTube',
    category: 'social',
    format: 'mp4',
    resolution: { width: 1920, height: 1080 },
    frameRate: 60,
    videoBitrate: 8000,
    audioBitrate: 192,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'high',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: '9:16 vertical format',
    category: 'social',
    format: 'mp4',
    resolution: { width: 1080, height: 1920 },
    frameRate: 30,
    videoBitrate: 3500,
    audioBitrate: 128,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'high',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: '9:16 vertical format',
    category: 'social',
    format: 'mp4',
    resolution: { width: 1080, height: 1920 },
    frameRate: 30,
    videoBitrate: 3000,
    audioBitrate: 128,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'high',
  },
  
  // Broadcast presets
  {
    id: 'broadcast-1080p',
    name: 'Broadcast 1080p',
    description: 'Professional broadcast quality',
    category: 'broadcast',
    format: 'mp4',
    resolution: { width: 1920, height: 1080 },
    frameRate: 30,
    videoBitrate: 15000,
    audioBitrate: 320,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'ultra',
  },
  
  // Archive presets
  {
    id: 'archive-4k',
    name: 'Archive 4K',
    description: 'Highest quality for archival',
    category: 'archive',
    format: 'mp4',
    resolution: { width: 3840, height: 2160 },
    frameRate: 60,
    videoBitrate: 40000,
    audioBitrate: 320,
    videoCodec: 'h264',
    audioCodec: 'aac',
    quality: 'ultra',
  },
];

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'mp4',
    name: 'MP4 (H.264)',
    extension: '.mp4',
    mimeType: 'video/mp4',
    category: 'video',
    codecs: [
      { id: 'h264', name: 'H.264', type: 'video', quality: 'high', supported: true },
      { id: 'aac', name: 'AAC', type: 'audio', quality: 'high', supported: true },
    ],
    supportsAlpha: false,
    supportsAudio: true,
  },
  {
    id: 'webm',
    name: 'WebM (VP9)',
    extension: '.webm',
    mimeType: 'video/webm',
    category: 'video',
    codecs: [
      { id: 'vp9', name: 'VP9', type: 'video', quality: 'high', supported: true },
      { id: 'opus', name: 'Opus', type: 'audio', quality: 'high', supported: true },
    ],
    supportsAlpha: true,
    supportsAudio: true,
  },
  {
    id: 'mov',
    name: 'QuickTime (MOV)',
    extension: '.mov',
    mimeType: 'video/quicktime',
    category: 'video',
    codecs: [
      { id: 'h264', name: 'H.264', type: 'video', quality: 'high', supported: true },
      { id: 'aac', name: 'AAC', type: 'audio', quality: 'high', supported: true },
    ],
    supportsAlpha: true,
    supportsAudio: true,
  },
  {
    id: 'gif',
    name: 'Animated GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    category: 'gif',
    codecs: [],
    supportsAlpha: true,
    supportsAudio: false,
  },
];
