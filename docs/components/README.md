# Component Documentation

## Overview

This application uses a component-based architecture with React and Fluent UI. All components are written in TypeScript and follow consistent patterns for props, styling, and testing.

## Component Categories

### Layout Components
- **[AppShell](./layout/AppShell.md)** - Main application wrapper with responsive design
- **[TopBar](./layout/TopBar.md)** - Navigation header with toolbar content injection
- **[LeftRail](./layout/LeftRail.md)** - Sidebar navigation (exists but usage varies)

### Feature Components
- **[TaskList](./task-list/TaskList.md)** - Complex task management with filtering, sorting
- **[TaskListSimplified](./task-list/TaskListSimplified.md)** - Simplified task display for home page
- **[TaskStatusPill](./task-list/TaskStatusPill.md)** - Status indicator component
- **[MainInputComponent](./input/MainInputComponent.md)** - Voice and text input with real-time processing
- **[EnvironmentTable](./environments/EnvironmentTable.md)** - Environment management interface
- **[CodeDiffViewer](./diff/CodeDiffViewer.md)** - Code diff visualization with syntax highlighting

## Component Patterns

### 1. Props Interface
All components define clear TypeScript interfaces for their props:

```tsx
interface ComponentProps {
  // Required props without default
  title: string
  onSubmit: (data: FormData) => void

  // Optional props with default values
  isLoading?: boolean
  variant?: 'primary' | 'secondary'

  // Children or content
  children?: ReactNode
}

export const Component = ({
  title,
  onSubmit,
  isLoading = false,
  variant = 'primary',
  children
}: ComponentProps) => {
  // Component implementation
}
```

### 2. Styling with makeStyles
Components use Fluent UI's `makeStyles` for CSS-in-JS styling:

```tsx
import { makeStyles, tokens, shorthands } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('1rem'),
  },
  header: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
})

export const Component = () => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <h2 className={styles.header}>Title</h2>
    </div>
  )
}
```

### 3. Event Handling
Components use consistent patterns for event handling:

```tsx
// Click handlers
const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  onAction?.(data)
}, [onAction, data])

// Form submissions
const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  onSubmit(formData)
}, [onSubmit])

// Input changes
const handleChange = useCallback((_, data: { value: string }) => {
  setValue(data.value)
}, [])
```

### 4. State Management
Components follow these patterns for state:

```tsx
// Local state
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Refs for DOM access
const inputRef = useRef<HTMLInputElement>(null)

// Server state with React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
})

// Custom hooks for complex logic
const { isRecording, transcript, start, stop } = useVoiceInput()
```

## Design System

### Colors
Use Fluent UI design tokens for consistent colors:

```tsx
// Background colors
tokens.colorNeutralBackground1  // Primary background
tokens.colorNeutralBackground2  // Secondary background
tokens.colorNeutralBackground3  // Tertiary background

// Foreground colors
tokens.colorNeutralForeground1  // Primary text
tokens.colorNeutralForeground2  // Secondary text
tokens.colorNeutralForeground3  // Tertiary text

// Brand colors
tokens.colorBrandBackground     // Brand background
tokens.colorBrandForeground1    // Brand text
```

### Typography
Use Fluent UI typography components:

```tsx
import { Title1, Title3, Body1, Caption1 } from '@fluentui/react-components'

<Title1>Main Page Title</Title1>
<Title3>Section Title</Title3>
<Body1>Regular body text</Body1>
<Caption1>Small caption text</Caption1>
```

### Spacing
Use consistent spacing patterns:

```tsx
const useStyles = makeStyles({
  container: {
    ...shorthands.gap('1rem'),        // 16px
    ...shorthands.padding('1.5rem'),  // 24px
    ...shorthands.margin('2rem'),     // 32px
  },
})
```

### Responsive Design
Use responsive patterns for different screen sizes:

```tsx
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',

    '@media (min-width: 768px)': {
      flexDirection: 'row',
      gap: '3rem',
    },

    '@media (max-width: 600px)': {
      ...shorthands.padding('1rem'),
    },
  },
})
```

## Accessibility

### ARIA Labels
Provide meaningful labels for screen readers:

```tsx
<Button
  aria-label={`Delete task ${task.title}`}
  onClick={() => onDelete(task.id)}
>
  <DeleteIcon />
</Button>

<Input
  aria-describedby="search-help"
  placeholder="Search tasks"
/>
<Caption1 id="search-help">
  Search by title, repository, or summary
</Caption1>
```

### Keyboard Navigation
Ensure keyboard accessibility:

```tsx
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}, [handleClick])

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Interactive element
</div>
```

### Focus Management
Manage focus for better UX:

```tsx
const buttonRef = useRef<HTMLButtonElement>(null)

useEffect(() => {
  if (isModalOpen) {
    buttonRef.current?.focus()
  }
}, [isModalOpen])

<Button ref={buttonRef} autoFocus>
  Modal Action
</Button>
```

## Testing Components

### Unit Tests
Test component behavior and user interactions:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('renders with title', () => {
    render(<Component title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn()
    render(<Component onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith(expect.any(FormData))
  })
})
```

### Integration Tests
Test component interactions:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'

const renderWithProviders = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}
```

## Performance Optimization

### Memoization
Use React.memo for expensive components:

```tsx
export const ExpensiveComponent = React.memo(({ data, onAction }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.data.id === nextProps.data.id
})
```

### Callback Optimization
Stabilize callbacks with useCallback:

```tsx
const handleAction = useCallback((id: string) => {
  onAction(id)
}, [onAction])

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])
```

## Common Patterns

### Loading States
```tsx
if (isLoading) {
  return <Spinner size="large" label="Loading data..." />
}
```

### Error States
```tsx
if (error) {
  return (
    <MessageBar intent="error">
      Error loading data: {error.message}
    </MessageBar>
  )
}
```

### Empty States
```tsx
if (data.length === 0) {
  return (
    <div className={styles.emptyState}>
      <Caption1>No items found. Try adjusting your filters.</Caption1>
    </div>
  )
}
```

## Component Guidelines

1. **Single Responsibility** - Each component should have one clear purpose
2. **Composition over Inheritance** - Use composition patterns for flexibility
3. **Props Interface** - Always define clear TypeScript interfaces
4. **Default Props** - Use default parameter values instead of defaultProps
5. **Event Handling** - Use descriptive event handler names (handle[Action])
6. **Styling** - Use Fluent UI design tokens and makeStyles
7. **Accessibility** - Include ARIA labels and keyboard support
8. **Testing** - Write unit tests for all components
9. **Documentation** - Add JSDoc comments for complex components
10. **Performance** - Use React.memo and hooks optimizations when needed