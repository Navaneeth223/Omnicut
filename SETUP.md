# OmniCut Setup Guide

This guide will help you set up OmniCut for development.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/omnicut/omnicut.git
cd omnicut

# Install dependencies
pnpm install

# Start development
pnpm dev
```

The web app will be available at `http://localhost:5173`

## What's Been Built

### ✅ Phase 1 Foundation - Week 1-2 (COMPLETE)

#### Project Infrastructure
- [x] Monorepo structure with pnpm workspaces
- [x] Turborepo for build orchestration
- [x] TypeScript 5 with strict mode
- [x] ESLint + Prettier configuration
- [x] Git hooks with Husky
- [x] GitHub Actions CI/CD pipeline

#### Core Package (`packages/core`)
- [x] Complete type definitions:
  - Project structure
  - Timeline (tracks, clips, markers)
  - Media pool and items
  - Effects and transitions
  - Keyframe animation
  - Color grading
  - Audio mixing
  - Export presets
  - Plugin system
- [x] Utility functions:
  - Time and timecode conversion
  - ID generation (UUID)
  - Validation helpers
- [x] 100% TypeScript with JSDoc comments
- [x] Zero dependencies (except Zod for validation)

#### Web Application (`apps/web`)
- [x] Vite + React 18 setup
- [x] Complete UI layout:
  - Menu bar with logo and navigation
  - Workspace tabs (Edit, Color, Audio, Photo)
  - Three-panel layout (Media Pool, Viewer, Inspector)
  - Timeline with toolbar
  - Status bar
- [x] Design system with CSS custom properties
- [x] Responsive layout
- [x] Dark theme (production-grade)
- [x] Empty states for all panels

#### Documentation
- [x] Comprehensive README
- [x] Contributing guidelines
- [x] Architecture overview
- [x] Getting started guide
- [x] Roadmap with phases
- [x] Changelog
- [x] MIT License

#### Build & Deploy
- [x] CI/CD pipeline for testing and building
- [x] Multi-platform desktop build workflow
- [x] Code quality checks (lint, typecheck, test)

## Project Structure

```
omnicut/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
├── apps/
│   └── web/
│       ├── public/
│       │   └── icon.svg           # App icon
│       ├── src/
│       │   ├── styles/
│       │   │   ├── index.css      # Global styles
│       │   │   └── App.css        # App layout styles
│       │   ├── App.tsx            # Main app component
│       │   └── main.tsx           # Entry point
│       ├── index.html             # HTML template
│       ├── package.json           # Dependencies
│       ├── tsconfig.json          # TypeScript config
│       └── vite.config.ts         # Vite config
├── packages/
│   └── core/
│       ├── src/
│       │   ├── types/
│       │   │   ├── project.ts     # Project types
│       │   │   ├── timeline.ts    # Timeline types
│       │   │   ├── media.ts       # Media types
│       │   │   ├── effects.ts     # Effects types
│       │   │   ├── keyframes.ts   # Keyframe types
│       │   │   ├── color.ts       # Color grading types
│       │   │   ├── audio.ts       # Audio types
│       │   │   ├── export.ts      # Export types
│       │   │   ├── plugin.ts      # Plugin types
│       │   │   └── index.ts       # Type exports
│       │   ├── utils/
│       │   │   ├── time.ts        # Time utilities
│       │   │   ├── id.ts          # ID generation
│       │   │   ├── validation.ts  # Validation helpers
│       │   │   └── index.ts       # Utility exports
│       │   └── index.ts           # Package entry
│       ├── package.json           # Dependencies
│       └── tsconfig.json          # TypeScript config
├── docs/
│   ├── getting-started.md         # Setup guide
│   ├── architecture.md            # Architecture docs
│   └── roadmap.md                 # Development roadmap
├── .eslintrc.json                 # ESLint config
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier config
├── CHANGELOG.md                   # Version history
├── CONTRIBUTING.md                # Contribution guide
├── LICENSE                        # MIT License
├── package.json                   # Root package
├── pnpm-workspace.yaml            # Workspace config
├── README.md                      # Project overview
├── SETUP.md                       # This file
├── tsconfig.json                  # Base TypeScript config
└── turbo.json                     # Turborepo config
```

## Next Steps (Week 3-4)

### Media Import & FFmpeg Integration
- [ ] Install FFmpeg.wasm
- [ ] Create media import dialog
- [ ] Implement file reading
- [ ] Extract metadata (duration, resolution, codec)
- [ ] Generate thumbnails
- [ ] Display in media pool
- [ ] Drag and drop support

### Media Pool UI
- [ ] Grid view with thumbnails
- [ ] List view with details
- [ ] Search and filter
- [ ] Bins (folders)
- [ ] Smart bins
- [ ] Context menu
- [ ] Keyboard shortcuts

## Development Workflow

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build Core Package

```bash
cd packages/core
pnpm build
```

### 3. Start Web App

```bash
cd apps/web
pnpm dev
```

### 4. Make Changes

Edit files in `apps/web/src/` or `packages/core/src/`

### 5. Test Changes

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format

# Test (when tests are added)
pnpm test
```

### 6. Commit Changes

```bash
git add .
git commit -m "feat(timeline): add clip selection"
```

Use conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Build/config changes

## Available Scripts

### Root Level
- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm typecheck` - Type check all code
- `pnpm format` - Format all code
- `pnpm clean` - Clean all build artifacts

### Package Level
- `cd packages/core && pnpm build` - Build core package
- `cd apps/web && pnpm dev` - Run web app
- `cd apps/web && pnpm build` - Build web app

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool
- **Zustand** - State management (to be added)
- **Jotai** - Atomic state (to be added)
- **React Query** - Async state (to be added)
- **Framer Motion** - Animations (to be added)

### Media Processing (To Be Added)
- **FFmpeg.wasm** - Video/audio processing
- **Web Audio API** - Audio engine
- **WebGL/WebGPU** - GPU acceleration
- **Canvas API** - 2D graphics

### Build Tools
- **pnpm** - Package manager
- **Turborepo** - Monorepo build system
- **Vite** - Frontend build tool
- **tsup** - TypeScript library bundler

### Code Quality
- **TypeScript** - Type checking
- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks

## Design System

### Colors
- Background: `#1a1a1f` (primary), `#242429` (secondary), `#2e2e35` (tertiary)
- Text: `#f0f0f5` (primary), `#a0a0b0` (secondary), `#606075` (tertiary)
- Accent: `#3b82f6` (blue), `#10b981` (green), `#f59e0b` (yellow), `#ef4444` (red)

### Typography
- Font: Geist, SF Pro Display, system-ui
- Sizes: 10px (xs), 11px (sm), 12px (base), 13px (md), 14px (lg), 16px (xl)

### Spacing
- Base: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px

## Troubleshooting

### "Cannot find module '@omnicut/core'"

Build the core package first:
```bash
cd packages/core
pnpm build
```

### Port 5173 Already in Use

Change the port in `apps/web/vite.config.ts`:
```ts
server: {
  port: 3000,
}
```

### Type Errors

Rebuild all packages:
```bash
pnpm build
```

### Dependency Issues

Clean and reinstall:
```bash
rm -rf node_modules
pnpm install
```

## Resources

- **Documentation**: [docs/](./docs/)
- **GitHub**: [github.com/omnicut/omnicut](https://github.com/omnicut/omnicut)
- **Discord**: [discord.gg/omnicut](https://discord.gg/omnicut)
- **Website**: [omnicut.app](https://omnicut.app)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Ready to build the future of video editing? Let's go! 🚀**
