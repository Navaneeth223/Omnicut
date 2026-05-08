# ⚡ OmniCut v3.1.0 - Command Reference

Quick reference for all commands and shortcuts.

---

## 🚀 Development Commands

### Start Development
```bash
npm run dev
# Opens http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output: apps/web/dist
```

### Preview Production Build
```bash
npm run preview
# Test production build locally
```

### Type Check
```bash
npm run type-check
# Check TypeScript errors
```

### Lint Code
```bash
npm run lint
# Check code quality
```

### Run Tests
```bash
npm test
# Run all tests
```

---

## 🚀 Deployment Commands

### Vercel (Recommended)
```bash
# Install CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify
```bash
# Install CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Manual Build & Deploy
```bash
# Build
npm run build

# Upload apps/web/dist folder to hosting
```

---

## ⌨️ Keyboard Shortcuts

### General
| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save project |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + E` | Export |
| `?` | Show keyboard shortcuts |

### Playback
| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `Home` | Go to start |
| `End` | Go to end |
| `←` | Step backward |
| `→` | Step forward |
| `J` | Play backward |
| `K` | Pause |
| `L` | Play forward |

### Timeline
| Shortcut | Action |
|----------|--------|
| `V` | Selection tool |
| `C` | Razor tool |
| `H` | Hand tool |
| `Ctrl + C` | Copy clip |
| `Ctrl + V` | Paste clip |
| `Delete` | Delete clip |
| `+` | Zoom in |
| `-` | Zoom out |

### Workspaces
| Shortcut | Action |
|----------|--------|
| `Ctrl + 1` | Edit workspace |
| `Ctrl + 2` | Shorts Studio |
| `Ctrl + 3` | AI Voice Studio |
| `Ctrl + 4` | AI Image Generator |
| `Ctrl + 5` | AI Video Generator |
| `Ctrl + 6` | Color Grading |
| `Ctrl + 7` | Audio Workspace |
| `Ctrl + 8` | Photo Editor |

---

## 🎤 Real-Time Voice Transform

### Quick Start
1. Click "AI Voice" in header
2. Click "Real-Time Transform" tab
3. Select mode (Live or Record)
4. Choose target voice
5. Adjust controls
6. Start transforming!

### Available Voices
- Deep Voice
- High Voice
- Robot Voice
- Echo Voice
- Whisper
- Monster

### Controls
- **Pitch**: -12 to +12 semitones
- **Formant**: -3 to +3
- **Blend**: 0% to 100%

---

## 🎨 Resizable Panels

### How to Resize
1. Hover over panel edge
2. Cursor changes to ↔
3. Click and drag
4. Release to set size

### Resizable Panels
- **Media Pool** (left): 200px - 600px
- **Effects** (right): 280px - 500px

### Reset Size
- Double-click panel edge to reset

---

## 📁 Project Structure

```
omnicut/
├── apps/
│   └── web/                    # Main web app
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom hooks
│       │   ├── lib/            # Utilities
│       │   └── styles/         # Global styles
│       └── dist/               # Build output
├── packages/
│   ├── core/                   # Core types
│   ├── store/                  # State management
│   └── media-engine/           # Media processing
└── docs/                       # Documentation
```

---

## 🔧 Troubleshooting Commands

### Clear Cache
```bash
rm -rf node_modules
rm -rf .turbo
npm install
```

### Kill Dev Server (Windows)
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Rebuild Everything
```bash
npm run clean
npm install
npm run build
```

---

## 📊 Useful Commands

### Check Bundle Size
```bash
npm run build
# Check dist/ folder sizes
```

### Analyze Bundle
```bash
npm run build -- --analyze
# Opens bundle analyzer
```

### Check Performance
```bash
npm run lighthouse
# Run Lighthouse audit
```

---

## 🎯 Git Commands

### Commit Changes
```bash
git add .
git commit -m "Your message"
git push
```

### Create Branch
```bash
git checkout -b feature/your-feature
```

### Merge Branch
```bash
git checkout main
git merge feature/your-feature
```

---

## 📦 Package Management

### Install Dependencies
```bash
npm install
```

### Add Package
```bash
npm install package-name
```

### Remove Package
```bash
npm uninstall package-name
```

### Update Packages
```bash
npm update
```

---

## 🚀 Quick Deploy

### One-Command Deploy
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod
```

### Build & Upload
```bash
npm run build
# Upload apps/web/dist to hosting
```

---

## 📚 Documentation Commands

### View Documentation
```bash
# Open in browser
start README.md                    # Windows
open README.md                     # Mac
xdg-open README.md                 # Linux
```

### Generate Docs
```bash
npm run docs:generate
```

---

## 🎨 Style Commands

### Format Code
```bash
npm run format
```

### Check Formatting
```bash
npm run format:check
```

---

## 🧪 Testing Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- ComponentName
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm run test:coverage
```

---

## 🔍 Search Commands

### Find in Files
```bash
# Windows
findstr /s /i "search term" *.tsx

# Mac/Linux
grep -r "search term" src/
```

### Find Files
```bash
# Windows
dir /s /b *filename*

# Mac/Linux
find . -name "*filename*"
```

---

## 💡 Tips

### Speed Up Development
```bash
# Use turbo cache
npm run dev --cache

# Skip type checking
npm run dev --no-type-check
```

### Debug Build
```bash
# Verbose output
npm run build -- --verbose

# Source maps
npm run build -- --sourcemap
```

### Clean Install
```bash
# Remove everything and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Common Workflows

### Feature Development
```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Start dev server
npm run dev

# 3. Make changes
# ... code ...

# 4. Test
npm test

# 5. Build
npm run build

# 6. Commit
git add .
git commit -m "Add new feature"

# 7. Push
git push origin feature/new-feature
```

### Bug Fix
```bash
# 1. Create branch
git checkout -b fix/bug-name

# 2. Fix bug
# ... code ...

# 3. Test
npm test

# 4. Build
npm run build

# 5. Commit & push
git add .
git commit -m "Fix bug"
git push origin fix/bug-name
```

### Deploy to Production
```bash
# 1. Build
npm run build

# 2. Test build
npm run preview

# 3. Deploy
vercel --prod
# or
netlify deploy --prod
```

---

## 📞 Help Commands

### Get Help
```bash
# npm help
npm help

# Specific command help
npm help install
npm help run
```

### Check Versions
```bash
# Node version
node --version

# npm version
npm --version

# Package versions
npm list
```

---

## 🎉 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ OMNICUT v3.1.0 - QUICK REFERENCE                            │
├─────────────────────────────────────────────────────────────┤
│ Dev:          npm run dev                                   │
│ Build:        npm run build                                 │
│ Deploy:       vercel  or  netlify deploy --prod             │
│                                                             │
│ Shortcuts:    ?  (show all)                                 │
│               Space  (play/pause)                           │
│               Ctrl+S  (save)                                │
│               Ctrl+Z  (undo)                                │
│                                                             │
│ Docs:         README.md                                     │
│               QUICK_START_V3.1.md                           │
│               docs/guides/DEPLOYMENT_GUIDE.md               │
└─────────────────────────────────────────────────────────────┘
```

---

**Version**: 3.1.0  
**Status**: Production Ready  
**Build**: ✅ 2.24s, 0 errors  

**Made with ❤️ by the OmniCut Team**
