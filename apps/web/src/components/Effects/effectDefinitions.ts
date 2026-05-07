/**
 * Effect Definitions
 * Complete list of all available effects
 */

import type { EffectType, EffectCategory } from '@omnicut/core';

export interface EffectParameter {
  name: string;
  label: string;
  type: 'slider' | 'color' | 'checkbox' | 'select';
  min?: number;
  max?: number;
  default: number | string | boolean;
  step?: number;
}

export interface EffectDefinition {
  type: EffectType;
  name: string;
  category: EffectCategory;
  icon: string;
  description: string;
  parameters?: EffectParameter[];
  implemented?: boolean; // Whether the effect has working shader
}

/**
 * All available effects (50+ effects)
 */
export const ALL_EFFECTS: EffectDefinition[] = [
  // ===== COLOR EFFECTS =====
  {
    type: 'brightness_contrast',
    name: 'Brightness & Contrast',
    category: 'color',
    icon: '☀️',
    description: 'Adjust brightness and contrast',
    implemented: true,
    parameters: [
      {
        name: 'brightness',
        label: 'Brightness',
        type: 'slider',
        min: -1,
        max: 1,
        default: 0,
        step: 0.01,
      },
      {
        name: 'contrast',
        label: 'Contrast',
        type: 'slider',
        min: 0,
        max: 3,
        default: 1,
        step: 0.01,
      },
    ],
  },
  {
    type: 'hue_saturation',
    name: 'Hue & Saturation',
    category: 'color',
    icon: '🎨',
    description: 'Adjust hue, saturation, and lightness',
    implemented: true,
    parameters: [
      {
        name: 'hue',
        label: 'Hue',
        type: 'slider',
        min: -0.5,
        max: 0.5,
        default: 0,
        step: 0.01,
      },
      {
        name: 'saturation',
        label: 'Saturation',
        type: 'slider',
        min: 0,
        max: 2,
        default: 1,
        step: 0.01,
      },
    ],
  },
  {
    type: 'exposure',
    name: 'Exposure',
    category: 'color',
    icon: '📸',
    description: 'Adjust exposure and gamma',
  },
  {
    type: 'color_correction',
    name: 'Color Correction',
    category: 'color',
    icon: '🎨',
    description: 'Professional color correction',
  },
  {
    type: 'color_grade',
    name: 'Color Grade',
    category: 'color',
    icon: '🎬',
    description: 'Cinematic color grading',
  },
  {
    type: 'white_balance',
    name: 'White Balance',
    category: 'color',
    icon: '⚖️',
    description: 'Adjust color temperature',
  },
  {
    type: 'vibrance',
    name: 'Vibrance',
    category: 'color',
    icon: '💫',
    description: 'Enhance color intensity',
  },
  {
    type: 'tint',
    name: 'Tint',
    category: 'color',
    icon: '🌈',
    description: 'Add color tint overlay',
  },

  // ===== BLUR & SHARPEN =====
  {
    type: 'gaussian_blur',
    name: 'Gaussian Blur',
    category: 'blur',
    icon: '🌫️',
    description: 'Smooth blur effect',
    implemented: true,
    parameters: [
      {
        name: 'radius',
        label: 'Radius',
        type: 'slider',
        min: 0,
        max: 10,
        default: 2,
        step: 0.1,
      },
    ],
  },
  {
    type: 'motion_blur',
    name: 'Motion Blur',
    category: 'blur',
    icon: '💨',
    description: 'Directional motion blur',
  },
  {
    type: 'radial_blur',
    name: 'Radial Blur',
    category: 'blur',
    icon: '🌀',
    description: 'Circular blur from center',
  },
  {
    type: 'sharpen',
    name: 'Sharpen',
    category: 'blur',
    icon: '🔪',
    description: 'Enhance edge definition',
    implemented: true,
    parameters: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'slider',
        min: 0,
        max: 2,
        default: 0.5,
        step: 0.01,
      },
    ],
  },
  {
    type: 'unsharp_mask',
    name: 'Unsharp Mask',
    category: 'blur',
    icon: '✨',
    description: 'Advanced sharpening',
  },

  // ===== STYLIZE EFFECTS =====
  {
    type: 'vignette',
    name: 'Vignette',
    category: 'stylize',
    icon: '⭕',
    description: 'Darken edges of frame',
    implemented: true,
    parameters: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'slider',
        min: 0,
        max: 1,
        default: 0.5,
        step: 0.01,
      },
      {
        name: 'radius',
        label: 'Radius',
        type: 'slider',
        min: 0.5,
        max: 1.5,
        default: 0.8,
        step: 0.01,
      },
    ],
  },
  {
    type: 'glow',
    name: 'Glow',
    category: 'stylize',
    icon: '✨',
    description: 'Add soft glow to highlights',
    implemented: true,
    parameters: [
      {
        name: 'intensity',
        label: 'Intensity',
        type: 'slider',
        min: 0,
        max: 2,
        default: 0.5,
        step: 0.01,
      },
      {
        name: 'threshold',
        label: 'Threshold',
        type: 'slider',
        min: 0,
        max: 1,
        default: 0.7,
        step: 0.01,
      },
    ],
  },
  {
    type: 'film_grain',
    name: 'Film Grain',
    category: 'stylize',
    icon: '🎞️',
    description: 'Add vintage film grain',
    implemented: true,
    parameters: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'slider',
        min: 0,
        max: 0.5,
        default: 0.1,
        step: 0.01,
      },
      {
        name: 'time',
        label: 'Seed',
        type: 'slider',
        min: 0,
        max: 100,
        default: 0,
        step: 0.1,
      },
    ],
  },
  {
    type: 'chromatic_aberration',
    name: 'Chromatic Aberration',
    category: 'stylize',
    icon: '🌈',
    description: 'RGB color separation',
    implemented: true,
    parameters: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'slider',
        min: 0,
        max: 10,
        default: 2,
        step: 0.1,
      },
    ],
  },
  {
    type: 'lens_flare',
    name: 'Lens Flare',
    category: 'stylize',
    icon: '💫',
    description: 'Add lens flare effect',
  },
  {
    type: 'glitch',
    name: 'Glitch',
    category: 'stylize',
    icon: '⚡',
    description: 'Digital glitch effect',
  },

  // ===== DISTORTION EFFECTS =====
  {
    type: 'transform',
    name: 'Transform',
    category: 'distortion',
    icon: '🔄',
    description: 'Scale, rotate, and position',
  },
  {
    type: 'crop',
    name: 'Crop',
    category: 'distortion',
    icon: '✂️',
    description: 'Crop and reframe',
  },
  {
    type: 'warp',
    name: 'Warp',
    category: 'distortion',
    icon: '🌊',
    description: 'Warp and distort image',
  },
  {
    type: 'lens_distortion',
    name: 'Lens Distortion',
    category: 'distortion',
    icon: '🔍',
    description: 'Barrel/pincushion distortion',
  },
  {
    type: 'ripple',
    name: 'Ripple',
    category: 'distortion',
    icon: '〰️',
    description: 'Water ripple effect',
  },
  {
    type: 'twirl',
    name: 'Twirl',
    category: 'distortion',
    icon: '🌀',
    description: 'Spiral twirl effect',
  },
  {
    type: 'pixelate',
    name: 'Pixelate',
    category: 'distortion',
    icon: '🔲',
    description: 'Mosaic/pixel effect',
    implemented: true,
    parameters: [
      {
        name: 'pixelSize',
        label: 'Pixel Size',
        type: 'slider',
        min: 1,
        max: 50,
        default: 10,
        step: 1,
      },
    ],
  },
  {
    type: 'grayscale',
    name: 'Grayscale',
    category: 'distortion',
    icon: '⚫',
    description: 'Remove color',
    implemented: true,
    parameters: [
      {
        name: 'amount',
        label: 'Amount',
        type: 'slider',
        min: 0,
        max: 1,
        default: 1,
        step: 0.01,
      },
    ],
  },

  // ===== TIME EFFECTS =====
  {
    type: 'time_remap',
    name: 'Speed/Slow Motion',
    category: 'time',
    icon: '⏱️',
    description: 'Change playback speed',
  },
  {
    type: 'echo',
    name: 'Echo',
    category: 'time',
    icon: '👥',
    description: 'Temporal echo effect',
  },
  {
    type: 'strobe',
    name: 'Strobe',
    category: 'time',
    icon: '⚡',
    description: 'Strobe/flicker effect',
  },
  {
    type: 'posterize_time',
    name: 'Posterize Time',
    category: 'time',
    icon: '🎞️',
    description: 'Reduce frame rate',
  },

  // ===== KEYING EFFECTS =====
  {
    type: 'chroma_key',
    name: 'Chroma Key',
    category: 'keying',
    icon: '🟢',
    description: 'Green/blue screen removal',
  },
  {
    type: 'luma_key',
    name: 'Luma Key',
    category: 'keying',
    icon: '⚫',
    description: 'Brightness-based keying',
  },

  // ===== NOISE & REPAIR =====
  {
    type: 'noise_reduction',
    name: 'Noise Reduction',
    category: 'noise',
    icon: '🔇',
    description: 'Reduce video noise',
  },
  {
    type: 'stabilization',
    name: 'Stabilization',
    category: 'noise',
    icon: '📹',
    description: 'Stabilize shaky footage',
  },
  {
    type: 'deflicker',
    name: 'Deflicker',
    category: 'noise',
    icon: '💡',
    description: 'Remove flicker',
  },

  // ===== GENERATE EFFECTS =====
  {
    type: 'solid_color',
    name: 'Solid Color',
    category: 'generate',
    icon: '🎨',
    description: 'Generate solid color',
  },
  {
    type: 'gradient',
    name: 'Gradient',
    category: 'generate',
    icon: '🌈',
    description: 'Generate gradient',
  },
  {
    type: 'noise',
    name: 'Noise',
    category: 'generate',
    icon: '📺',
    description: 'Generate noise pattern',
  },
];

/**
 * Get effects by category
 */
export function getEffectsByCategory(category: EffectCategory | 'all'): EffectDefinition[] {
  if (category === 'all') {
    return ALL_EFFECTS;
  }
  return ALL_EFFECTS.filter((effect) => effect.category === category);
}

/**
 * Search effects
 */
export function searchEffects(query: string): EffectDefinition[] {
  const lowerQuery = query.toLowerCase();
  return ALL_EFFECTS.filter(
    (effect) =>
      effect.name.toLowerCase().includes(lowerQuery) ||
      effect.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get implemented effects only
 */
export function getImplementedEffects(): EffectDefinition[] {
  return ALL_EFFECTS.filter((effect) => effect.implemented);
}

/**
 * Get effect by type
 */
export function getEffectByType(type: EffectType): EffectDefinition | undefined {
  return ALL_EFFECTS.find((effect) => effect.type === type);
}
