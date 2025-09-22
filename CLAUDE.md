# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Server Management (Recommended)
**Note:** Use these scripts from the project root for the best development experience.

```bash
# Start development server (recommended - includes validation and setup)
./scripts/start.sh

# Stop development server (graceful shutdown)
./scripts/stop.sh

# Restart server
./scripts/stop.sh && ./scripts/start.sh
```

### Core Development
**Note:** Manual commands should be run from the `portal/` directory.

```bash
cd portal
# Start development server (manual)
npm run dev

# Build for production
npm run build

# Run type checking and build
tsc -b && vite build

# Preview production build
npm run preview
```

### Testing
```bash
cd portal
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run a single test file
npm test -- TaskListPage.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Code Quality
```bash
cd portal
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

## Architecture Overview

### Application Structure
This is a React + TypeScript + Vite application located in the `portal/` directory with the following architectural patterns:

**Core Application Flow:**
- `portal/src/main.tsx` → `portal/src/app/App.tsx` → `portal/src/app/router.tsx` → Route Components
- Provider hierarchy: React Query → Theme Provider → Router Provider
- Layout: `RootLayout` → `AppShell` → Page Components

**Key Architectural Patterns:**

1. **Provider-based State Management**
   - React Query for server state and caching
   - Custom theme provider for UI theming
   - Context-based toolbar state management via `RootOutletContext`

2. **Route-based Architecture**
   - File-based routing with React Router v7
   - Nested layouts with outlet context for toolbar communication
   - Error boundaries at route level

3. **Mock-driven Development**
   - All API calls currently use mock data (tasks.ts, environments.ts)
   - Simulated real-time events via `useTaskEventStream`
   - Voice input integration with Web Speech API

### Data Flow Patterns

**Task Management:**
- Tasks fetched via React Query from mock API (`portal/src/api/tasks.ts`)
- Real-time task events simulated through `useTaskEventStream` hook
- Task status pills and filtering handled in task list components

**Environment Management:**
- Environment configuration managed through mock API
- Table-based CRUD interface for environment settings

**Voice Input Integration:**
- `useVoiceInput` hook provides Web Speech API integration
- Handles browser compatibility and error states
- Used in `MainInputComponent` for voice-to-text functionality

### Component Organization

**Layout Components** (`portal/src/components/layout/`):
- `AppShell`: Main application wrapper with responsive design
- `TopBar`: Navigation header with toolbar content injection
- `LeftRail`: Sidebar navigation (exists but usage varies)

**Feature Components**:
- `TaskList` components: Complex task management with filtering, sorting
- `DiffViewer`: Code diff visualization with syntax highlighting
- `MainInputComponent`: Voice and text input with real-time processing
- `EnvironmentTable`: Environment management interface

**UI Patterns**:
- Fluent UI as the component library
- Custom hooks for common functionality (hotkeys, reduced motion, voice input)
- Utility functions for formatting and telemetry

### Testing Strategy

**Current Coverage:** 32.2% (Goal: 80%+)
- Primary test file: `TaskListPage.test.tsx`
- Uses Vitest + React Testing Library + jsdom
- Coverage tracking with `@vitest/coverage-v8`
- Test coverage plan available in `portal/test-coverage-plan.md`

**Critical Testing Areas:**
- API layer mocking (tasks.ts, environments.ts)
- Voice input browser compatibility
- Real-time event stream behavior
- Component interactions and state management

### Key Technical Considerations

**Voice Input:**
- Uses Web Speech API with fallback detection
- Language configuration and error handling
- Browser compatibility varies significantly

**Real-time Features:**
- Event streaming simulated via intervals (not actual WebSocket)
- Event aggregation with maximum event limits
- Connection state management

**Theme System:**
- Fluent UI token-based theming
- Responsive design with mobile breakpoints
- Accessibility considerations (reduced motion support)

**State Management:**
- React Query for server state
- Local state via React hooks
- Context for cross-component communication (toolbar)

## Working with this Codebase

### When Adding New Features
- Follow the established provider → layout → route → component hierarchy
- Use React Query for any server state management
- Mock APIs first, implement real endpoints later
- Add comprehensive tests following the test coverage plan

### When Working with Voice Features
- Test across different browsers (Chrome, Safari, Firefox)
- Handle permission states and errors gracefully
- Consider accessibility implications

### When Working with Real-time Features
- Current implementation uses mock intervals
- Plan for WebSocket integration in `useTaskEventStream`
- Consider event ordering and deduplication

### File Locations for Common Tasks
- **Adding new routes:** `portal/src/app/router.tsx`
- **API integration:** `portal/src/api/` directory
- **Custom hooks:** `portal/src/hooks/` directory
- **UI components:** `portal/src/components/` directory
- **Type definitions:** `portal/src/types/` directory
- **Test files:** Co-located with components or in `__tests__` directories

## Environment Setup

The main application is in the `portal/` directory, which is a React + TypeScript + Vite project. The root directory contains only utility scripts and documentation.

### Key Configuration Files
- `portal/package.json` - Main dependencies and scripts
- `portal/vite.config.ts` - Vite configuration (note: uses vitest.config.ts for test config)
- `portal/eslint.config.js` - ESLint configuration using flat config format
- `portal/vitest.setup.ts` - Test setup and global test configuration

### Dependencies Overview
- **React 18** with TypeScript
- **Fluent UI** (`@fluentui/react-components`) for UI components
- **React Query** (`@tanstack/react-query`) for server state management
- **React Router v7** for routing
- **Zustand** for local state management
- **Vitest** with React Testing Library for testing
- **Highlight.js** for syntax highlighting in diff viewer

## Important Development Notes

### Mock-First Development
- All API calls currently use mock data (`portal/src/api/tasks.ts`, `portal/src/api/environments.ts`)
- Real-time features are simulated with intervals, not actual WebSockets
- Voice input uses browser Web Speech API with graceful fallbacks

### Browser Compatibility Considerations
- Voice input functionality varies significantly across browsers
- Web Speech API requires HTTPS in production
- Reduced motion preferences are respected via custom hook

## Project Structure Updates

### New Additions
- **`scripts/`** - Server management scripts for development
  - `start.sh` - Smart server start with environment validation
  - `stop.sh` - Graceful server shutdown with process cleanup
  - `README.md` - Detailed script documentation
- **`docs/`** - Comprehensive documentation structure
  - `api/` - API documentation and data models
  - `architecture/` - System design and technical decisions
  - `components/` - Component usage guides and patterns
  - `development/` - Setup guides and development workflow
  - `deployment/` - Production deployment instructions
  - `screenshots/` - Visual documentation of all pages

### TypeScript Fixes Applied
Recent fixes have resolved compilation errors:
- Fixed import issues with `TabValue` and `DataGridProps` (type-only imports)
- Resolved SpeechRecognition type definitions in `useVoiceInput` hook
- Fixed Griffel CSS-in-JS styling type errors (numeric to string values)
- Removed problematic keyframes animation temporarily
- Fixed ESLint parameter typing issues

### Current Test Coverage
- **Overall Coverage**: 32.2% (Goal: 80%+)
- **Primary Test File**: `TaskListPage.test.tsx`
- **Testing Framework**: Vitest + React Testing Library + jsdom
- **Test Plan**: Detailed coverage plan available in `portal/test-coverage-plan.md`

## Development Workflow Improvements

### Recommended Workflow
1. **Start Server**: Use `./scripts/start.sh` from project root
   - Includes environment validation
   - Auto-installs missing dependencies
   - Checks for port conflicts
   - Provides clear error messages

2. **Development**:
   - Server runs on `http://localhost:5173`
   - Hot module reloading enabled
   - TypeScript strict mode active

3. **Stop Server**: Use `./scripts/stop.sh` for graceful shutdown
   - Finds all processes on port 5173
   - Attempts graceful termination first
   - Forces cleanup if needed

### Documentation Access
- **Main Documentation**: `docs/README.md`
- **API Reference**: `docs/api/README.md`
- **Architecture Guide**: `docs/architecture/overview.md`
- **Component Guide**: `docs/components/README.md`
- **Development Setup**: `docs/development/setup.md`
- **Deployment Guide**: `docs/deployment/README.md`

## Common Tasks for Claude Code

### Starting Development
```bash
# Recommended approach
./scripts/start.sh

# Manual approach
cd portal && npm run dev
```

### Making Code Changes
1. Follow existing TypeScript patterns
2. Use Fluent UI components and design tokens
3. Write tests for new functionality
4. Run linting: `cd portal && npm run lint`
5. Check build: `cd portal && npm run build`

### Adding New Features
1. Review `docs/components/README.md` for patterns
2. Check `docs/architecture/overview.md` for system design
3. Follow mock-first development approach
4. Add comprehensive tests following `portal/test-coverage-plan.md`

### Troubleshooting
1. **TypeScript Errors**: Check `docs/development/setup.md` troubleshooting section
2. **Server Issues**: Use `./scripts/stop.sh` then `./scripts/start.sh`
3. **Build Failures**: Run `cd portal && npm run build` to see specific errors
4. **Test Failures**: Run `cd portal && npm test` for detailed feedback