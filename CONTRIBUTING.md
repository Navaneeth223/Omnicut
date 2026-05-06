# Contributing to OmniCut

Thank you for your interest in contributing to OmniCut! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Be respectful, inclusive, and constructive.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/omnicut.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feat/your-feature-name`

## Development Workflow

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
- `timeline`, `audio`, `color`, `export`, `ui`, `core`, etc.

**Examples:**
```
feat(timeline): add ripple delete across all tracks
fix(audio): resolve crackling in reverb effect
perf(video): optimize GPU shader compilation
docs(api): add plugin development examples
```

### Code Standards

- **TypeScript**: Strict mode, no `any`
- **React**: Functional components only
- **Testing**: Write tests for new features
- **Documentation**: JSDoc on all exported functions
- **Formatting**: Run `pnpm format` before committing

### Testing

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

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Project Structure

- `apps/` - Application entry points (web, desktop, mobile)
- `packages/` - Shared packages and libraries
- `plugins/` - Plugin examples
- `docs/` - Documentation

## Areas to Contribute

### High Priority
- Core timeline functionality
- Media import/export
- Audio engine
- Video effects
- Performance optimization

### Good First Issues
Look for issues labeled `good-first-issue` on GitHub.

### Documentation
- Improve existing docs
- Add code examples
- Create tutorials
- Translate to other languages

### Testing
- Increase test coverage
- Add e2e tests
- Performance benchmarks

## Plugin Development

See [Plugin Development Guide](docs/plugin-development.md) for creating plugins.

## Questions?

- Open a [GitHub Discussion](https://github.com/omnicut/omnicut/discussions)
- Join our [Discord](https://discord.gg/omnicut)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
