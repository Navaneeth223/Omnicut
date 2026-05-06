# Changelog

All notable changes to OmniCut will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### To Be Implemented
- FFmpeg.wasm integration for actual video rendering
- Effect preview in viewer
- Transition preview on timeline
- Audio mixing features
- Color grading tools
- Plugin system activation

## [1.0.0-alpha.7] - 2026-05-06

### Added - Session 7: Effects, Transitions & Parameters
- **Razor Tool**: Split clips at playhead with C key
- **Effect System**: 10 professional video effects
  - Brightness & Contrast
  - Hue & Saturation
  - Exposure
  - Gaussian Blur
  - Sharpen
  - Vignette
  - Glow
  - Film Grain
  - Transform
  - Crop
- **Effect UI**: Effect browser with search and category filtering
- **Effect Parameters**: Interactive controls (sliders, color pickers, angle controls)
- **Transition System**: 12 professional transitions
  - Cross Dissolve, Fade
  - Dip to Black/White
  - Wipe Left/Right/Up/Down
  - Push Left/Right
  - Zoom In/Out
- **Transition UI**: Transition browser with duration control
- **Undo/Redo Integration**: All new features support undo/redo
- **Command Pattern**: 6 new command types for effects and transitions
- **Enhanced Settings**: Comprehensive keyboard shortcuts reference
- **Documentation**: Project status report, handoff guide, enhanced contributing guide

### Changed
- Updated Settings dialog with organized keyboard shortcuts
- Enhanced CONTRIBUTING.md with detailed guidelines
- Updated README with current feature status

## [1.0.0-alpha.6] - 2026-05-06

### Added - Session 6: Auto-Save & Settings
- **Auto-Save System**: Configurable auto-save with intervals (10s to 5min)
- **Auto-Save Indicator**: Status bar indicator showing save status
- **Settings Dialog**: Multi-tab settings interface
  - General tab: Auto-save configuration
  - Shortcuts tab: Keyboard shortcuts reference
  - Advanced tab: History size, timeline settings, about info
- **Settings Button**: Menu bar button to open settings

### Changed
- Enhanced status bar with auto-save information
- Improved project state management

## [1.0.0-alpha.5] - 2026-05-06

### Added - Session 5: Undo/Redo System
- **Command Pattern**: Architecture for undo/redo operations
- **History Store**: 200-level command history stack
- **Undo/Redo Operations**: Cmd+Z and Cmd+Shift+Z support
- **Command Utilities**: Helper functions for common operations
  - Add clip command
  - Remove clip command
  - Update clip command
  - Move clip command
  - Add track command
  - Paste clips command
- **UI Integration**: Undo/redo buttons in menu bar with tooltips
- **Command Descriptions**: Clear action descriptions in tooltips

### Changed
- All editing operations now support undo/redo
- Enhanced menu bar with undo/redo controls

## [1.0.0-alpha.4] - 2026-05-06

### Added - Session 4: Export System
- **Export Dialog**: Professional export interface
- **Export Presets**: YouTube 1080p/4K, Instagram, Twitter, Web Optimized
- **Format Selection**: MP4, WebM, MOV support
- **Codec Selection**: H.264, H.265, VP9 support
- **Quality Settings**: Resolution, frame rate, bitrate configuration
- **Audio Settings**: Codec and bitrate selection
- **Export Range**: Full timeline or custom range
- **File Size Estimation**: Approximate output file size
- **Progress Tracking**: Export progress UI
- **Keyboard Shortcut**: Cmd+E to open export dialog

### Changed
- Enhanced menu bar with export button
- Improved project state management

## [1.0.0-alpha.3] - 2026-05-06

### Added - Session 3: Professional Tools
- **Collision Detection**: Prevents clip overlaps with visual feedback
- **Ripple Edit Mode**: Automatic gap management
- **Ripple Delete**: Remove clip and close gap
- **Find Available Space**: Algorithm to find gaps for clips
- **Timeline Duration Management**: Auto-adjusts timeline duration
- **Visual Feedback**: Red outline for invalid clip positions

### Changed
- Enhanced timeline with collision detection
- Improved clip movement logic
- Better timeline duration handling

## [1.0.0-alpha.2] - 2026-05-06

### Added - Session 2: Advanced Editing
- **Magnetic Snapping**: Clips snap to playhead and other clips
- **Snap Indicator**: Yellow visual indicator for snap points
- **Copy/Cut/Paste**: Cmd+C/X/V support for clips
- **Duplicate Clips**: Duplicate functionality
- **Track Controls**: Mute/solo/lock buttons with active states
- **Select All**: Cmd+A to select all clips
- **Enhanced Delete**: Improved delete functionality

### Changed
- Enhanced timeline with snapping system
- Improved track controls with visual feedback
- Better clipboard management

## [1.0.0-alpha.1] - 2026-05-06

### Added - Session 1: Core Editing
- **Double-Click to Add**: Double-click media to add to timeline
- **Clip Trimming**: Resize handles for trimming clips
  - Three drag modes: move, trim-left, trim-right
- **Context Menu System**: Reusable context menu component
- **Media Pool Context Menus**: Right-click menus for media items
- **Timeline Clip Context Menus**: Right-click menus for clips
- **Delete Key Support**: Delete selected clips and media

### Changed
- Enhanced timeline with clip trimming
- Improved media pool with context menus
- Better clip interaction

### Fixed
- Clip dragging event listeners
- Timeline clip selection

## [1.0.0-alpha.0] - 2026-05-06

### Added - Foundation
- **Project Structure**: Monorepo with pnpm workspaces
- **Core Package**: Type definitions and utilities
  - Project types
  - Timeline types
  - Media types
  - Effect types
  - Keyframe types
  - Color types
  - Audio types
  - Export types
  - Plugin types
- **Store Package**: State management with Zustand
  - Timeline store
  - Media pool store
  - Project store
  - History store
- **Media Engine Package**: FFmpeg.wasm integration (structure)
- **Web App**: React + Vite application
  - Professional UI layout
  - Menu bar with logo and navigation
  - Workspace tabs (Edit, Color, Audio, Photo)
  - Three-panel layout (Media Pool, Viewer/Timeline, Inspector)
  - Timeline with multi-track support
  - Media pool with grid/list views
  - Viewer with playback controls
  - Status bar
- **Timeline Features**:
  - Multi-track timeline (unlimited tracks)
  - Draggable clips
  - Timeline ruler with timecode
  - Playhead with frame-accurate positioning
  - Zoom and scroll controls
  - Track headers with controls
  - Click to seek
- **Media Pool Features**:
  - Grid and list view modes
  - Import dialog with drag-and-drop
  - Search functionality
  - Filter by type
  - Sort options
  - Multi-selection (Cmd+Click, Shift+Click)
- **Playback Features**:
  - Play/Pause (Space)
  - Frame stepping (←/→)
  - Go to start/end (Home/End)
  - Playback speed control
  - 60fps playback
- **Keyboard Shortcuts**: 15+ shortcuts
  - Space: Play/Pause
  - Home/End: Go to start/end
  - ←/→: Step frames
  - +/-: Zoom in/out
  - Cmd+S: Save
  - Delete: Delete selected
- **Design System**:
  - CSS custom properties
  - Dark theme
  - Consistent spacing
  - Professional color palette
  - Responsive layout
- **Documentation**:
  - README with project overview
  - CONTRIBUTING guide
  - Architecture documentation
  - Getting started guide
  - Roadmap

### Technical
- TypeScript 5 with strict mode
- React 18 with hooks
- Vite 5 for build tooling
- Zustand for state management
- Immer for immutable updates
- ESLint and Prettier
- GitHub Actions CI/CD

---

## Version History Summary

| Version | Date | Focus | Features Added | Progress |
|---------|------|-------|----------------|----------|
| 1.0.0-alpha.0 | 2026-05-06 | Foundation | Project structure, core features | 50% |
| 1.0.0-alpha.1 | 2026-05-06 | Core Editing | Trimming, context menus | 55% |
| 1.0.0-alpha.2 | 2026-05-06 | Advanced Editing | Snapping, copy/paste | 60% |
| 1.0.0-alpha.3 | 2026-05-06 | Professional Tools | Collision, ripple edit | 65% |
| 1.0.0-alpha.4 | 2026-05-06 | Export System | Export dialog, presets | 70% |
| 1.0.0-alpha.5 | 2026-05-06 | Undo/Redo | Command pattern, history | 75% |
| 1.0.0-alpha.6 | 2026-05-06 | Auto-Save & Settings | Auto-save, settings UI | 78% |
| 1.0.0-alpha.7 | 2026-05-06 | Effects & Transitions | 10 effects, 12 transitions | 87% |

---

## Upcoming Releases

### [1.0.0-beta.1] - Planned
- FFmpeg.wasm integration
- Effect preview in viewer
- Transition preview on timeline
- Bug fixes and polish

### [1.0.0-rc.1] - Planned
- Audio mixing features
- Color grading tools
- Performance optimization
- Browser compatibility testing

### [1.0.0] - Planned
- First stable release
- Complete documentation
- Tutorial and onboarding
- Plugin system activation

---

*For detailed session reports, see SESSION_7_COMPLETE_SUMMARY.md*
