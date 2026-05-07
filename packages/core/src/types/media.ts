/**
 * Media pool and media item types
 * @module types/media
 */

/**
 * Media pool containing all imported assets
 */
export interface MediaPool {
  /** Unique media pool identifier */
  id: string;
  /** All media items */
  items: MediaItem[];
  /** User-created bins (folders) */
  bins: MediaBin[];
  /** Smart bins (auto-filtered) */
  smartBins: SmartBin[];
}

/**
 * Media item types
 */
export type MediaType = 'video' | 'audio' | 'image' | 'sequence' | 'generator' | 'title';

/**
 * A single media item in the pool
 */
export interface MediaItem {
  /** Unique media item identifier */
  id: string;
  /** Display name */
  name: string;
  /** File path or URL */
  path: string;
  /** URL (for backward compatibility) */
  url?: string;
  /** Media type */
  type: MediaType;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Duration in seconds (video/audio only) */
  duration?: number;
  /** Width in pixels (video/image only) */
  width?: number;
  /** Height in pixels (video/image only) */
  height?: number;
  /** Frame rate (video only) */
  frameRate?: number;
  /** Sample rate in Hz (audio only) */
  sampleRate?: number;
  /** Audio channels (audio only) */
  channels?: number;
  /** Codec name */
  codec?: string;
  /** Bitrate in bits per second */
  bitrate?: number;
  /** Color space (video/image only) */
  colorSpace?: string;
  /** Whether media has alpha channel */
  hasAlpha?: boolean;
  /** Proxy information */
  proxy?: ProxyInfo;
  /** Thumbnail image (base64 or URL) */
  thumbnail?: string;
  /** Waveform data (audio only) */
  waveform?: WaveformData;
  /** Additional metadata */
  metadata: MediaMetadata;
  /** User-assigned tags */
  tags: string[];
  /** Star rating (0-5) */
  rating: number;
  /** Number of times used in timeline */
  usageCount: number;
  /** Import timestamp */
  importedAt: Date;
}

/**
 * Proxy file information
 */
export interface ProxyInfo {
  /** Proxy file path */
  path: string;
  /** Proxy resolution */
  resolution: 'quarter' | 'half' | 'full';
  /** Proxy codec */
  codec: string;
  /** Proxy file size in bytes */
  size: number;
  /** Whether proxy is ready to use */
  ready: boolean;
  /** Generation progress (0-1) */
  progress: number;
}

/**
 * Audio waveform data for visualization
 */
export interface WaveformData {
  /** Peak values (0-1) */
  peaks: number[];
  /** RMS values (0-1) */
  rms: number[];
  /** Samples per data point */
  samplesPerPoint: number;
  /** Total samples */
  totalSamples: number;
}

/**
 * Media metadata
 */
export interface MediaMetadata {
  /** Camera make */
  cameraMake?: string;
  /** Camera model */
  cameraModel?: string;
  /** Lens model */
  lens?: string;
  /** ISO value */
  iso?: number;
  /** Aperture (f-stop) */
  aperture?: number;
  /** Shutter speed */
  shutterSpeed?: string;
  /** Focal length in mm */
  focalLength?: number;
  /** Capture date/time */
  captureDate?: Date;
  /** GPS coordinates */
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  /** Copyright information */
  copyright?: string;
  /** Artist/creator */
  artist?: string;
  /** Description */
  description?: string;
  /** Keywords */
  keywords?: string[];
  /** Custom metadata fields */
  custom?: Record<string, unknown>;
}

/**
 * User-created bin (folder)
 */
export interface MediaBin {
  /** Unique bin identifier */
  id: string;
  /** Bin name */
  name: string;
  /** Parent bin ID (for nested bins) */
  parentId?: string;
  /** Media item IDs in this bin */
  itemIds: string[];
  /** Bin color (hex) */
  color?: string;
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Smart bin with auto-filtering
 */
export interface SmartBin {
  /** Unique smart bin identifier */
  id: string;
  /** Smart bin name */
  name: string;
  /** Filter rules */
  filters: MediaFilter[];
  /** Bin color (hex) */
  color?: string;
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Media filter rule for smart bins
 */
export interface MediaFilter {
  /** Property to filter on */
  property: keyof MediaItem | 'metadata.cameraMake' | 'metadata.iso' | string;
  /** Filter operator */
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  /** Filter value(s) */
  value: unknown;
}

/**
 * Media pool view modes
 */
export type MediaPoolViewMode = 'grid' | 'list' | 'filmstrip';

/**
 * Media pool sort options
 */
export type MediaPoolSortBy =
  | 'name'
  | 'dateImported'
  | 'dateModified'
  | 'duration'
  | 'size'
  | 'rating'
  | 'usageCount';

/**
 * Media pool sort direction
 */
export type MediaPoolSortDirection = 'asc' | 'desc';

/**
 * Create a default media bin
 */
export function createDefaultBin(name: string, parentId?: string): Omit<MediaBin, 'id' | 'createdAt'> {
  return {
    name,
    parentId,
    itemIds: [],
  };
}

/**
 * Check if media item matches filter
 */
export function matchesFilter(item: MediaItem, filter: MediaFilter): boolean {
  const value = getNestedProperty(item as unknown as Record<string, unknown>, filter.property);

  switch (filter.operator) {
    case 'equals':
      return value === filter.value;
    case 'contains':
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case 'greaterThan':
      return Number(value) > Number(filter.value);
    case 'lessThan':
      return Number(value) < Number(filter.value);
    case 'between':
      if (Array.isArray(filter.value) && filter.value.length === 2) {
        const numValue = Number(value);
        return numValue >= Number(filter.value[0]) && numValue <= Number(filter.value[1]);
      }
      return false;
    case 'in':
      return Array.isArray(filter.value) && filter.value.includes(value);
    default:
      return false;
  }
}

/**
 * Get nested property value from object
 */
function getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj as unknown);
}
