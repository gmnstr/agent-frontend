# Development Setup Guide

## Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **npm** 8+ (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Vitest

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agent-frontend
```

### 2. Install Dependencies
```bash
# Install root dependencies (for screenshots)
npm install

# Install portal dependencies
cd portal
npm install
```

### 3. Start Development Server

#### Recommended: Use Smart Scripts
```bash
# From project root - includes validation and setup
./scripts/start.sh
```

#### Manual: Direct npm commands
```bash
cd portal
npm run dev
```

The application will be available at `http://localhost:5173`

### Server Management
```bash
# Start development server (recommended)
./scripts/start.sh   # Smart start with environment validation

# Stop development server
./scripts/stop.sh    # Graceful shutdown with cleanup

# Restart server
./scripts/stop.sh && ./scripts/start.sh

# Check what's running on port 5173
lsof -i :5173
```

**Why use the scripts?**
- ✅ Automatic environment validation (Node.js, npm, project structure)
- 📦 Auto-installs portal dependencies if missing
- 🔍 Detects and handles port conflicts gracefully
- 🛡️ Proper cleanup on shutdown (Ctrl+C handling)
- 📊 Clear status reporting and error messages
- 🚀 Faster development workflow

## Development Commands

All commands should be run from the `portal/` directory:

### Core Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- TaskListPage.test.tsx
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint -- --fix
```

## Project Structure

```
agent-frontend/
├── README.md                 # Root documentation
├── CLAUDE.md                # Claude Code guidance
├── package.json             # Root package (screenshot tool)
├── screenshot.js            # Screenshot utility
├── docs/                    # Documentation
└── portal/                  # Main React application
    ├── public/              # Static assets
    ├── src/                 # Source code
    │   ├── app/            # Application core
    │   ├── components/     # UI components
    │   ├── hooks/          # Custom hooks
    │   ├── api/            # API layer
    │   ├── types/          # TypeScript definitions
    │   ├── lib/            # Utilities
    │   └── theme/          # Theme configuration
    ├── package.json        # Portal dependencies
    ├── vite.config.ts      # Vite configuration
    ├── vitest.config.ts    # Test configuration
    ├── eslint.config.js    # ESLint configuration
    └── tsconfig.json       # TypeScript configuration
```

## Development Workflow

### 1. Feature Development
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Start the dev server: `npm run dev`
3. Make changes with hot reload
4. Write tests for new functionality
5. Run tests: `npm test`
6. Lint code: `npm run lint`
7. Commit changes with descriptive messages

### 2. Component Development
1. Create component in appropriate directory under `src/components/`
2. Add TypeScript types for props
3. Write unit tests in `.test.tsx` file
4. Add to Storybook (future enhancement)
5. Update component documentation

### 3. API Integration
1. Current APIs are in `src/api/` with mock data
2. Follow existing patterns for new endpoints
3. Use React Query for state management
4. Add error handling and loading states

## Configuration Files

### TypeScript Configuration
- `tsconfig.json` - Main TypeScript config
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node.js config

### Build Configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test runner configuration

### Code Quality
- `eslint.config.js` - ESLint flat config format
- `.gitignore` - Git ignore patterns

## Environment Variables

Currently, no environment variables are required for development. The application uses mock data and local development server.

For future production deployment, consider:
```bash
# .env.local (not committed)
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=development
```

## Common Development Tasks

### Adding a New Page
1. Create component in `src/app/routes/`
2. Add route to `src/app/router.tsx`
3. Update navigation if needed
4. Add tests for the new page

### Adding a New Component
1. Create component file in appropriate `src/components/` subdirectory
2. Define TypeScript interfaces for props
3. Use Fluent UI components and design tokens
4. Add unit tests
5. Export from index files if needed

### Adding a New Hook
1. Create hook in `src/hooks/`
2. Follow naming convention: `use[HookName].ts`
3. Add TypeScript types for parameters and return values
4. Write unit tests for the hook
5. Add JSDoc comments for documentation

### Styling Guidelines
1. Use Fluent UI design tokens for colors, spacing, typography
2. Create styles with `makeStyles` from `@fluentui/react-components`
3. Follow responsive design patterns
4. Use semantic CSS class names
5. Ensure accessibility compliance

### Testing Guidelines
1. Test user interactions, not implementation details
2. Use React Testing Library queries and best practices
3. Mock external dependencies (APIs, localStorage, etc.)
4. Test error states and edge cases
5. Aim for 80%+ test coverage

## Troubleshooting

### Common Issues

#### TypeScript Errors
- Run `npm run build` to see all TypeScript errors
- Check import paths and type definitions
- Ensure all dependencies are properly typed

#### Hot Reload Not Working
- Restart the development server: `./scripts/stop.sh && ./scripts/start.sh`
- Clear browser cache
- Check for console errors

#### Server Won't Start
- Check if port 5173 is already in use: `lsof -i :5173`
- Stop existing processes: `./scripts/stop.sh`
- Verify Node.js and npm versions meet requirements
- Check for permission issues with script execution

#### Server Won't Stop
- Use the stop script: `./scripts/stop.sh`
- If script fails, manually kill processes: `lsof -ti:5173 | xargs kill -9`
- Check for zombie processes: `ps aux | grep node`

#### Test Failures
- Run tests individually to isolate issues
- Check mock data and API responses
- Verify component props and state

#### Build Errors
- Check for TypeScript compilation errors
- Verify all imports are correct
- Ensure no unused variables or imports

### Performance Issues
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Optimize heavy computations with useMemo
- Consider code splitting for large components

## IDE Setup

### VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vitest.explorer",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### VS Code Settings
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "files.associations": {
    "*.css": "css"
  }
}
```

## Getting Help

1. Check existing documentation in `docs/`
2. Review component examples in the codebase
3. Check React Query documentation for API patterns
4. Review Fluent UI documentation for component usage
5. Check TypeScript documentation for type issues

## Contributing

1. Follow the established code style and patterns
2. Write comprehensive tests for new features
3. Update documentation when adding new functionality
4. Use descriptive commit messages
5. Create detailed pull request descriptions