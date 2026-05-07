/**
 * OmniCut Media Engine Package
 * Media processing with FFmpeg.wasm
 * @packageDocumentation
 */

// Export FFmpeg manager
export * from './ffmpeg-manager';

// Export media importer
export * from './media-importer';
export * from './browser-importer';

// Export utilities
export * from './metadata-extractor';
export * from './thumbnail-generator';
export * from './waveform-generator';

// Package version
export const VERSION = '1.0.0-alpha';
