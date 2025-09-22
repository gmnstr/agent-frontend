# Architecture Overview

## System Architecture

The Agent Frontend is a modern React application built with TypeScript and Vite, following a component-based architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│                React Application                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Components  │  │    State Mgmt       │  │
│  │             │  │             │  │                     │  │
│  │ - Home      │  │ - TaskList  │  │ - React Query       │  │
│  │ - Tasks     │  │ - AppShell  │  │ - Zustand           │  │
│  │ - Settings  │  │ - TopBar    │  │ - Context API       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Hooks      │  │  API Layer  │  │    Utilities        │  │
│  │             │  │             │  │                     │  │
│  │ - Voice     │  │ - tasks.ts  │  │ - formatTime        │  │
│  │ - Hotkeys   │  │ - envs.ts   │  │ - telemetry         │  │
│  │ - Streams   │  │ - Mock APIs │  │ - theme             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External APIs                             │
│  (Currently mocked - future real implementations)          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Task API  │  │   Env API   │  │   WebSocket API     │  │
│  │             │  │             │  │                     │  │
│  │ - CRUD ops  │  │ - Config    │  │ - Real-time         │  │
│  │ - Status    │  │ - Health    │  │ - Events            │  │
│  │ - History   │  │ - Logs      │  │ - Notifications     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Architectural Patterns

### 1. Provider Hierarchy
```tsx
<Providers>
  <QueryClientProvider>
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  </QueryClientProvider>
</Providers>
```

### 2. Route-based Organization
- File-based routing with React Router v7
- Nested layouts with outlet context
- Error boundaries at route level

### 3. Component Structure
```
portal/src/
├── app/                    # Application core
│   ├── App.tsx            # Root app component
│   ├── router.tsx         # Route configuration
│   └── routes/            # Page components
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   ├── task-list/        # Task-related components
│   ├── input/            # Input components
│   └── diff/             # Code diff components
├── hooks/                # Custom React hooks
├── api/                  # API layer (currently mocked)
├── types/                # TypeScript definitions
├── lib/                  # Utility functions
└── theme/                # Theme configuration
```

## Data Flow

### State Management Strategy
1. **Server State**: React Query for API data, caching, and synchronization
2. **UI State**: Local React state with useState/useReducer
3. **Global State**: Zustand for cross-component state
4. **Context**: React Context for provider communication (toolbar, theme)

### Data Flow Patterns
```
User Action → Component → Hook → API Layer → Server (Mock)
                ↓
            Local State ← React Query ← Response
                ↓
            UI Update
```

## Key Features

### 1. Mock-First Development
- All APIs currently return mock data
- Simulated real-time events via intervals
- Easy transition to real backend APIs

### 2. Voice Input Integration
- Web Speech API integration
- Browser compatibility handling
- Graceful fallbacks for unsupported browsers

### 3. Real-time Features
- Simulated WebSocket connections
- Event streaming for task updates
- Live status monitoring

### 4. Responsive Design
- Mobile-first approach
- Fluent UI responsive components
- Custom breakpoints for optimal UX

## Technology Decisions

### Why React 18?
- Concurrent features for better performance
- Suspense for data fetching
- Automatic batching for state updates

### Why Vite?
- Fast development server with HMR
- Optimized production builds
- Native ES modules support
- TypeScript support out of the box

### Why Fluent UI?
- Microsoft's design system
- Comprehensive component library
- Accessibility built-in
- Consistent with modern design principles

### Why React Query?
- Powerful server state management
- Built-in caching and synchronization
- Optimistic updates
- Background refetching

## Performance Considerations

### Bundle Optimization
- Code splitting by route
- Lazy loading of heavy components
- Tree shaking of unused code
- Optimized Fluent UI imports

### Runtime Performance
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references
- Virtualization for large lists (when needed)

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preferences

## Security Considerations

### Client-Side Security
- Input validation and sanitization
- XSS prevention through React's built-in protections
- HTTPS enforcement for production
- Secure handling of user data

### API Security (Future)
- Authentication token management
- CORS configuration
- Rate limiting
- Input validation on backend

## Testing Strategy

### Testing Pyramid
1. **Unit Tests**: Individual functions and hooks
2. **Component Tests**: React component behavior
3. **Integration Tests**: Component interactions
4. **E2E Tests**: Full user workflows (future)

### Current Coverage
- **Overall**: 32.2% (Target: 80%+)
- **Primary focus**: TaskListPage.test.tsx
- **Tools**: Vitest, React Testing Library, jsdom

## Future Architecture Considerations

### Scalability
- Micro-frontend architecture for larger teams
- Component library extraction
- Shared utilities package

### Real-time Features
- WebSocket integration
- Server-sent events
- Real-time collaboration features

### Performance
- Service worker for offline support
- Progressive Web App (PWA) features
- Advanced caching strategies

### Backend Integration
- REST API client
- GraphQL integration (if needed)
- Real-time WebSocket connections
- Authentication and authorization