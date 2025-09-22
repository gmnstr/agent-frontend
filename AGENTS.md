# AGENTS.md

This file provides AI coding agents with project-specific context, guidelines, and workflows for the Agent Frontend project.

## Project Overview

Agent Frontend is a React + TypeScript application for managing AI agent tasks and development environments. It uses Vite for build tooling, Fluent UI for components, React Query for state management, and follows a mock-first development approach.

## Development Environment Setup

### Server Management (Recommended)
```bash
# Start development server with validation
./scripts/start.sh

# Stop development server gracefully
./scripts/stop.sh

# Restart server
./scripts/stop.sh && ./scripts/start.sh
```

### Manual Commands
```bash
# From portal/ directory
cd portal

# Development
npm run dev          # Start dev server (manual)
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests
npm test -- --coverage  # Run with coverage
npm test -- --watch     # Watch mode
npm test -- TaskListPage.test.tsx  # Single file

# Code Quality
npm run lint         # Run ESLint
npm run lint -- --fix   # Auto-fix issues
```

### Package Management
- Use `npm` for dependency management
- All development commands run from `portal/` directory
- Root `package.json` only contains screenshot utility
- Main application is in `portal/` subdirectory

## Code Style Guidelines

### Do ✅
- **React Patterns**: Use functional components with hooks
- **TypeScript**: Strict mode enabled - define interfaces for all props
- **Fluent UI**: Use `@fluentui/react-components` for all UI components
- **Styling**: Use `makeStyles` from Fluent UI with design tokens
- **State Management**: React Query for server state, local state with hooks
- **Imports**: Use type-only imports when needed (`import type { ... }`)
- **File Organization**: Follow established directory structure in `portal/src/`
- **Component Props**: Define clear TypeScript interfaces
- **Error Handling**: Include proper error states and loading states
- **Accessibility**: Add ARIA labels and keyboard navigation support

### Don't ❌
- **No CSS files** - Use Griffel CSS-in-JS with makeStyles
- **No class components** - Use functional components only
- **No hardcoded values** - Use Fluent UI design tokens for colors/spacing
- **No direct DOM manipulation** - Use React patterns and refs
- **No console.log** in production code - Use proper error handling
- **No relative imports beyond 2 levels** - Keep imports clean
- **No inline styles** - Use makeStyles for all styling
- **No generic div/span** if Fluent UI component exists

## Component Development Patterns

### Component Structure
```typescript
import type { ReactNode } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'

interface ComponentProps {
  title: string
  onAction: (data: FormData) => void
  isLoading?: boolean
  children?: ReactNode
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
})

export const Component = ({ title, onAction, isLoading = false }: ComponentProps) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      {/* Component implementation */}
    </div>
  )
}
```

### Event Handlers
```typescript
const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  onAction?.(data)
}, [onAction, data])
```

### API Integration
- Use React Query hooks for all API calls
- Current APIs are mocked in `portal/src/api/`
- Follow established patterns in `tasks.ts` and `environments.ts`

## Testing Instructions

### Running Tests
```bash
cd portal

# Run all tests with coverage
npm test -- --coverage

# Target 80%+ coverage (currently 32.2%)
# Main test file: TaskListPage.test.tsx
# Follow test-coverage-plan.md for systematic coverage improvement
```

### Testing Patterns
- Use React Testing Library and Vitest
- Test user interactions, not implementation details
- Mock external dependencies (APIs, localStorage)
- Include accessibility tests with screen reader queries

### Test File Locations
- Co-locate test files with components: `Component.test.tsx`
- Integration tests in `__tests__/` directories
- Follow patterns in existing `TaskListPage.test.tsx`

## File-Scoped Development Commands

### TypeScript Checking
```bash
cd portal
npx tsc --noEmit  # Type check without building
```

### Linting Specific Files
```bash
cd portal
npx eslint src/components/ComponentName.tsx
npx eslint src/components/ComponentName.tsx --fix
```

### Testing Specific Components
```bash
cd portal
npm test -- ComponentName.test.tsx
npm test -- ComponentName.test.tsx --watch
```

## Architecture Patterns

### Directory Structure
```
portal/src/
├── app/              # Application core (routes, router)
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (AppShell, TopBar)
│   ├── task-list/   # Task-related components
│   ├── input/       # Input components with voice support
│   └── diff/        # Code diff visualization
├── hooks/           # Custom React hooks
├── api/             # API layer (currently mocked)
├── types/           # TypeScript definitions
├── lib/             # Utility functions
└── theme/           # Theme configuration
```

### State Management Strategy
1. **Server State**: React Query for API data and caching
2. **UI State**: Local React state with useState/useReducer
3. **Global State**: Zustand for cross-component state
4. **Context**: React Context for provider communication

### Mock-First Development
- All APIs return mock data from `portal/src/api/`
- Real-time features simulated with intervals
- Easy transition to real backend APIs planned

## TypeScript Guidelines

### Common Fixes Applied
- Use type-only imports: `import type { TabValue } from '@fluentui/react-components'`
- String values for CSS properties: `margin: '-1px'` not `margin: -1`
- Proper SpeechRecognition types imported from `../types/speech.d.ts`
- Explicit parameter types: `(_: unknown, data: { value: string }) =>`

### Styling Type Safety
```typescript
const useStyles = makeStyles({
  container: {
    width: '100%',           // ✅ String value
    height: '1px',           // ✅ String value
    margin: '-1px',          // ✅ String value
    // width: 1,             // ❌ Numeric not allowed
  },
})
```

## Commit and PR Guidelines

### Commit Message Format
```
<type>: <description>

- <detailed changes>
- <additional context>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Pre-commit Checklist
```bash
cd portal
npm run lint           # Must pass
npm test              # Must pass
npm run build         # Must succeed
```

### PR Requirements
- Include clear description of changes
- Reference any related issues
- Ensure tests pass and coverage doesn't decrease
- Update documentation if needed

## Security and Performance

### Security Guidelines
- Never commit sensitive keys or tokens
- Validate all user inputs
- Use HTTPS in production for Web Speech API
- Follow Fluent UI accessibility patterns

### Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states
- Consider code splitting for large features
- Optimize images and assets

## Common Troubleshooting

### TypeScript Errors
- Run `npm run build` to see all compilation errors
- Check import paths and type definitions
- Ensure Fluent UI components are imported correctly

### Server Issues
- Use `./scripts/stop.sh` then `./scripts/start.sh` for restart
- Check port 5173 for conflicts: `lsof -i :5173`
- Verify Node.js 18+ and npm are installed

### Test Failures
- Run individual tests to isolate issues
- Check mock data matches expected interfaces
- Verify component props and state handling

## Documentation

### Key Documentation Files
- `docs/README.md` - Main documentation overview
- `docs/development/setup.md` - Detailed setup guide
- `docs/components/README.md` - Component patterns and guidelines
- `docs/architecture/overview.md` - System design and patterns
- `CLAUDE.md` - Claude Code specific guidance

### Updating Documentation
- Update relevant docs when adding new features
- Include screenshots for UI changes in `docs/screenshots/`
- Follow established markdown formatting
- Keep examples current and tested

## Voice Input Considerations

### Web Speech API Guidelines
- Browser compatibility varies significantly
- Requires HTTPS in production
- Include graceful fallbacks for unsupported browsers
- Test across Chrome, Safari, Firefox
- Handle permission states and errors properly

### Implementation Pattern
```typescript
const { isSupported, isRecording, transcript, start, stop } = useVoiceInput({
  lang: 'en-US'
})

// Always check isSupported before using voice features
if (isSupported) {
  // Enable voice input UI
}
```

## Goals and Metrics

### Current Status
- **Test Coverage**: 32.2% (Goal: 80%+)
- **TypeScript**: Strict mode with zero compilation errors
- **Performance**: Optimized Vite build with code splitting
- **Documentation**: Comprehensive docs structure established

### Improvement Targets
- Increase test coverage systematically per `test-coverage-plan.md`
- Implement real WebSocket connections for real-time features
- Add authentication and user management
- Enhanced error handling and user feedback