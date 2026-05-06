# OmniCut Quick Start Guide

Get OmniCut running in 5 minutes! ⚡

## Prerequisites

Install these first:
- [Node.js 20+](https://nodejs.org/)
- [pnpm 8+](https://pnpm.io/installation)

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/omnicut/omnicut.git
cd omnicut

# 2. Install dependencies (takes ~2 minutes)
pnpm install

# 3. Start the web app
cd apps/web
pnpm dev
```

Open http://localhost:5173 🎉

## Project Structure

```
omnicut/
├── apps/web/          # 👈 React web app (start here)
├── packages/core/     # Type definitions
└── docs/              # Documentation
```

## Common Commands

```bash
# Development
pnpm dev              # Start web app
pnpm build            # Build everything
pnpm typecheck        # Check types
pnpm lint             # Lint code
pnpm format           # Format code

# Package-specific
cd apps/web && pnpm dev       # Web app only
cd packages/core && pnpm build # Build core only
```

## Making Changes

### 1. Edit the UI

```bash
# Open apps/web/src/App.tsx
# Make changes
# See hot-reload in browser
```

### 2. Add a Type

```bash
# Open packages/core/src/types/
# Add your type
# Run: cd packages/core && pnpm build
```

### 3. Commit

```bash
git add .
git commit -m "feat(timeline): add new feature"
git push
```

Use [conventional commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code change
- `test:` - Tests
- `chore:` - Build/config

## File Locations

### Want to change...

**The UI layout?**
→ `apps/web/src/App.tsx`

**The colors/theme?**
→ `apps/web/src/styles/index.css` (see `:root` variables)

**The types?**
→ `packages/core/src/types/`

**The menu bar?**
→ `apps/web/src/App.tsx` (search for "menu-bar")

**The timeline?**
→ `apps/web/src/App.tsx` (search for "timeline")

## Key Concepts

### 1. Types First

Everything starts with types in `packages/core`:

```typescript
// packages/core/src/types/timeline.ts
interface Clip {
  id: string;
  startTime: number;
  duration: number;
  // ...
}
```

### 2. Monorepo

Multiple packages in one repo:
- `apps/web` - Web application
- `packages/core` - Shared types
- More packages coming soon!

### 3. Design System

Use CSS custom properties:

```css
/* In your CSS */
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--space-3);
}
```

## Troubleshooting

### "Cannot find module '@omnicut/core'"

```bash
cd packages/core
pnpm build
```

### Port 5173 in use

Change port in `apps/web/vite.config.ts`:
```ts
server: { port: 3000 }
```

### Type errors

```bash
pnpm build
```

### Dependency issues

```bash
rm -rf node_modules
pnpm install
```

## Next Steps

1. ✅ Got it running? Great!
2. 📖 Read [SETUP.md](./SETUP.md) for details
3. 🏗️ Check [docs/architecture.md](./docs/architecture.md)
4. 🗺️ See [docs/roadmap.md](./docs/roadmap.md)
5. 🤝 Read [CONTRIBUTING.md](./CONTRIBUTING.md)

## Get Help

- 💬 [Discord](https://discord.gg/omnicut)
- 🐛 [GitHub Issues](https://github.com/omnicut/omnicut/issues)
- 💡 [Discussions](https://github.com/omnicut/omnicut/discussions)

## What to Work On

### Good First Issues
- [ ] Add more export presets
- [ ] Improve empty state designs
- [ ] Add keyboard shortcut hints
- [ ] Write tutorials

### High Priority
- [ ] FFmpeg.wasm integration
- [ ] Timeline rendering
- [ ] Media pool UI
- [ ] Testing

See [STATUS.md](./STATUS.md) for current progress.

---

**Happy coding! 🚀**
