# OmniCut Roadmap

This document outlines the development roadmap for OmniCut.

## Phase 1: Foundation (Months 1-3) ✅ In Progress

**Goal:** Build the core infrastructure and minimal viable editor.

### Week 1-2: Project Setup ✅
- [x] Monorepo structure
- [x] TypeScript configuration
- [x] Build tooling (Vite, Turbo)
- [x] CI/CD pipeline
- [x] Documentation structure

### Week 3-4: Core Types & Media Import
- [ ] Complete type definitions
- [ ] FFmpeg.wasm integration
- [ ] File import dialog
- [ ] Media pool UI
- [ ] Thumbnail generation
- [ ] Metadata extraction

### Week 5-6: Basic Timeline
- [ ] Timeline UI component
- [ ] 2 video tracks, 2 audio tracks
- [ ] Drag and drop clips
- [ ] Basic playback (play/pause)
- [ ] Scrubbing
- [ ] Zoom and scroll

### Week 7-8: Basic Export
- [ ] Export dialog
- [ ] H.264 encoding
- [ ] AAC audio encoding
- [ ] Progress indicator
- [ ] Background export

### Week 9-10: Basic Effects
- [ ] Effect panel UI
- [ ] Blur effect
- [ ] Brightness/Contrast
- [ ] Saturation
- [ ] Effect preview

### Week 11-12: Project Management
- [ ] Save project (.omnicut format)
- [ ] Load project
- [ ] Auto-save
- [ ] Undo/redo system (200 steps)
- [ ] Project templates

**Deliverable:** Minimal viable editor that can import media, edit on timeline, and export.

## Phase 2: Core Editing (Months 4-6)

**Goal:** Feature-complete NLE with professional editing tools.

### Month 4: Advanced Timeline
- [ ] Unlimited tracks
- [ ] Track operations (add, delete, reorder)
- [ ] Ripple edit
- [ ] Roll edit
- [ ] Slip edit
- [ ] Slide edit
- [ ] Razor tool
- [ ] Multi-clip selection
- [ ] Keyboard shortcuts (J/K/L, I/O, etc.)

### Month 5: Transitions & Text
- [ ] 50+ video transitions
- [ ] Audio crossfades
- [ ] Transition duration control
- [ ] Text tool
- [ ] Title templates (20+)
- [ ] Text animation presets
- [ ] Subtitle import/export

### Month 6: Audio & Proxy
- [ ] Waveform display
- [ ] Audio volume control
- [ ] Audio fade handles
- [ ] Proxy workflow
- [ ] Proxy generation
- [ ] Proxy toggle
- [ ] Performance optimization

**Deliverable:** Professional NLE comparable to basic Premiere Pro.

## Phase 3: Advanced Features (Months 7-12)

**Goal:** Production-grade suite with color, audio, and AI features.

### Month 7-8: Color Grading
- [ ] Color wheels (lift/gamma/gain)
- [ ] Curves (RGB + individual channels)
- [ ] LUT support (import/apply)
- [ ] HSL qualifier
- [ ] Power windows
- [ ] Scopes (waveform, vectorscope, histogram)
- [ ] Color grading workspace

### Month 9-10: Audio Mixer
- [ ] Mixing console UI
- [ ] Channel strips
- [ ] 20+ audio effects (EQ, compression, reverb)
- [ ] Automation lanes
- [ ] VU meters
- [ ] Loudness metering (LUFS)
- [ ] Audio workspace

### Month 11: Motion Graphics
- [ ] Keyframe animation
- [ ] Bezier curves
- [ ] Motion path editor
- [ ] Shape layers
- [ ] Particle system (basic)
- [ ] Expression system

### Month 12: AI Features
- [ ] Auto-transcription (Whisper.wasm)
- [ ] Background removal
- [ ] Scene detection
- [ ] Audio noise reduction (AI)
- [ ] Auto-reframe
- [ ] Face detection

**Deliverable:** Full production suite (beta).

## Phase 4: Platform & Polish (Months 13-18)

**Goal:** Cross-platform launch with desktop and mobile apps.

### Month 13-14: Desktop App
- [ ] Electron setup
- [ ] Native menu bar
- [ ] File associations
- [ ] Hardware acceleration
- [ ] Auto-updater
- [ ] Build for macOS, Windows, Linux

### Month 15-16: Mobile App
- [ ] Capacitor setup
- [ ] Touch-optimized UI
- [ ] Camera integration
- [ ] Mobile export presets
- [ ] Build for iOS and Android

### Month 17: Performance & Testing
- [ ] Performance optimization pass
- [ ] Memory leak fixes
- [ ] GPU optimization
- [ ] Complete test suite (80%+ coverage)
- [ ] E2E tests for all workflows
- [ ] Performance benchmarks

### Month 18: Documentation & Launch
- [ ] Complete user documentation
- [ ] Video tutorials (30+)
- [ ] Plugin development guide
- [ ] API documentation
- [ ] Marketing website
- [ ] v1.0 public release

**Deliverable:** v1.0 on all platforms (web, desktop, mobile).

## Phase 5: Community & Growth (Ongoing)

**Goal:** Build community, ecosystem, and enterprise features.

### Community
- [ ] Plugin marketplace
- [ ] Community forums
- [ ] Discord server
- [ ] YouTube channel
- [ ] Social media presence

### Ecosystem
- [ ] 50+ official plugins
- [ ] Community plugin submissions
- [ ] Asset library (LUTs, templates, presets)
- [ ] Integration with stock footage sites
- [ ] Integration with cloud storage

### Enterprise Features (Optional)
- [ ] Team collaboration
- [ ] Cloud project sync
- [ ] Version control
- [ ] Review and approval workflow
- [ ] SSO authentication
- [ ] Admin dashboard

### Performance
- [ ] WebGPU support
- [ ] Native codec modules
- [ ] Distributed rendering
- [ ] Cloud export

## Feature Requests

Vote on features at [github.com/omnicut/omnicut/discussions](https://github.com/omnicut/omnicut/discussions)

### Most Requested
1. Multi-camera editing
2. 360° video support
3. VR editing
4. Live streaming integration
5. Advanced motion tracking
6. 3D compositing
7. Advanced audio repair
8. Automatic editing (AI)
9. Collaborative editing
10. Mobile editing

## Version History

- **v1.0.0-alpha** (Current) - Foundation phase
- **v1.0.0-beta** (Month 12) - Feature complete
- **v1.0.0** (Month 18) - Public release
- **v1.1.0** (Month 24) - Community features
- **v2.0.0** (Month 36) - Enterprise features

## Contributing to the Roadmap

We welcome community input! To suggest features:

1. Check [existing discussions](https://github.com/omnicut/omnicut/discussions)
2. Create a new discussion with your idea
3. Explain the use case and benefits
4. Community votes on features
5. Top-voted features get prioritized

## Stay Updated

- **GitHub**: Watch the repository for updates
- **Discord**: Join for real-time discussions
- **Twitter**: Follow [@omnicutapp](https://twitter.com/omnicutapp)
- **Newsletter**: Subscribe at [omnicut.app](https://omnicut.app)
