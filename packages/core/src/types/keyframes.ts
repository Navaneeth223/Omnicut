/**
 * Keyframe animation types
 * @module types/keyframes
 */

/**
 * A track of keyframes for a single parameter
 */
export interface KeyframeTrack {
  /** Parameter identifier this track animates */
  parameterId: string;
  /** All keyframes in this track */
  keyframes: Keyframe[];
  /** Default interpolation type */
  interpolation: InterpolationType;
}

/**
 * A single keyframe
 */
export interface Keyframe {
  /** Unique keyframe identifier */
  id: string;
  /** Time position in seconds */
  time: number;
  /** Keyframe value (can be number, array, or string) */
  value: number | number[] | string;
  /** Easing function for interpolation to next keyframe */
  easing: EasingFunction;
  /** Bezier handle in (for bezier interpolation) */
  handleIn?: BezierHandle;
  /** Bezier handle out (for bezier interpolation) */
  handleOut?: BezierHandle;
}

/**
 * Interpolation types between keyframes
 */
export type InterpolationType =
  | 'linear'
  | 'bezier'
  | 'auto-bezier'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'hold';

/**
 * Easing function types
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
  | 'ease-in-out-bounce'
  | 'hold';

/**
 * Bezier handle for custom curve control
 */
export interface BezierHandle {
  /** X offset from keyframe time */
  x: number;
  /** Y offset from keyframe value */
  y: number;
}

/**
 * Create a default keyframe
 */
export function createKeyframe(
  time: number,
  value: number | number[] | string,
  easing: EasingFunction = 'linear'
): Omit<Keyframe, 'id'> {
  return {
    time,
    value,
    easing,
  };
}

/**
 * Interpolate between two keyframes at a given time
 */
export function interpolateKeyframes(
  keyframe1: Keyframe,
  keyframe2: Keyframe,
  time: number,
  interpolation: InterpolationType
): number | number[] | string {
  // If time is before first keyframe, return first value
  if (time <= keyframe1.time) {
    return keyframe1.value;
  }

  // If time is after second keyframe, return second value
  if (time >= keyframe2.time) {
    return keyframe2.value;
  }

  // Hold interpolation - return first value until second keyframe
  if (interpolation === 'hold') {
    return keyframe1.value;
  }

  // Calculate normalized time (0-1) between keyframes
  const t = (time - keyframe1.time) / (keyframe2.time - keyframe1.time);

  // Handle string values (no interpolation)
  if (typeof keyframe1.value === 'string' || typeof keyframe2.value === 'string') {
    return t < 0.5 ? keyframe1.value : keyframe2.value;
  }

  // Handle array values (interpolate each component)
  if (Array.isArray(keyframe1.value) && Array.isArray(keyframe2.value)) {
    return keyframe1.value.map((v1, i) => {
      const v2 = keyframe2.value[i] as number;
      return interpolateNumber(v1, v2, t, keyframe1.easing);
    });
  }

  // Handle number values
  if (typeof keyframe1.value === 'number' && typeof keyframe2.value === 'number') {
    return interpolateNumber(keyframe1.value, keyframe2.value, t, keyframe1.easing);
  }

  return keyframe1.value;
}

/**
 * Interpolate between two numbers with easing
 */
function interpolateNumber(
  start: number,
  end: number,
  t: number,
  easing: EasingFunction
): number {
  const easedT = applyEasing(t, easing);
  return start + (end - start) * easedT;
}

/**
 * Apply easing function to normalized time
 */
function applyEasing(t: number, easing: EasingFunction): number {
  switch (easing) {
    case 'linear':
      return t;
    case 'ease-in':
    case 'ease-in-quad':
      return t * t;
    case 'ease-out':
    case 'ease-out-quad':
      return t * (2 - t);
    case 'ease-in-out':
    case 'ease-in-out-quad':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'ease-in-cubic':
      return t * t * t;
    case 'ease-out-cubic':
      return --t * t * t + 1;
    case 'ease-in-out-cubic':
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    case 'ease-in-quart':
      return t * t * t * t;
    case 'ease-out-quart':
      return 1 - --t * t * t * t;
    case 'ease-in-out-quart':
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    case 'ease-in-expo':
      return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    case 'ease-out-expo':
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    case 'ease-in-out-expo':
      if (t === 0 || t === 1) return t;
      return t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
    case 'ease-in-back': {
      const c1 = 1.70158;
      return (c1 + 1) * t * t * t - c1 * t * t;
    }
    case 'ease-out-back': {
      const c1 = 1.70158;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    case 'ease-in-out-back': {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
    case 'ease-in-elastic': {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    }
    case 'ease-out-elastic': {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    case 'ease-in-out-elastic': {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    }
    case 'ease-in-bounce':
      return 1 - applyEasing(1 - t, 'ease-out-bounce');
    case 'ease-out-bounce': {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    }
    case 'ease-in-out-bounce':
      return t < 0.5
        ? (1 - applyEasing(1 - 2 * t, 'ease-out-bounce')) / 2
        : (1 + applyEasing(2 * t - 1, 'ease-out-bounce')) / 2;
    case 'hold':
      return 0;
    default:
      return t;
  }
}

/**
 * Find keyframes surrounding a given time
 */
export function findSurroundingKeyframes(
  track: KeyframeTrack,
  time: number
): [Keyframe | null, Keyframe | null] {
  const sortedKeyframes = [...track.keyframes].sort((a, b) => a.time - b.time);

  let before: Keyframe | null = null;
  let after: Keyframe | null = null;

  for (const keyframe of sortedKeyframes) {
    if (keyframe.time <= time) {
      before = keyframe;
    } else if (keyframe.time > time && !after) {
      after = keyframe;
      break;
    }
  }

  return [before, after];
}

/**
 * Get interpolated value at a specific time
 */
export function getValueAtTime(
  track: KeyframeTrack,
  time: number
): number | number[] | string | null {
  if (track.keyframes.length === 0) {
    return null;
  }

  const [before, after] = findSurroundingKeyframes(track, time);

  // If no keyframes before, return first keyframe value
  if (!before) {
    return track.keyframes[0]?.value ?? null;
  }

  // If no keyframes after, return last keyframe value
  if (!after) {
    return before.value;
  }

  // Interpolate between keyframes
  return interpolateKeyframes(before, after, time, track.interpolation);
}
