/**
 * Audio mixing and effects types
 * @module types/audio
 */

import type { Effect } from './effects';

/**
 * Audio mixer state
 */
export interface AudioMixerState {
  /** Audio channels (one per audio track) */
  channels: AudioChannel[];
  /** Submix buses */
  buses: AudioBus[];
  /** Master bus */
  masterBus: AudioBus;
}

/**
 * Audio channel (mixer strip)
 */
export interface AudioChannel {
  /** Unique channel identifier */
  id: string;
  /** Channel name */
  name: string;
  /** Track ID this channel controls */
  trackId: string;
  /** Volume in dB (-∞ to +12) */
  volume: number;
  /** Pan (-1 = left, 0 = center, 1 = right) */
  pan: number;
  /** Whether channel is muted */
  muted: boolean;
  /** Whether channel is soloed */
  solo: boolean;
  /** Whether channel is armed for recording */
  armed: boolean;
  /** Insert effects */
  effects: Effect[];
  /** Aux sends */
  sends: AuxSend[];
  /** Output routing */
  output: string; // bus ID or 'master'
  /** Current peak level (0-1) */
  peakLevel: number;
  /** Current RMS level (0-1) */
  rmsLevel: number;
}

/**
 * Audio bus (submix)
 */
export interface AudioBus {
  /** Unique bus identifier */
  id: string;
  /** Bus name */
  name: string;
  /** Volume in dB */
  volume: number;
  /** Pan */
  pan: number;
  /** Whether bus is muted */
  muted: boolean;
  /** Whether bus is soloed */
  solo: boolean;
  /** Insert effects */
  effects: Effect[];
  /** Output routing */
  output: string; // another bus ID or 'master'
}

/**
 * Aux send
 */
export interface AuxSend {
  /** Target bus ID */
  busId: string;
  /** Send level in dB (-∞ to +12) */
  level: number;
  /** Whether send is pre-fader */
  preFader: boolean;
  /** Whether send is muted */
  muted: boolean;
}

/**
 * Audio effect parameter types
 */
export interface AudioEffectParameter {
  /** Parameter identifier */
  id: string;
  /** Display name */
  name: string;
  /** Current value */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Default value */
  default: number;
  /** Parameter unit */
  unit: string;
  /** Whether parameter is automatable */
  automatable: boolean;
}

/**
 * EQ band
 */
export interface EQBand {
  /** Band type */
  type: 'highpass' | 'lowpass' | 'bell' | 'shelf-high' | 'shelf-low' | 'notch';
  /** Frequency in Hz */
  frequency: number;
  /** Gain in dB (for bell and shelf types) */
  gain: number;
  /** Q factor (bandwidth) */
  q: number;
  /** Whether band is enabled */
  enabled: boolean;
}

/**
 * Compressor settings
 */
export interface CompressorSettings {
  /** Threshold in dBFS */
  threshold: number;
  /** Ratio (1:1 to ∞:1) */
  ratio: number;
  /** Attack time in ms */
  attack: number;
  /** Release time in ms */
  release: number;
  /** Knee in dB */
  knee: number;
  /** Makeup gain in dB */
  makeupGain: number;
  /** Lookahead in ms */
  lookahead: number;
}

/**
 * Reverb settings
 */
export interface ReverbSettings {
  /** Room size (0-1) */
  roomSize: number;
  /** Pre-delay in ms */
  preDelay: number;
  /** Decay time (RT60) in seconds */
  decayTime: number;
  /** High frequency damping (0-1) */
  damping: number;
  /** Low frequency damping (0-1) */
  lowDamping: number;
  /** Diffusion (0-1) */
  diffusion: number;
  /** Dry/wet mix (0-1) */
  mix: number;
}

/**
 * Delay settings
 */
export interface DelaySettings {
  /** Delay time in ms or BPM-synced */
  time: number;
  /** Whether time is BPM-synced */
  sync: boolean;
  /** Feedback amount (0-1) */
  feedback: number;
  /** Dry/wet mix (0-1) */
  mix: number;
  /** Whether ping-pong mode is enabled */
  pingPong: boolean;
}

/**
 * Loudness metering (LUFS)
 */
export interface LoudnessMetering {
  /** Momentary loudness (400ms) */
  momentary: number;
  /** Short-term loudness (3s) */
  shortTerm: number;
  /** Integrated loudness (entire program) */
  integrated: number;
  /** Loudness range (LRA) */
  range: number;
  /** True peak level */
  truePeak: number;
}

/**
 * Create default audio channel
 */
export function createDefaultAudioChannel(trackId: string, name: string): Omit<AudioChannel, 'id'> {
  return {
    name,
    trackId,
    volume: 0, // 0 dB
    pan: 0, // center
    muted: false,
    solo: false,
    armed: false,
    effects: [],
    sends: [],
    output: 'master',
    peakLevel: 0,
    rmsLevel: 0,
  };
}

/**
 * Convert linear gain to dB
 */
export function linearToDb(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

/**
 * Convert dB to linear gain
 */
export function dbToLinear(db: number): number {
  if (db === -Infinity) return 0;
  return Math.pow(10, db / 20);
}

/**
 * Convert pan value to stereo gains
 */
export function panToGains(pan: number): { left: number; right: number } {
  // Constant power panning
  const angle = (pan + 1) * (Math.PI / 4); // -1 to 1 -> 0 to π/2
  return {
    left: Math.cos(angle),
    right: Math.sin(angle),
  };
}
