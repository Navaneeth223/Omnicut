# Architecture Overview

This document provides a high-level overview of OmniCut's architecture.

## Design Principles

1. **Modularity** - Each feature is a self-contained package
2. **Type Safety** - Strict TypeScript with no `any` types
3. **Performance** - GPU acceleration, Web Workers, WASM
4. **Offline-First** - Works without internet connection
5. **Cross-Platform** - One codebase for web, desktop, and mobile

## Technology Stack

### Frontend
- **React 18** - UI framework with concurrent features
- **TypeScript 5** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Zustand** - Global state management
- **Jotai** - Atomic state management
- **React Query** - Async state and caching
- **Framer Motion** - Animations

### Media Processing
- **FFmpeg.wasm** - Video/audio encoding and decoding
- **Web Audio API** - Real-time audio processing
- **WebGL/WebGPU** - GPU-accelerated video effects
- **Canvas API** - 2D graphics and compositing
- **Web Workers** - Parallel processing

### Backend (Optional)
- **Node.js 20** - Runtime
- **Fastify** - HTTP server
- **tRPC** - Type-safe API
- **SQLite/PostgreSQL** - Database
- **Redis** - Caching and job queue

### Desktop
- **Electron** - Native desktop wrapper
- **Native APIs** - File system, GPU, notifications

### Mobile
- **Capacitor** - Native mobile wrapper
- **Native Plugins** - Camera, microphone, file system

## Architecture Layers

### 1. Core Layer (`packages/core`)

The foundation of OmniCut. Contains:
- Type definitions for all data structures
- Utility functions (time, ID generation, validation)
- Business logic that's shared across all platforms
- No UI code, no platform-specific code

**Key Files:**
- `types/project.ts` - Project data structure
- `types/timeline.ts` - Timeline, tracks, clips
- `types/media.ts` - Media pool and items
- `types/effects.ts` - Effects and transitions
- `utils/time.ts` - Time and timecode utilities

### 2. Engine Layer

Specialized packages for media processing:

#### Media Engine (`packages/media-engine`)
- FFmpeg.wasm integration
- Codec detection and transcoding
- Proxy generation
- Thumbnail extraction
- Metadata parsing

#### Audio Engine (`packages/audio-engine`)
- Web Audio API wrapper
- DSP effects (EQ, compression, reverb)
- Audio analysis (waveform, spectrum)
- MIDI processing
- Virtual instruments

#### Video Engine (`packages/video-engine`)
- Timeline compositor
- GPU shader effects
- Color grading pipeline
- Video stabilization
- Frame caching

#### Image Engine (`packages/image-engine`)
- Layer-based editing
- RAW photo processing
- Filters and adjustments
- Content-aware tools

### 3. UI Layer

#### UI Package (`packages/ui`)
- Design system components
- Reusable UI primitives
- Theme system
- Accessibility utilities

#### Timeline Package (`packages/timeline`)
- Timeline UI component
- Track rendering
- Clip manipulation
- Playhead and scrubbing
- Zoom and scroll

### 4. Application Layer

#### Web App (`apps/web`)
- Main React application
- Workspace layouts
- Panels and views
- Keyboard shortcuts
- State management

#### Desktop App (`apps/desktop`)
- Electron wrapper
- Native menu bar
- File associations
- Auto-updater
- System integration

#### Mobile App (`apps/mobile`)
- Capacitor wrapper
- Touch-optimized UI
- Native camera/mic access
- Mobile-specific features

### 5. Plugin Layer

#### Plugin API (`packages/plugin-api`)
- Public plugin interface
- Effect registration
- Panel registration
- Event system
- Sandboxing

## Data Flow

### 1. Project Loading

```
User opens project file
  ↓
Parse JSON
  ↓
Validate schema (Zod)
  ↓
Load into Zustand store
  ↓
Trigger React re-render
  ↓
UI updates
```

### 2. Media Import

```
User selects files
  ↓
Read file metadata (FFmpeg.wasm)
  ↓
Generate thumbnail (Web Worker)
  ↓
Add to media pool (Zustand)
  ↓
Optionally generate proxy (background)
```

### 3. Timeline Playback

```
User presses play
  ↓
Start requestAnimationFrame loop
  ↓
For each frame:
  - Decode video frame (FFmpeg.wasm)
  - Apply effects (WebGL shaders)
  - Composite layers (Canvas API)
  - Mix audio (Web Audio API)
  - Render to canvas
  ↓
Update playhead position
  ↓
Repeat until stopped
```

### 4. Export

```
User clicks export
  ↓
Create export job (Zustand)
  ↓
Start background worker
  ↓
For each frame:
  - Render frame (same as playback)
  - Encode frame (FFmpeg.wasm)
  - Update progress
  ↓
Finalize file
  ↓
Notify user
```

## State Management

### Global State (Zustand)

```typescript
// Project store
interface ProjectStore {
  project: OmniCutProject | null;
  loadProject: (path: string) => Promise<void>;
  saveProject: () => Promise<void>;
  updateSettings: (settings: Partial<ProjectSettings>) => void;
}

// Timeline store
interface TimelineStore {
  playhead: number;
  playing: boolean;
  selectedClips: string[];
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

// Media pool store
interface MediaPoolStore {
  items: MediaItem[];
  selectedItems: string[];
  importMedia: (files: File[]) => Promise<void>;
  deleteMedia: (ids: string[]) => void;
}
```

### Local State (Jotai)

Used for UI-specific state that doesn't need to be global:
- Panel sizes
- Scroll positions
- Temporary selections
- Form inputs

### Async State (React Query)

Used for data fetching and caching:
- Cloud project sync
- Plugin marketplace
- Asset libraries
- User preferences

## Performance Optimizations

### 1. Virtual Rendering
Only render visible clips in the timeline viewport.

### 2. Frame Caching
Cache decoded and rendered frames in memory (LRU cache).

### 3. Web Workers
Offload heavy processing to background threads:
- Video decoding
- Audio analysis
- Thumbnail generation
- Export rendering

### 4. GPU Acceleration
Use WebGL/WebGPU for:
- Video effects
- Color grading
- Compositing
- Real-time preview

### 5. Code Splitting
Lazy load features:
- Color grading suite
- Audio mixer
- Photo editor
- Plugin system

### 6. Proxy Workflow
Generate lower-resolution proxy files for smooth editing.

## Security

### 1. Input Validation
All user input validated with Zod schemas.

### 2. Plugin Sandboxing
Plugins run in isolated contexts with limited permissions.

### 3. File System Access
Desktop app uses Electron's context isolation.

### 4. Content Security Policy
Web app uses strict CSP headers.

## Testing Strategy

### Unit Tests (Vitest)
- Pure functions
- Utility functions
- State management
- Business logic

### Integration Tests
- Media import flow
- Timeline operations
- Export process
- Plugin system

### E2E Tests (Playwright)
- Complete workflows
- Cross-browser testing
- Performance benchmarks

### Visual Regression Tests
- UI component snapshots
- Timeline rendering
- Color grading accuracy

## Deployment

### Web App
- Build: `pnpm build`
- Deploy to: Vercel, Netlify, or static hosting
- CDN for assets

### Desktop App
- Build: `electron-builder`
- Distribute: GitHub Releases, website
- Auto-update: electron-updater

### Mobile App
- Build: Capacitor
- Distribute: App Store, Play Store

## Future Architecture Considerations

### WebAssembly Modules
- Rust-compiled WASM for hot paths
- Custom codecs
- Advanced algorithms

### WebGPU
- Replace WebGL for better performance
- Compute shaders for effects
- ML model inference

### Collaborative Editing
- WebRTC for real-time sync
- Operational transforms
- Conflict resolution

### Cloud Rendering
- Offload heavy exports to cloud
- Distributed rendering
- GPU instances
