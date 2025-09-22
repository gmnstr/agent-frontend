# Test Coverage Plan

## Objective
Achieve 80%+ test coverage across all branches, functions, and lines with a fully green test suite.

## Current State
- **Overall Coverage**: 32.2% (Target: 80%+)
- **Branch Coverage**: 58.12% (Target: 80%+)
- **Function Coverage**: 54.28% (Target: 80%+)
- **Line Coverage**: 32.2% (Target: 80%+)
- **Test Files**: 1 (TaskListPage.test.tsx)
- **Total Source Files**: 34

## Definition of Done
- [ ] All test suites pass (green)
- [ ] 80%+ line coverage on all files
- [ ] 80%+ branch coverage on all files
- [ ] 80%+ function coverage on all files
- [ ] Comprehensive test suite covering all critical user journeys

## Coverage Gap Analysis

### High Priority Files (0% Coverage - Critical Business Logic)
1. **API Layer** (0% coverage)
   - `src/api/tasks.ts` - Task management API
   - `src/api/environments.ts` - Environment management API

2. **Core Application** (0% coverage)
   - `src/main.tsx` - Application entry point
   - `src/app/App.tsx` - Main app component
   - `src/app/router.tsx` - Routing configuration

3. **Key Pages** (0% coverage)
   - `src/app/routes/home/HomePage.tsx` - Main dashboard
   - `src/app/routes/tasks/TaskListPage.tsx` - Task management
   - `src/app/routes/settings/EnvironmentsPlaceholder.tsx` - Settings

4. **Critical Components** (0% coverage)
   - `src/components/input/MainInputComponent.tsx` - Voice/text input
   - `src/components/environments/EnvironmentTable.tsx` - Environment management
   - `src/components/layout/TopBar.tsx` - Navigation
   - `src/components/layout/LeftRail.tsx` - Sidebar navigation
   - `src/components/layout/AppShell.tsx` - Layout wrapper

### Medium Priority Files (Partial Coverage)
1. **Hooks** (34.76% coverage)
   - `src/hooks/useVoiceInput.ts` (0% coverage) - Voice input functionality
   - `src/hooks/useHotkey.ts` (70.27% coverage) - Keyboard shortcuts
   - `src/hooks/usePrefersReducedMotion.ts` (57.57% coverage) - Accessibility
   - `src/hooks/useTaskEventStream.ts` (61.97% coverage) - Real-time updates

2. **Utilities** (Partial coverage)
   - `src/lib/telemetry.ts` (65.62% coverage) - Analytics tracking
   - `src/lib/formatRelativeTime.ts` (70.96% coverage) - Time formatting

### Low Priority Files (Good Coverage)
1. **Well-tested Components** (>80% coverage)
   - `src/app/routes/tasks/TaskDetailPlaceholder.tsx` (99.12%)
   - `src/components/diff/CodeDiffViewer.tsx` (94.73%)
   - `src/components/task-list/TaskListToolbar.tsx` (100%)
   - `src/components/task-list/TaskStatusPill.tsx` (100%)
   - `src/components/task-list/TaskList.tsx` (89.03%)

## Implementation Plan

### Phase 1: Foundation Tests (Week 1)
**Goal**: Establish testing infrastructure and cover critical paths

#### 1.1 API Layer Testing
- [ ] **tasks.ts** - Create comprehensive API tests
  - Test all CRUD operations
  - Mock HTTP requests/responses
  - Error handling scenarios
  - Loading states

- [ ] **environments.ts** - Environment API tests
  - Environment CRUD operations
  - Configuration validation
  - Error scenarios

#### 1.2 Core Application Tests
- [ ] **App.tsx** - Application component tests
  - Router integration
  - Theme provider setup
  - Error boundary integration

- [ ] **router.tsx** - Routing tests
  - Route configuration
  - Navigation flows
  - Route guards/protection

### Phase 2: Component Testing (Week 2)
**Goal**: Cover all React components with comprehensive tests

#### 2.1 Layout Components
- [ ] **AppShell.tsx** - Layout wrapper tests
  - Responsive behavior
  - Theme switching
  - Navigation state

- [ ] **TopBar.tsx** - Navigation tests
  - Menu interactions
  - User actions
  - Search functionality

- [ ] **LeftRail.tsx** - Sidebar tests
  - Navigation items
  - Collapse/expand behavior
  - Active state management

#### 2.2 Page Components
- [ ] **HomePage.tsx** - Dashboard tests
  - Data loading
  - Interactive elements
  - Real-time updates

- [ ] **TaskListPage.tsx** - Task management tests
  - Task CRUD operations
  - Filtering and sorting
  - Pagination

- [ ] **EnvironmentsPlaceholder.tsx** - Settings tests
  - Configuration management
  - Form validation
  - Save/cancel operations

### Phase 3: Advanced Features (Week 3)
**Goal**: Test complex interactions and edge cases

#### 3.1 Input Components
- [ ] **MainInputComponent.tsx** - Input system tests
  - Voice input integration
  - Text input handling
  - Input validation
  - Submission flows

#### 3.2 Environment Management
- [ ] **EnvironmentTable.tsx** - Environment table tests
  - Table interactions
  - CRUD operations
  - Data validation
  - Bulk operations

#### 3.3 Task List Components
- [ ] **TaskListSimplified.tsx** - Simplified view tests
  - View switching
  - Data display
  - User interactions

### Phase 4: Hooks and Utilities (Week 4)
**Goal**: Achieve comprehensive coverage of custom hooks and utilities

#### 4.1 Custom Hooks
- [ ] **useVoiceInput.ts** - Voice input hook tests
  - Voice recognition
  - Permission handling
  - Error states
  - Browser compatibility

- [ ] **useHotkey.ts** - Hotkey tests (improve from 70% to 80%+)
  - Key combinations
  - Event handling
  - Cleanup

- [ ] **usePrefersReducedMotion.ts** - Accessibility tests
  - Media query detection
  - State changes
  - Fallback behavior

- [ ] **useTaskEventStream.ts** - Real-time tests
  - WebSocket connections
  - Event handling
  - Reconnection logic

#### 4.2 Utility Functions
- [ ] **telemetry.ts** - Analytics tests (improve from 65% to 80%+)
  - Event tracking
  - Privacy compliance
  - Error handling

- [ ] **formatRelativeTime.ts** - Time formatting tests
  - Various time formats
  - Edge cases
  - Localization

### Phase 5: Integration & Edge Cases (Week 5)
**Goal**: Test component interactions and error scenarios

#### 5.1 Integration Tests
- [ ] **End-to-end user journeys**
  - Task creation workflow
  - Environment setup flow
  - Voice input to task completion

#### 5.2 Error Boundary & Edge Cases
- [ ] **RouteErrorBoundary.tsx** - Error handling tests
  - Error display
  - Recovery actions
  - Fallback UI

- [ ] **RootLayout.tsx** - Root layout tests
  - Global state management
  - Context providers
  - Error boundaries

#### 5.3 Entry Point & Configuration
- [ ] **main.tsx** - Application bootstrap tests
  - DOM mounting
  - Initial setup
  - Error handling

## Testing Strategy

### Test Types
1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions
3. **API Tests**: Mock external dependencies
4. **Accessibility Tests**: Screen reader compatibility
5. **Visual Regression Tests**: UI consistency

### Testing Tools & Setup
- **Framework**: Vitest (already configured)
- **React Testing**: @testing-library/react
- **Mocking**: vi.mock() for API calls
- **Coverage**: @vitest/coverage-v8
- **Accessibility**: @testing-library/jest-dom

### Test File Organization
```
src/
├── __tests__/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── integration/
└── [component-name]/
    └── [ComponentName].test.tsx
```

### Coverage Configuration
Update `vite.config.ts` to include coverage thresholds:
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
}
```

## Success Metrics
- [ ] All 34 source files have 80%+ coverage
- [ ] Zero failing tests
- [ ] Coverage report shows green across all metrics
- [ ] CI/CD pipeline includes coverage checks
- [ ] Coverage reports are generated on each PR

## Timeline: 5 Weeks Total
- **Week 1**: API & Core Application (Foundation)
- **Week 2**: React Components (UI Layer)
- **Week 3**: Advanced Features (Complex Interactions)
- **Week 4**: Hooks & Utilities (Custom Logic)
- **Week 5**: Integration & Polish (End-to-End)

## Risk Mitigation
1. **Complex Components**: Start with simpler test cases, gradually add complexity
2. **Voice Input Testing**: Use mocked Web APIs for consistent testing
3. **Real-time Features**: Mock WebSocket connections
4. **API Dependencies**: Comprehensive mocking strategy
5. **Time-sensitive Tests**: Use fake timers for consistent results

## Maintenance
- Run coverage report on every commit
- Block PRs that reduce coverage below 80%
- Regular review and update of test cases
- Monitor and fix flaky tests immediately