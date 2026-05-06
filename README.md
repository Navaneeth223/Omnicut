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

## 🚀 Features

### Video Editing
- Multi-track non-linear editor with unlimited tracks
- Frame-accurate editing with sub-frame precision
- 100+ video effects and transitions
- Advanced color grading suite (DaVinci-level)
- Motion graphics and animation
- AI-powered features (background removal, auto-transcription, scene detection)

### Audio Production
- Professional mixing console with unlimited tracks
- 50+ audio effects (EQ, compression, reverb, etc.)
- Spectral editing and repair
- MIDI support with virtual instruments
- Loudness metering (LUFS) for broadcast standards

### Photo Editing
- Non-destructive, layer-based editing
- RAW photo processing (1000+ cameras supported)
- Advanced retouching tools
- Content-aware fill and healing
- Batch processing

### Export & Delivery
- 20+ video codecs (H.264, H.265, AV1, ProRes, DNxHD)
- Platform-optimized presets (YouTube, Instagram, TikTok, etc.)
- HDR support (HDR10, HLG, Dolby Vision)
- Background rendering

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

### Phase 1: Foundation (Months 1-3) ✅ In Progress
- [x] Monorepo setup
- [ ] Media import + FFmpeg.wasm
- [ ] Basic timeline
- [ ] Basic export
- [ ] Project save/load

### Phase 2: Core Editing (Months 4-6)
- [ ] Unlimited tracks
- [ ] Complete transition library
- [ ] Text and titles
- [ ] Proxy workflow

### Phase 3: Advanced Features (Months 7-12)
- [ ] Color grading suite
- [ ] Audio mixer
- [ ] Motion graphics
- [ ] AI features

### Phase 4: Platform & Polish (Months 13-18)
- [ ] Desktop apps
- [ ] Mobile apps
- [ ] Plugin marketplace

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
