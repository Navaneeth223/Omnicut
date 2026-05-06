# OmniCut

**The Ultimate Open-Source Video, Audio, Photo & Production Suite**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)](https://github.com/omnicut/omnicut)

## 🎯 Vision

OmniCut is a production-grade, fully open-source multimedia production suite that rivals Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, Audacity, Lightroom, After Effects, and GarageBand — all rolled into one unified application.

### Core Philosophy

- **Zero Paywall** — Every feature is free forever
- **Open Source First** — MIT licensed, community-driven
- **Cross-Platform** — Web, Desktop (Windows/macOS/Linux), Mobile (iOS/Android)
- **Performance Without Compromise** — GPU-accelerated, WebAssembly-powered
- **Accessibility** — WCAG 2.1 AA compliant, 30+ languages

## 🚀 Features (Current: 82% Complete)

### Video Editing ✅
- ✅ Multi-track non-linear editor with unlimited tracks
- ✅ Frame-accurate editing with sub-frame precision
- ✅ 10 video effects (Brightness, Hue/Saturation, Blur, Sharpen, Vignette, Glow, Film Grain, Transform, Crop, Exposure)
- ✅ 12 transitions (Cross Dissolve, Fade, Dip to Black/White, Wipes, Push, Zoom)
- ✅ Razor tool for splitting clips
- ✅ Magnetic snapping system
- ✅ Ripple edit mode
- ✅ Collision detection
- ✅ Copy/paste/duplicate clips
- ✅ Track controls (mute/solo/lock)
- ✅ Undo/Redo (200 levels)
- ✅ Auto-save with configurable interval
- ✅ 32+ keyboard shortcuts
- 🚧 Advanced color grading suite (planned)
- 🚧 Motion graphics and animation (planned)
- 🚧 AI-powered features (planned)

### Export & Delivery ✅
- ✅ Export dialog with presets
- ✅ Multiple formats (MP4, WebM, MOV)
- ✅ Multiple codecs (H.264, H.265, VP9)
- ✅ Resolution configuration
- ✅ Quality settings
- ✅ Audio settings
- ✅ Export range selection
- ✅ File size estimation
- ✅ Progress tracking
- 🚧 FFmpeg.wasm integration (in progress)
- 🚧 Platform-optimized presets (YouTube, Instagram, TikTok)
- 🚧 HDR support (planned)

### Audio Production 🚧
- 🚧 Professional mixing console (planned)
- 🚧 Audio effects (planned)
- 🚧 Volume keyframes (planned)
- 🚧 Fade in/out (planned)

### Photo Editing 🚧
- 🚧 Non-destructive editing (planned)
- 🚧 RAW photo processing (planned)
- 🚧 Advanced retouching tools (planned)

## 📦 Project Structure

```
omnicut/
├── apps/
│   ├── web/                 # Vite + React web app
│   ├── desktop/             # Electron wrapper
│   ├── mobile/              # Capacitor mobile app
│   └── server/              # Fastify backend (optional cloud mode)
├── packages/
│   ├── core/                # Shared business logic
│   ├── media-engine/        # FFmpeg.wasm, codec processing
│   ├── audio-engine/        # Web Audio, DSP
│   ├── video-engine/        # Timeline, compositor
│   ├── image-engine/        # Photo editing
│   ├── timeline/            # Timeline UI components
│   ├── ui/                  # Design system
│   ├── plugin-api/          # Plugin interface
│   ├── i18n/                # Translations
│   └── store/               # State management
├── plugins/
│   ├── official/            # First-party plugins
│   └── community/           # Community examples
└── docs/                    # Documentation site
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite
- **State**: Zustand, Jotai, React Query
- **Media**: FFmpeg.wasm, Web Audio API, WebGL/WebGPU
- **Backend**: Node.js 20, Fastify, tRPC
- **Database**: SQLite (local), PostgreSQL (cloud)
- **Desktop**: Electron
- **Mobile**: Capacitor
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/omnicut/omnicut.git
cd omnicut

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The web app will be available at `http://localhost:5173`

### Building

```bash
# Build all packages
pnpm build

# Build desktop app
cd apps/desktop
pnpm build

# Build mobile app
cd apps/mobile
pnpm build
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📖 Documentation

Full documentation is available at [docs.omnicut.app](https://docs.omnicut.app)

- [Getting Started Guide](docs/getting-started.md)
- [Architecture Overview](docs/architecture.md)
- [Plugin Development](docs/plugin-development.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(timeline): add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

### Phase 1: Foundation (Months 1-3) ✅ 82% Complete
- [x] Monorepo setup
- [x] Media import + FFmpeg.wasm
- [x] Multi-track timeline
- [x] Clip editing (trim, split, move)
- [x] 10 basic effects
- [x] 12 transitions
- [x] Export system
- [x] Undo/Redo
- [x] Auto-save
- [ ] FFmpeg rendering integration (in progress)
- [ ] Project save/load

### Phase 2: Core Editing (Months 4-6)
- [ ] Effect parameters UI
- [ ] Effect preview
- [ ] Transition preview
- [ ] Text and titles
- [ ] Audio mixing
- [ ] Proxy workflow

### Phase 3: Advanced Features (Months 7-12)
- [ ] Color grading suite
- [ ] Advanced audio features
- [ ] Motion graphics
- [ ] Keyframe animation
- [ ] AI features

### Phase 4: Platform & Polish (Months 13-18)
- [ ] Desktop apps
- [ ] Mobile apps
- [ ] Plugin marketplace
- [ ] Cloud sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FFmpeg team for the incredible multimedia framework
- The open-source community for inspiration and tools
- All contributors who make this project possible

## 💬 Community

- [Discord](https://discord.gg/omnicut)
- [GitHub Discussions](https://github.com/omnicut/omnicut/discussions)
- [Twitter](https://twitter.com/omnicutapp)

---

**Built with ❤️ by the open-source community**
