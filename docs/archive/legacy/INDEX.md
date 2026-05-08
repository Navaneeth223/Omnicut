# 📚 OmniCut Documentation Index

**Welcome to OmniCut!** This index will help you find everything you need.

---

## 🚀 Getting Started

### **New to OmniCut?**
1. **[README.md](./README.md)** - Start here! Project overview and features
2. **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
3. **[SETUP.md](./SETUP.md)** - Detailed setup instructions
4. **[docs/getting-started.md](./docs/getting-started.md)** - Step-by-step guide

### **Want to Contribute?**
1. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
2. **[NEXT_STEPS.md](./NEXT_STEPS.md)** - What to work on next
3. **[STATUS.md](./STATUS.md)** - Current development status

---

## 📖 Documentation

### **Project Information**
- **[README.md](./README.md)** - Project overview, features, tech stack
- **[LICENSE](./LICENSE)** - MIT License
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project summary
- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - What we've built so far

### **Development Guides**
- **[SETUP.md](./SETUP.md)** - Setup and installation
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[docs/getting-started.md](./docs/getting-started.md)** - Detailed getting started
- **[docs/architecture.md](./docs/architecture.md)** - Technical architecture
- **[docs/roadmap.md](./docs/roadmap.md)** - 18-month development roadmap

### **Progress Tracking**
- **[STATUS.md](./STATUS.md)** - Current development status
- **[PROGRESS_REPORT.md](./PROGRESS_REPORT.md)** - Detailed progress report
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - What to do next

---

## 📦 Packages

### **@omnicut/core**
**Location:** `packages/core/`  
**Purpose:** Type definitions and shared utilities  
**Status:** ✅ Complete (100%)

**Key Files:**
- `src/types/project.ts` - Project types
- `src/types/timeline.ts` - Timeline types
- `src/types/media.ts` - Media types
- `src/types/effects.ts` - Effects types
- `src/types/keyframes.ts` - Keyframe types
- `src/types/color.ts` - Color grading types
- `src/types/audio.ts` - Audio types
- `src/types/export.ts` - Export types
- `src/types/plugin.ts` - Plugin types
- `src/utils/` - Utility functions

### **@omnicut/store**
**Location:** `packages/store/`  
**Purpose:** State management with Zustand  
**Status:** ✅ Complete (100%)

**Key Files:**
- `src/project-store.ts` - Project state
- `src/timeline-store.ts` - Timeline state
- `src/media-pool-store.ts` - Media pool state

### **@omnicut/media-engine**
**Location:** `packages/media-engine/`  
**Purpose:** Media processing with FFmpeg.wasm  
**Status:** 🚧 In Progress (70%)

**Key Files:**
- `src/ffmpeg-manager.ts` - FFmpeg singleton
- `src/media-importer.ts` - File import
- `src/thumbnail-generator.ts` - Thumbnails
- `src/waveform-generator.ts` - Waveforms
- `src/metadata-extractor.ts` - Metadata

### **@omnicut/web**
**Location:** `apps/web/`  
**Purpose:** React web application  
**Status:** 🚧 In Progress (40%)

**Key Files:**
- `src/App.tsx` - Main app component
- `src/App-v2.tsx` - Enhanced with state management
- `src/components/MediaPool/` - Media pool components
- `src/styles/` - CSS styles

---

## 🎯 Quick Links

### **For Users**
- [Features](./README.md#features)
- [Installation](./QUICK_START.md#installation)
- [Usage Guide](./docs/getting-started.md)
- [FAQ](./README.md#faq)

### **For Developers**
- [Architecture](./docs/architecture.md)
- [API Documentation](./packages/core/src/)
- [Contributing](./CONTRIBUTING.md)
- [Roadmap](./docs/roadmap.md)

### **For Contributors**
- [Good First Issues](./NEXT_STEPS.md#immediate-next-steps-this-week)
- [Development Setup](./SETUP.md)
- [Code Style](./CONTRIBUTING.md#code-standards)
- [Testing](./NEXT_STEPS.md#testing-plan)

---

## 📊 Project Stats

### **Code**
- **Total Lines:** 9,200+
- **TypeScript:** 5,500+
- **CSS:** 1,200+
- **Documentation:** 4,500+

### **Packages**
- **Total:** 4
- **Complete:** 2
- **In Progress:** 2

### **Files**
- **Source Files:** 35+
- **Config Files:** 12
- **Documentation:** 12
- **Total:** 59

### **Progress**
- **Phase 1:** 35% Complete
- **Overall:** 8% Complete
- **Target:** v1.0 in 18 months

---

## 🗺️ Project Structure

```
omnicut/
├── .github/              # GitHub Actions workflows
├── apps/
│   └── web/             # React web application
├── packages/
│   ├── core/            # Type definitions
│   ├── store/           # State management
│   └── media-engine/    # Media processing
├── docs/                # Documentation
├── README.md            # Project overview
├── SETUP.md             # Setup guide
├── CONTRIBUTING.md      # Contribution guide
└── ...                  # More docs
```

---

## 🎓 Learning Resources

### **Tutorials** (Coming Soon)
1. Getting Started with OmniCut
2. Importing and Organizing Media
3. Basic Video Editing
4. Adding Effects and Transitions
5. Color Grading Basics
6. Audio Mixing
7. Exporting Your Project

### **Video Guides** (Coming Soon)
1. Quick Start (5 min)
2. First Edit (15 min)
3. Advanced Editing (30 min)
4. Color Grading (20 min)
5. Audio Mixing (20 min)

### **API Documentation** (Coming Soon)
- Type Reference
- Store API
- Media Engine API
- Plugin API

---

## 🐛 Troubleshooting

### **Common Issues**

**"Cannot find module '@omnicut/core'"**
→ See [SETUP.md#troubleshooting](./SETUP.md#troubleshooting)

**"Port 5173 already in use"**
→ See [QUICK_START.md#troubleshooting](./QUICK_START.md#troubleshooting)

**"FFmpeg failed to load"**
→ Check internet connection, FFmpeg loads from CDN

**"Import failed"**
→ Check file format, see supported formats in import dialog

---

## 📞 Get Help

### **Community**
- **Discord:** [discord.gg/omnicut](https://discord.gg/omnicut)
- **GitHub Discussions:** [github.com/omnicut/omnicut/discussions](https://github.com/omnicut/omnicut/discussions)
- **Twitter:** [@omnicutapp](https://twitter.com/omnicutapp)

### **Report Issues**
- **Bug Reports:** [GitHub Issues](https://github.com/omnicut/omnicut/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/omnicut/omnicut/discussions)
- **Security Issues:** security@omnicut.app

---

## 🎉 Quick Actions

### **I want to...**

**...try OmniCut**
→ [QUICK_START.md](./QUICK_START.md)

**...contribute code**
→ [CONTRIBUTING.md](./CONTRIBUTING.md)

**...report a bug**
→ [GitHub Issues](https://github.com/omnicut/omnicut/issues)

**...request a feature**
→ [GitHub Discussions](https://github.com/omnicut/omnicut/discussions)

**...understand the architecture**
→ [docs/architecture.md](./docs/architecture.md)

**...see the roadmap**
→ [docs/roadmap.md](./docs/roadmap.md)

**...know what's next**
→ [NEXT_STEPS.md](./NEXT_STEPS.md)

**...see progress**
→ [STATUS.md](./STATUS.md)

---

## 📅 Recent Updates

**May 6, 2026**
- ✅ Foundation complete (35%)
- ✅ Media import working
- ✅ Media pool UI complete
- ✅ State management complete
- 🚧 Timeline in progress

**Next Update:** May 13, 2026

---

## 🙏 Credits

### **Core Team**
- [Your Name] - Project Lead

### **Contributors**
- See [CONTRIBUTORS.md](./CONTRIBUTORS.md) (coming soon)

### **Special Thanks**
- FFmpeg team
- React team
- Zustand team
- Vite team
- Open source community

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built with ❤️ by the open-source community**

*Last Updated: May 6, 2026*
