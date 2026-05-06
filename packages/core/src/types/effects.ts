/**
 * Effects and transitions types
 * @module types/effects
 */

/**
 * Effect applied to a clip or track
 */
export interface Effect {
  /** Unique effect identifier */
  id: string;
  /** Effect type */
  type: EffectType;
  /** Display name */
  name: string;
  /** Whether effect is enabled */
  enabled: boolean;
  /** Effect category */
  category: EffectCategory;
  /** Effect parameters */
  parameters: EffectParameter[];
  /** Blend mode (for visual effects) */
  blendMode?: string;
  /** Effect opacity (0-1) */
  opacity?: number;
  /** Mask ID (if effect uses a mask) */
  maskId?: string;
}

/**
 * Effect types
 */
export type EffectType =
  // Color
  | 'color_correction'
  | 'color_grade'
  | 'curves'
  | 'levels'
  | 'hue_saturation'
  | 'color_balance'
  | 'white_balance'
  | 'exposure'
  | 'brightness_contrast'
  | 'vibrance'
  | 'tint'
  // Blur & Sharpen
  | 'blur'
  | 'gaussian_blur'
  | 'motion_blur'
  | 'radial_blur'
  | 'lens_blur'
  | 'sharpen'
  | 'unsharp_mask'
  // Distortion
  | 'transform'
  | 'crop'
  | 'warp'
  | 'lens_distortion'
  | 'ripple'
  | 'twirl'
  | 'bulge'
  // Keying
  | 'chroma_key'
  | 'luma_key'
  | 'difference_matte'
  | 'mask'
  // Stylize
  | 'glow'
  | 'vignette'
  | 'film_grain'
  | 'chromatic_aberration'
  | 'lens_flare'
  | 'glitch'
  // Noise & Repair
  | 'noise_reduction'
  | 'stabilization'
  | 'deflicker'
  | 'deband'
  // Time
  | 'time_remap'
  | 'echo'
  | 'strobe'
  | 'posterize_time'
  // Transition
  | 'transition'
  // Generate
  | 'solid_color'
  | 'gradient'
  | 'noise'
  // Text & Graphics
  | 'text'
  | 'shape'
  | 'overlay'
  // Audio
  | 'audio_eq'
  | 'audio_compress'
  | 'audio_reverb'
  | 'audio_delay'
  | 'audio_denoise'
  | 'audio_pitch'
  | 'audio_normalize'
  // Plugin
  | 'plugin';

/**
 * Effect categories for organization
 */
export type EffectCategory =
  | 'color'
  | 'blur'
  | 'distortion'
  | 'keying'
  | 'stylize'
  | 'noise'
  | 'time'
  | 'transition'
  | 'generate'
  | 'text'
  | 'audio'
  | 'plugin';

/**
 * Effect parameter definition
 */
export interface EffectParameter {
  /** Parameter identifier */
  id: string;
  /** Display name */
  name: string;
  /** Parameter type */
  type: EffectParameterType;
  /** Current value */
  value: EffectParameterValue;
  /** Default value */
  defaultValue: EffectParameterValue;
  /** Minimum value (for numeric types) */
  min?: number;
  /** Maximum value (for numeric types) */
  max?: number;
  /** Step size (for numeric types) */
  step?: number;
  /** Available options (for choice types) */
  options?: Array<{ label: string; value: string | number }>;
  /** Whether parameter is animatable */
  animatable: boolean;
  /** Parameter unit (e.g., 'px', '%', 'deg') */
  unit?: string;
  /** Parameter description */
  description?: string;
}

/**
 * Effect parameter types
 */
export type EffectParameterType =
  | 'number'
  | 'slider'
  | 'angle'
  | 'color'
  | 'boolean'
  | 'choice'
  | 'text'
  | 'point'
  | 'size';

/**
 * Effect parameter value types
 */
export type EffectParameterValue =
  | number
  | string
  | boolean
  | { x: number; y: number }
  | { width: number; height: number }
  | number[];

/**
 * Transition types
 */
export type TransitionType =
  // Dissolve
  | 'cross_dissolve'
  | 'dip_to_black'
  | 'dip_to_white'
  | 'dip_to_color'
  | 'additive_dissolve'
  // Wipe
  | 'wipe_left'
  | 'wipe_right'
  | 'wipe_up'
  | 'wipe_down'
  | 'radial_wipe'
  | 'box_wipe'
  | 'iris_wipe'
  // Slide
  | 'push_left'
  | 'push_right'
  | 'push_up'
  | 'push_down'
  | 'slide_left'
  | 'slide_right'
  // Zoom
  | 'cross_zoom'
  | 'zoom_in'
  | 'zoom_out'
  // 3D
  | 'flip_horizontal'
  | 'flip_vertical'
  | 'cube_rotate'
  | 'page_turn'
  // Blur
  | 'blur_dissolve'
  | 'whip_pan'
  // Light
  | 'flash'
  | 'exposure_fade'
  // Glitch
  | 'rgb_split'
  | 'digital_glitch'
  // Custom
  | 'stinger';

/**
 * Transition definition
 */
export interface Transition {
  /** Unique transition identifier */
  id: string;
  /** Transition type */
  type: TransitionType;
  /** Display name */
  name: string;
  /** Duration in seconds */
  duration: number;
  /** Alignment relative to cut point */
  alignment: 'start' | 'center' | 'end';
  /** Easing function */
  easing: EasingFunction;
  /** Whether to reverse the transition */
  reverse: boolean;
  /** Custom parameters */
  parameters: EffectParameter[];
}

/**
 * Easing functions for animations
 */
export type EasingFunction =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quart'
  | 'ease-out-quart'
  | 'ease-in-out-quart'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-out-back'
  | 'ease-in-elastic'
  | 'ease-out-elastic'
  | 'ease-in-out-elastic'
  | 'ease-in-bounce'
  | 'ease-out-bounce'
  | 'ease-in-out-bounce';

/**
 * Create a default effect parameter
 */
export function createEffectParameter(
  id: string,
  name: string,
  type: EffectParameterType,
  defaultValue: EffectParameterValue,
  options?: Partial<EffectParameter>
): EffectParameter {
  return {
    id,
    name,
    type,
    value: defaultValue,
    defaultValue,
    animatable: true,
    ...options,
  };
}

/**
 * Get effect category from effect type
 */
export function getEffectCategory(type: EffectType): EffectCategory {
  if (type.startsWith('audio_')) return 'audio';
  if (type.includes('blur') || type.includes('sharpen')) return 'blur';
  if (type.includes('color') || type.includes('hue') || type.includes('exposure')) return 'color';
  if (type.includes('key') || type === 'mask') return 'keying';
  if (type.includes('warp') || type.includes('distortion') || type === 'transform') return 'distortion';
  if (type.includes('noise') || type === 'stabilization' || type === 'deflicker') return 'noise';
  if (type.includes('time') || type === 'echo' || type === 'strobe') return 'time';
  if (type === 'transition') return 'transition';
  if (type.includes('gradient') || type.includes('solid') || type === 'noise') return 'generate';
  if (type === 'text' || type === 'shape' || type === 'overlay') return 'text';
  if (type === 'glow' || type === 'vignette' || type.includes('grain') || type.includes('lens')) return 'stylize';
  return 'plugin';
}
