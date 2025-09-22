# Codex Portal UI - Complete Redesign Technical Specification

## Overview

Transform the existing basic task management interface into a comprehensive Codex-style AI coding portal that enables developers to interact with AI coding agents, manage coding tasks, view detailed code diffs, and manage development environments.

## 1. Design System & Visual Identity

### 1.1 Brand Identity
- **Logo**: Codex wordmark with circular icon containing stylized brackets `{ }`
- **Primary Colors**:
  - Background: `#0D1117` (GitHub dark)
  - Surface: `#161B22`
  - Surface Elevated: `#21262D`
  - Primary Blue: `#58A6FF`
  - Success Green: `#3FB950`
  - Warning Orange: `#D29922`
  - Error Red: `#F85149`
  - Purple Accent: `#BC8CFF`

### 1.2 Typography Scale
- **Headings**: Inter font family
  - H1: 32px/40px, weight 600
  - H2: 24px/32px, weight 600
  - H3: 20px/28px, weight 600
  - H4: 16px/24px, weight 600
- **Body**: Inter font family
  - Large: 16px/24px, weight 400
  - Medium: 14px/20px, weight 400
  - Small: 12px/16px, weight 400
- **Code**: JetBrains Mono, 14px/20px

### 1.3 Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- Container max-width: 1200px
- Sidebar width: 240px (collapsed: 60px)

### 1.4 Component Library
- Built on Fluent UI React Components
- Custom theme tokens for Codex branding
- Consistent border radius: 6px
- Box shadows:
  - Subtle: `0 1px 3px rgba(0,0,0,0.12)`
  - Medium: `0 4px 12px rgba(0,0,0,0.15)`
  - Strong: `0 8px 24px rgba(0,0,0,0.20)`

## 2. Layout Architecture

### 2.1 Global Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ TopBar (64px height)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Main Content Area                                           │
│ (Dynamic based on route)                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 TopBar Component Specification
- **Height**: 64px fixed
- **Background**: `#161B22` with bottom border `#30363D`
- **Left Section**:
  - Codex logo + wordmark (clickable, navigates to home)
  - Logo: 32x32px circular icon
  - Wordmark: Inter 20px semibold
- **Right Section**:
  - Settings link (14px text, hover state)
  - Docs link (14px text, hover state)
  - Profile avatar (32x32px circular)
  - Plus badge indicator
- **Responsive**: On mobile (<768px), show hamburger menu

### 2.3 Route-Based Layouts

#### Home Layout
```
┌─────────────────────────────────────────────────────────────┐
│ TopBar                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               Hero Section (centered)                       │
│                                                             │
│               Task Management Section                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Task Detail Layout
```
┌─────────────────────────────────────────────────────────────┐
│ TopBar                                                      │
├─────────────────────────────────────────────────────────────┤
│ Task Header (breadcrumb + actions)                         │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │ Main Content (Code Diff Viewer)                 │
│ (320px)  │                                                 │
│          │                                                 │
└──────────┴──────────────────────────────────────────────────┤
│ Bottom Input Bar                                            │
└─────────────────────────────────────────────────────────────┘
```

#### Settings Layout
```
┌─────────────────────────────────────────────────────────────┐
│ TopBar                                                      │
├─────────────────────────────────────────────────────────────┤
│ Page Header                                                 │
├──────────┬──────────────────────────────────────────────────┤
│ Nav      │ Content Area                                    │
│ Sidebar  │                                                 │
│ (200px)  │                                                 │
└──────────┴──────────────────────────────────────────────────┘
```

## 3. Page-Specific Components

### 3.1 Homepage Components

#### 3.1.1 Hero Section
- **Container**: Centered, max-width 800px, padding 80px 24px
- **Heading**: "What should we code next?"
  - Font: Inter 32px/40px semibold
  - Color: `#F0F6FC`
  - Margin bottom: 48px
- **Input Section**:
  - Container background: `#21262D`
  - Border radius: 12px
  - Padding: 16px
  - Border: 1px solid `#30363D`
  - Focus state: border color `#58A6FF`, glow effect

#### 3.1.2 Main Input Component
```typescript
interface MainInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (action: 'ask' | 'code') => void;
  isLoading?: boolean;
  hasVoiceInput?: boolean;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ 🎤  [Describe a task...........................] 🎤  Ask Code │
└─────────────────────────────────────────────────────────────┘
```

- **Microphone Icons**:
  - Left: Attachment/file upload (16px icon)
  - Right: Voice input (16px icon, pulse animation when active)
- **Input Field**:
  - Min height: 48px
  - Expandable to 120px max
  - Font: Inter 16px
  - Placeholder: "Describe a task"
- **Action Buttons**:
  - "Ask" button: Secondary style, 32px height
  - "Code" button: Primary style, 32px height, prominent

#### 3.1.3 Task Management Section
- **Tabs**:
  - Tasks (default active)
  - Archive
  - Tab height: 48px
  - Active indicator: 2px blue underline
- **Task List Container**:
  - Max width: 1000px centered
  - Background: `#0D1117` (transparent)

### 3.2 Task List Components

#### 3.2.1 Task Item Component
```typescript
interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  repository: string;
  branch: string;
  status: 'open' | 'merged' | 'closed';
  diffStats: {
    additions: number;
    deletions: number;
  };
  onClick: () => void;
}
```

**Visual Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Task Title                                    [Open] +1054 -897 │
│ 10 min • gmnstr/code-search... • codex/implement-dependency_ci_... │
└─────────────────────────────────────────────────────────────┘
```

**Styling**:
- **Container**:
  - Padding: 16px 20px
  - Border bottom: 1px solid `#21262D`
  - Hover: background `#161B22`
  - Cursor: pointer
- **Title**: Inter 16px semibold, color `#F0F6FC`
- **Metadata Row**:
  - Font: Inter 14px regular
  - Color: `#8B949E`
  - Items separated by " • "
- **Status Badge**:
  - Open: `#3FB950` background, white text
  - Merged: `#BC8CFF` background, white text
  - Closed: `#F85149` background, white text
  - Padding: 4px 8px, border radius 4px
- **Diff Stats**:
  - Additions: `+{number}` in `#3FB950`
  - Deletions: `-{number}` in `#F85149`
  - Font: JetBrains Mono 14px

### 3.3 Task Detail Components

#### 3.3.1 Task Header
```typescript
interface TaskHeaderProps {
  task: {
    title: string;
    date: string;
    repository: string;
    branch: string;
    diffStats: DiffStats;
  };
  onBack: () => void;
  onArchive: () => void;
  onShare: () => void;
  onViewPR: () => void;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ ← Task Title                           Archive Share View PR │
│ Sep 20 • gmnstr/repo • branch • +1054 -897                 │
└─────────────────────────────────────────────────────────────┘
```

- **Background**: `#161B22`
- **Padding**: 16px 24px
- **Border bottom**: 1px solid `#21262D`

#### 3.3.2 Task Sidebar
```typescript
interface TaskSidebarProps {
  summary: string[];
  testing: {
    status: 'passed' | 'failed' | 'pending';
    details: string[];
  };
  files: FileChange[];
  workTime: string;
}

interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  type: 'added' | 'modified' | 'deleted';
}
```

**Sections**:
1. **Work Summary**:
   - Title: "Summary"
   - Bulleted list of changes
   - Expandable/collapsible

2. **Testing Status**:
   - Title: "Testing"
   - Status indicator with checkmark/X
   - Test details if applicable

3. **Files Changed**:
   - Title: "Files (16)" with count
   - Expandable file tree
   - Each file shows +/- stats
   - Color coding by file type

#### 3.3.3 Code Diff Viewer
```typescript
interface CodeDiffViewerProps {
  files: DiffFile[];
  selectedFile?: string;
  onFileSelect: (path: string) => void;
}

interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  diff: DiffLine[];
}

interface DiffLine {
  type: 'unchanged' | 'added' | 'deleted' | 'context';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}
```

**Features**:
- **Syntax highlighting** using highlight.js
- **Line numbers** on both sides
- **Expand context** controls
- **File tabs** at top
- **Minimap** for large files
- **Search within diff**
- **Copy line/section** functionality

#### 3.3.4 Bottom Input Bar
```typescript
interface BottomInputBarProps {
  onSubmit: (message: string, action: 'ask' | 'code') => void;
  placeholder: string;
  disabled?: boolean;
}
```

- **Height**: 72px fixed
- **Background**: `#161B22`
- **Border top**: 1px solid `#21262D`
- **Layout**: Similar to main input but smaller
- **Actions**: Ask, Code buttons

### 3.4 Settings Page Components

#### 3.4.1 Settings Navigation
```typescript
interface SettingsNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
```

**Sections**:
- General
- Environments (default active)
- Data controls
- Code review

#### 3.4.2 Environments Table
```typescript
interface EnvironmentsTableProps {
  environments: Environment[];
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface Environment {
  id: string;
  name: string;
  repository: string;
  taskCount: number;
  creator: string;
  createdAt: Date;
}
```

**Table Columns**:
- Name (sortable)
- Repo (sortable)
- Number of tasks (sortable)
- Creator
- Created at (sortable)

**Actions**:
- Search/filter bar
- "Create environment" button
- Row actions (edit, delete)

## 4. State Management Architecture

### 4.1 Global State Structure
```typescript
interface AppState {
  user: UserState;
  tasks: TasksState;
  environments: EnvironmentsState;
  ui: UIState;
}

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;
}

interface TasksState {
  items: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
}

interface EnvironmentsState {
  items: Environment[];
  loading: boolean;
  error: string | null;
}

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  modals: ModalState;
}
```

### 4.2 Data Flow Patterns
- **React Query** for server state management
- **Zustand** for client state
- **React Hook Form** for form state
- **React Router** for navigation state

### 4.3 API Integration Points
```typescript
// Task Management APIs
GET /api/tasks - List tasks with pagination
GET /api/tasks/:id - Get task details
POST /api/tasks - Create new task
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task

// Code Analysis APIs
GET /api/tasks/:id/diff - Get diff data
GET /api/tasks/:id/files - Get file tree
POST /api/tasks/:id/analyze - Request code analysis

// Environment APIs
GET /api/environments - List environments
POST /api/environments - Create environment
PUT /api/environments/:id - Update environment
DELETE /api/environments/:id - Delete environment
```

## 5. Performance Requirements

### 5.1 Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

### 5.2 Runtime Performance
- **Task list rendering**: Handle 1000+ items with virtualization
- **Diff viewer**: Efficient rendering of large files (10k+ lines)
- **Search**: Debounced with < 200ms response time
- **Navigation**: < 100ms transition animations

### 5.3 Optimization Strategies
- **Code splitting** by route and feature
- **Lazy loading** for non-critical components
- **Memoization** for expensive calculations
- **Virtual scrolling** for large lists
- **Service worker** for offline capabilities

## 6. Accessibility Standards

### 6.1 WCAG 2.1 AA Compliance
- **Color contrast ratio**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper ARIA labels and semantics
- **Focus management**: Visible focus indicators

### 6.2 Accessibility Features
- **High contrast mode** support
- **Reduced motion** preferences
- **Text scaling** up to 200%
- **Voice navigation** compatibility

## 7. Responsive Design Breakpoints

### 7.1 Breakpoint System
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### 7.2 Responsive Behaviors
- **Mobile**: Single column layout, collapsible navigation
- **Tablet**: Adaptive sidebar, touch-optimized controls
- **Desktop**: Full layout with all panels visible

## 8. Security Considerations

### 8.1 Data Protection
- **API authentication**: JWT tokens with refresh mechanism
- **XSS prevention**: Content Security Policy headers
- **CSRF protection**: Double submit cookies
- **Input sanitization**: All user inputs sanitized

### 8.2 Code Security
- **Dependency scanning**: Regular security audits
- **Secret management**: Environment variables for sensitive data
- **Content validation**: Server-side validation for all inputs

## 9. Testing Strategy

### 9.1 Unit Testing
- **Coverage target**: 90%+ for utility functions
- **Component testing**: React Testing Library
- **State testing**: Mock stores and reducers

### 9.2 Integration Testing
- **API integration**: Mock service worker
- **User flows**: Cypress E2E tests
- **Visual regression**: Chromatic snapshots

### 9.3 Performance Testing
- **Load testing**: Lighthouse CI
- **Bundle analysis**: webpack-bundle-analyzer
- **Memory profiling**: React DevTools Profiler

## 10. Deployment & Infrastructure

### 10.1 Build Pipeline
- **Development**: Vite dev server with HMR
- **Staging**: Preview deployments on PR
- **Production**: Optimized build with CDN

### 10.2 Monitoring
- **Error tracking**: Sentry integration
- **Analytics**: User behavior tracking
- **Performance monitoring**: Web Vitals reporting

## 11. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Design system setup
- Layout components
- Basic routing
- State management setup

### Phase 2: Core Features (Week 3-4)
- Homepage hero section
- Task list implementation
- Basic task detail view
- Settings page structure

### Phase 3: Advanced Features (Week 5-6)
- Code diff viewer
- Search functionality
- File tree navigation
- Bottom input integration

### Phase 4: Polish & Performance (Week 7-8)
- Animations and micro-interactions
- Performance optimizations
- Accessibility improvements
- Testing and bug fixes

### Phase 5: Advanced Integrations (Week 9-10)
- Voice input integration
- Advanced filtering
- Export/sharing features
- Analytics integration

## 12. Technical Dependencies

### 12.1 Core Dependencies
```json
{
  "@fluentui/react-components": "^9.70.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.9.1",
  "zustand": "^5.0.8",
  "@tanstack/react-query": "^5.89.0"
}
```

### 12.2 Development Dependencies
```json
{
  "vite": "^7.1.6",
  "typescript": "~5.8.3",
  "eslint": "^9.35.0",
  "vitest": "^3.2.4",
  "@testing-library/react": "^16.3.0"
}
```

### 12.3 Additional Integrations
- **highlight.js**: Syntax highlighting
- **monaco-editor**: Advanced code editing
- **react-window**: Virtual scrolling
- **framer-motion**: Animations
- **react-hook-form**: Form management

## 13. Future Enhancements

### 13.1 Short-term (3-6 months)
- Real-time collaboration features
- Advanced code analysis tools
- Integration with popular IDEs
- Mobile app development

### 13.2 Long-term (6-12 months)
- AI-powered code suggestions
- Multi-language support
- Advanced reporting dashboard
- Enterprise features and SSO

This specification provides a comprehensive roadmap for transforming the current basic interface into a professional, feature-rich Codex portal that matches the design vision shown in the reference screenshots.