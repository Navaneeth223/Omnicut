# Getting Started with OmniCut

Welcome to OmniCut! This guide will help you get up and running with development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher ([Installation Guide](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/omnicut/omnicut.git
cd omnicut
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### 3. Build Core Packages

```bash
pnpm build
```

This builds the core packages that other apps depend on.

## Development

### Running the Web App

```bash
cd apps/web
pnpm dev
```

The web app will be available at `http://localhost:5173`

### Running All Apps

From the root directory:

```bash
pnpm dev
```

This starts all development servers concurrently.

## Project Structure

```
omnicut/
├── apps/
│   ├── web/                 # React web application
│   ├── desktop/             # Electron desktop app
│   ├── mobile/              # Capacitor mobile app
│   └── server/              # Backend server (optional)
├── packages/
│   ├── core/                # Core types and utilities
│   ├── media-engine/        # Media processing
│   ├── audio-engine/        # Audio processing
│   ├── video-engine/        # Video processing
│   ├── ui/                  # UI component library
│   └── ...
├── plugins/                 # Plugin examples
└── docs/                    # Documentation
```

## Key Commands

### Development
- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm typecheck` - Type check all code
- `pnpm format` - Format all code with Prettier

### Package-Specific
- `cd apps/web && pnpm dev` - Run web app only
- `cd packages/core && pnpm test` - Test core package only

## Making Your First Edit

1. Open `apps/web/src/App.tsx`
2. Make a change to the UI
3. Save the file
4. See the changes hot-reload in your browser

## Next Steps

- Read the [Architecture Overview](./architecture.md)
- Explore the [API Documentation](./api/)
- Check out [Contributing Guidelines](../CONTRIBUTING.md)
- Join our [Discord Community](https://discord.gg/omnicut)

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, you can change it in `apps/web/vite.config.ts`:

```ts
server: {
  port: 3000, // Change to any available port
}
```

### Build Errors

If you encounter build errors, try:

```bash
# Clean all build artifacts
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Type Errors

Make sure all packages are built:

```bash
pnpm build
```

## Getting Help

- **Documentation**: [docs.omnicut.app](https://docs.omnicut.app)
- **Discord**: [discord.gg/omnicut](https://discord.gg/omnicut)
- **GitHub Issues**: [github.com/omnicut/omnicut/issues](https://github.com/omnicut/omnicut/issues)
- **GitHub Discussions**: [github.com/omnicut/omnicut/discussions](https://github.com/omnicut/omnicut/discussions)
