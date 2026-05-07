/**
 * OmniCut Media Engine Package
 * Media processing with FFmpeg.wasm
 * @packageDocumentation
 */

// Export FFmpeg manager
export * from './ffmpeg-manager';

// Export browser-based media importer (for web)
export * from './browser-importer';

// Export renderers
export * from './video-renderer';
export * from './effect-renderer';
export * from './transition-renderer';

// Export utilities
export * from './metadata-extractor';
export * from './thumbnail-generator';
export * from './waveform-generator';

// Package version
export const VERSION = '1.0.0-alpha';
