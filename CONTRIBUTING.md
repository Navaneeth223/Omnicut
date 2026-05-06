# Contributing to OmniCut

Thank you for your interest in contributing to OmniCut! This document provides guidelines and instructions for contributing.

**Current Status:** 87% complete, approaching 1.0 release  
**Active Development:** Yes  
**Looking for Contributors:** Yes

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Areas to Contribute](#areas-to-contribute)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Questions](#questions)

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Be respectful, inclusive, and constructive.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/omnicut.git
   cd omnicut
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Start development server**
   ```bash
   cd apps/web
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Project Structure

```
omnicut/
├── apps/
│   └── web/                    # React + Vite web app
│       ├── src/
│       │   ├── components/     # UI components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── utils/          # Utility functions
│       │   └── styles/         # CSS files
│       └── package.json
├── packages/
│   ├── core/                   # Core types & utilities
│   │   └── src/
│   │       ├── types/          # TypeScript types
│   │       └── utils/          # Shared utilities
│   ├── store/                  # State management (Zustand)
│   │   └── src/
│   │       ├── timeline-store.ts
│   │       ├── media-pool-store.ts
│   │       ├── project-store.ts
│   │       └── history-store.ts
│   └── media-engine/           # FFmpeg.wasm integration
│       └── src/
└── docs/                       # Documentation
```

---

## Development Workflow

### Creating a Branch

```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# Create a fix branch
git checkout -b fix/bug-description
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code change without feature/fix
- `style`: Formatting only
- `test`: Adding tests
- `docs`: Documentation only
- `chore`: Build/config/tooling

**Scopes:**
- `timeline` - Timeline editing features
- `effects` - Video effects
- `transitions` - Transitions
- `audio` - Audio features
- `export` - Export functionality
- `ui` - User interface
- `core` - Core functionality
- `store` - State management

**Examples:**
```bash
feat(timeline): add ripple delete across all tracks
fix(effects): resolve brightness parameter range
perf(timeline): optimize clip rendering
docs(api): add effect development guide
refactor(store): simplify timeline state management
test(timeline): add split clip tests
```

### Making Changes

1. **Write code**
   - Follow TypeScript strict mode
   - Add JSDoc comments
   - Use existing patterns

2. **Test your changes**
   ```bash
   # Type check
   pnpm typecheck
   
   # Lint
   pnpm lint
   
   # Format
   pnpm format
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(timeline): add your feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template

---

## Project Architecture

### State Management

We use **Zustand** with **Immer** for state management:

```typescript
// Example store
export const useTimelineStore = create<TimelineState & TimelineActions>()(
  immer((set, get) => ({
    // State
    timeline: null,
    playing: false,
    
    // Actions
    play: () => set((state) => { state.playing = true }),
    pause: () => set((state) => { state.playing = false }),
  }))
);
```

### Component Structure

```typescript
// Example component
export function MyComponent() {
  // 1. State from stores
  const timeline = useTimelineStore((state) => state.timeline);
  
  // 2. Local state
  const [isOpen, setIsOpen] = useState(false);
  
  // 3. Callbacks
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Render
  return <div>...</div>;
}
```

### Type Definitions

All types are defined in `packages/core/src/types/`:

```typescript
// Example type
export interface Clip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  // ...
}
```

### Command Pattern (Undo/Redo)

All user actions should use the command pattern:

```typescript
// Example command
export function createMyCommand(params) {
  const store = useMyStore.getState();
  const historyStore = useHistoryStore.getState();
  
  historyStore.executeCommand({
    name: 'My Action',
    execute: () => {
      // Do the action
    },
    undo: () => {
      // Undo the action
    },
  });
}
```

---

## Areas to Contribute

### 🔥 High Priority (Needed for 1.0)

1. **FFmpeg.wasm Integration** (Critical)
   - Implement video rendering
   - Apply effects during render
   - Apply transitions during render
   - Progress tracking
   - **Files:** `packages/media-engine/src/renderer.ts`

2. **Effect Preview** (High)
   - Canvas-based rendering
   - Apply effects in viewer
   - Real-time preview
   - **Files:** `apps/web/src/utils/effectRenderer.ts`

3. **Transition Preview** (Medium)
   - Visual transition preview
   - Timeline visualization
   - **Files:** `apps/web/src/components/Timeline/TimelineTransition.tsx`

### 🌟 Good First Issues

1. **Add More Effects**
   - Implement new video effects
   - Follow existing effect patterns
   - **Files:** `apps/web/src/components/Effects/EffectsPanel.tsx`

2. **Add More Transitions**
   - Implement new transitions
   - Follow existing transition patterns
   - **Files:** `apps/web/src/components/Transitions/TransitionsPanel.tsx`

3. **Improve UI/UX**
   - Add tooltips
   - Improve empty states
   - Add loading states
   - **Files:** Various component files

4. **Write Tests**
   - Add unit tests for stores
   - Add component tests
   - **Files:** `*.test.ts` files

5. **Documentation**
   - Improve existing docs
   - Add code examples
   - Create tutorials
   - **Files:** `docs/` directory

### 🚀 Future Features

1. **Audio Features**
   - Audio mixer
   - Volume keyframes
   - Audio effects
   - **Files:** New files in `packages/audio-engine/`

2. **Color Grading**
   - Color wheels
   - Curves
   - LUTs
   - **Files:** New files in `apps/web/src/components/Color/`

3. **Advanced Effects**
   - Keyframe animation
   - Effect presets
   - Custom effects
   - **Files:** Extend existing effect system

4. **Plugin System**
   - Plugin API
   - Plugin marketplace
   - Example plugins
   - **Files:** `packages/plugin-api/`

---

## Code Standards

### TypeScript

- ✅ **Strict mode** - Always enabled
- ✅ **No `any`** - Use proper types
- ✅ **JSDoc comments** - On all exported functions
- ✅ **Type imports** - Use `import type` when possible

```typescript
/**
 * Example function with JSDoc
 * @param clipId - The clip identifier
 * @param time - Time in seconds
 * @returns The split clip ID
 */
export function splitClip(clipId: string, time: number): string {
  // Implementation
}
```

### React

- ✅ **Functional components** - No class components
- ✅ **Hooks** - Use custom hooks for logic
- ✅ **TypeScript** - All components typed
- ✅ **Props interface** - Define props interface

```typescript
interface MyComponentProps {
  title: string;
  onClose: () => void;
}

export function MyComponent({ title, onClose }: MyComponentProps) {
  // Implementation
}
```

### CSS

- ✅ **CSS Modules** or **scoped CSS**
- ✅ **CSS Variables** - Use existing variables
- ✅ **BEM naming** - For class names
- ✅ **Mobile-first** - Responsive design

```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.my-component__header {
  padding: var(--space-3);
}

.my-component--active {
  border-color: var(--primary);
}
```

### File Naming

- ✅ **PascalCase** - Components (`MyComponent.tsx`)
- ✅ **camelCase** - Utilities (`myUtility.ts`)
- ✅ **kebab-case** - CSS files (`my-component.css`)

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { useTimelineStore } from './timeline-store';

describe('Timeline Store', () => {
  it('should split clip correctly', () => {
    const store = useTimelineStore.getState();
    // Test implementation
  });
});
```

---

## Pull Request Process

### Before Submitting

1. ✅ **Code compiles** - No TypeScript errors
2. ✅ **Tests pass** - All tests green
3. ✅ **Linting passes** - No lint errors
4. ✅ **Formatted** - Code is formatted
5. ✅ **Documentation** - Updated if needed
6. ✅ **Changelog** - Updated if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots
If applicable

## Checklist
- [ ] Code compiles
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Changelog updated
```

### Review Process

1. **Automated checks** - CI runs tests
2. **Code review** - Maintainer reviews code
3. **Feedback** - Address review comments
4. **Approval** - Maintainer approves
5. **Merge** - PR is merged

---

## Questions?

### Communication Channels

- **GitHub Discussions** - [github.com/omnicut/omnicut/discussions](https://github.com/omnicut/omnicut/discussions)
- **Discord** - [discord.gg/omnicut](https://discord.gg/omnicut)
- **Twitter** - [@omnicutapp](https://twitter.com/omnicutapp)

### Getting Help

- **Documentation** - Check `docs/` directory
- **Examples** - Look at existing code
- **Ask** - Open a discussion on GitHub

### Reporting Bugs

1. Check if bug already reported
2. Create detailed bug report
3. Include steps to reproduce
4. Include screenshots if applicable
5. Include browser/OS information

### Suggesting Features

1. Check if feature already suggested
2. Create detailed feature request
3. Explain use case
4. Provide examples if possible

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the app (for major contributions)

---

## Thank You! 🎉

Thank you for contributing to OmniCut! Every contribution, no matter how small, helps make OmniCut better for everyone.

**Let's build the future of video editing together!** 🚀

---

*Last Updated: May 6, 2026*  
*Current Version: 1.0.0-alpha*  
*Completion: 87%*
