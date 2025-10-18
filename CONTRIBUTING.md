# Contributing to Runic CMS

Thank you for considering contributing to Runic CMS! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Include:**
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node version, browser)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing feature requests**
2. **Use the feature request template**
3. **Explain:**
   - The problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Use cases

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Write clear, commented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test thoroughly:**
   ```bash
   # Frontend
   cd frontend
   npm run lint
   npm run build
   
   # Backend
   cd backend
   npm run lint
   npm run build
   ```

5. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add amazing feature"
   git commit -m "fix: resolve issue with X"
   git commit -m "docs: update README"
   ```

6. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Fill out the PR template**

## Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add pricing table element
fix: resolve page editor drag-and-drop issue
docs: update installation guide
refactor: improve API error handling
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for type safety
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- ES6+ features preferred

### React

- Functional components with hooks
- Props interfaces for all components
- Meaningful component names
- Keep components focused and small

### CSS

- Use Tailwind CSS classes when possible
- Custom CSS for complex styling only
- Mobile-first approach
- CSS modules for component-specific styles

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good coverage
- Test edge cases

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

## Documentation

- Update README if needed
- Add JSDoc comments for functions
- Document complex logic
- Include usage examples

## Project Structure

```
runic-cms/
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── types/      # TypeScript types
├── backend/            # Express backend
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Express middleware
│   │   └── db/         # Database
└── docs/               # Documentation
```

## Development Workflow

1. **Set up development environment:**
   ```bash
   # Install dependencies
   npm install
   
   # Start backend
   cd backend && npm run dev
   
   # Start frontend (in another terminal)
   cd frontend && npm run dev
   ```

2. **Make changes**
3. **Test locally**
4. **Create pull request**
5. **Address review feedback**
6. **Get merged!**

## Review Process

1. **Automated checks** run on PR
2. **Maintainer review** (usually within 48 hours)
3. **Feedback addressed**
4. **Approved and merged**

## Release Process

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

## Questions?

- **Discord:** discord.gg/runic-cms
- **GitHub Discussions:** github.com/yourusername/runic-cms/discussions
- **Email:** contribute@runic-cms.com

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in our documentation

Thank you for helping make Runic CMS better! 🎉
