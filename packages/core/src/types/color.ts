/**
 * Color grading and correction types
 * @module types/color
 */

/**
 * Color grading state for the entire project
 */
export interface ColorGradingState {
  /** Color grading nodes */
  nodes: ColorNode[];
  /** Currently active node ID */
  activeNodeId: string | null;
  /** Gallery of saved color grades */
  gallery: ColorGradeSnapshot[];
}

/**
 * Color grading node (like DaVinci Resolve)
 */
export interface ColorNode {
  /** Unique node identifier */
  id: string;
  /** Node name */
  name: string;
  /** Node type */
  type: ColorNodeType;
  /** Whether node is enabled */
  enabled: boolean;
  /** Color wheels (lift/gamma/gain) */
  wheels?: ColorWheels;
  /** Curves adjustments */
  curves?: ColorCurves;
  /** HSL qualifier for secondary color correction */
  qualifier?: HSLQualifier;
  /** Power windows (masks) */
  windows?: PowerWindow[];
  /** LUT applied to this node */
  lut?: LUTInfo;
  /** Node connections */
  connections: {
    input: string[];
    output: string[];
  };
}

/**
 * Color node types
 */
export type ColorNodeType = 'serial' | 'parallel' | 'layer' | 'outside';

/**
 * Color wheels for lift/gamma/gain adjustments
 */
export interface ColorWheels {
  /** Lift (shadows) */
  lift: ColorWheel;
  /** Gamma (midtones) */
  gamma: ColorWheel;
  /** Gain (highlights) */
  gain: ColorWheel;
  /** Offset (overall) */
  offset: ColorWheel;
}

/**
 * Individual color wheel
 */
export interface ColorWheel {
  /** Red channel adjustment (-1 to 1) */
  red: number;
  /** Green channel adjustment (-1 to 1) */
  green: number;
  /** Blue channel adjustment (-1 to 1) */
  blue: number;
  /** Luminance adjustment (-1 to 1) */
  luminance: number;
}

/**
 * Color curves (RGB and individual channels)
 */
export interface ColorCurves {
  /** Master RGB curve */
  master: CurvePoints;
  /** Red channel curve */
  red: CurvePoints;
  /** Green channel curve */
  green: CurvePoints;
  /** Blue channel curve */
  blue: CurvePoints;
  /** Hue vs Saturation curve */
  hueVsSat?: CurvePoints;
  /** Hue vs Hue curve */
  hueVsHue?: CurvePoints;
  /** Hue vs Luminance curve */
  hueVsLum?: CurvePoints;
  /** Saturation vs Saturation curve */
  satVsSat?: CurvePoints;
  /** Luminance vs Saturation curve */
  lumVsSat?: CurvePoints;
}

/**
 * Curve control points
 */
export type CurvePoints = Array<{ x: number; y: number }>;

/**
 * HSL qualifier for secondary color correction
 */
export interface HSLQualifier {
  /** Hue range (0-360 degrees) */
  hueRange: [number, number];
  /** Saturation range (0-1) */
  saturationRange: [number, number];
  /** Luminance range (0-1) */
  luminanceRange: [number, number];
  /** Softness of selection edges (0-1) */
  softness: number;
  /** Whether to invert the selection */
  invert: boolean;
}

/**
 * Power window (shape-based mask)
 */
export interface PowerWindow {
  /** Unique window identifier */
  id: string;
  /** Window shape */
  shape: 'circle' | 'square' | 'polygon' | 'gradient';
  /** Position (normalized 0-1) */
  position: { x: number; y: number };
  /** Size (normalized 0-1) */
  size: { width: number; height: number };
  /** Rotation in degrees */
  rotation: number;
  /** Inner softness (0-1) */
  innerSoftness: number;
  /** Outer softness (0-1) */
  outerSoftness: number;
  /** Opacity (0-1) */
  opacity: number;
  /** Whether window is inverted */
  invert: boolean;
  /** Polygon points (for polygon shape) */
  points?: Array<{ x: number; y: number }>;
}

/**
 * LUT (Look-Up Table) information
 */
export interface LUTInfo {
  /** LUT identifier */
  id: string;
  /** LUT name */
  name: string;
  /** LUT file path */
  path: string;
  /** LUT format */
  format: '.cube' | '.3dl' | '.look' | '.lut';
  /** LUT cube size (17, 33, or 65) */
  cubeSize: 17 | 33 | 65;
  /** LUT intensity (0-1) */
  intensity: number;
}

/**
 * Clip-level color grade
 */
export interface ClipColorGrade {
  /** Temperature adjustment (-100 to 100) */
  temperature: number;
  /** Tint adjustment (-100 to 100) */
  tint: number;
  /** Exposure adjustment in EV stops (-5 to 5) */
  exposure: number;
  /** Contrast (-100 to 100) */
  contrast: number;
  /** Highlights (-100 to 100) */
  highlights: number;
  /** Shadows (-100 to 100) */
  shadows: number;
  /** Whites (-100 to 100) */
  whites: number;
  /** Blacks (-100 to 100) */
  blacks: number;
  /** Saturation (-100 to 100) */
  saturation: number;
  /** Vibrance (-100 to 100) */
  vibrance: number;
  /** Applied LUT */
  lut?: LUTInfo;
}

/**
 * Color grade snapshot for gallery
 */
export interface ColorGradeSnapshot {
  /** Unique snapshot identifier */
  id: string;
  /** Snapshot name */
  name: string;
  /** Thumbnail image (base64 or URL) */
  thumbnail: string;
  /** Saved color grade settings */
  grade: ClipColorGrade;
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Create default color wheels
 */
export function createDefaultColorWheels(): ColorWheels {
  const defaultWheel: ColorWheel = {
    red: 0,
    green: 0,
    blue: 0,
    luminance: 0,
  };

  return {
    lift: { ...defaultWheel },
    gamma: { ...defaultWheel },
    gain: { ...defaultWheel },
    offset: { ...defaultWheel },
  };
}

/**
 * Create default color curves
 */
export function createDefaultColorCurves(): ColorCurves {
  const defaultCurve: CurvePoints = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ];

  return {
    master: [...defaultCurve],
    red: [...defaultCurve],
    green: [...defaultCurve],
    blue: [...defaultCurve],
  };
}

/**
 * Create default clip color grade
 */
export function createDefaultClipColorGrade(): ClipColorGrade {
  return {
    temperature: 0,
    tint: 0,
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    saturation: 0,
    vibrance: 0,
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s, l];
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
