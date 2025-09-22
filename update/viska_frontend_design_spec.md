# Viska Agent Frontend — Design System Specification v1.0

**Version:** 1.0  
**Target:** Frontend Developers  
**Scope:** Complete design system with visual specifications and implementation guidelines  
**Brand Context:** Silent intelligence, cryptographic verification, understated sophistication

---

## Table of Contents
1. [Design Philosophy](#1-design-philosophy)
2. [Responsive Breakpoints](#2-responsive-breakpoints)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Visual Assets & Icons](#6-visual-assets--icons)
7. [Component Library](#7-component-library)
8. [Interactive States & Animations](#8-interactive-states--animations)
9. [Content Strategy & Microcopy](#9-content-strategy--microcopy)
10. [Screen Specifications](#10-screen-specifications)
11. [Motion & Interaction](#11-motion--interaction)
12. [Implementation Guidelines](#12-implementation-guidelines)

---

## 1. Design Philosophy

### Core Principles
- **Silent Sophistication**: Clean, uncluttered interfaces that whisper rather than shout
- **Evidence-First**: Cryptographic proof surfaces are visually prioritized
- **Trustworthy Precision**: Every element serves a verification or operational purpose
- **Respectful Cognition**: Interface respects user's mental space and attention

### Visual Language
- **Minimalist Foundation**: Generous whitespace, clear hierarchy, purposeful elements
- **Cryptographic Motifs**: Subtle geometric patterns suggesting chain links and verification
- **Professional Discretion**: Understated elegance appropriate for sensitive environments
- **Apple Ecosystem Harmony**: Compatible aesthetic with macOS design language

---

## 2. Responsive Breakpoints

### Breakpoint System
```css
/* Mobile */
@media (max-width: 767px) { ... }          /* 375px-767px */

/* Tablet */
@media (min-width: 768px) { ... }          /* 768px-1023px */

/* Desktop */
@media (min-width: 1024px) { ... }         /* 1024px-1439px */

/* Large Desktop */
@media (min-width: 1440px) { ... }         /* 1440px+ */
```

### Layout Constraints
- **Mobile**: Single column, stacked navigation, 16px margins
- **Tablet**: Flexible columns, collapsible sidebar, 24px margins
- **Desktop**: Full layout, permanent sidebar, 32px margins (reference: 1440×900)
- **Large**: Expanded content areas, maximum 1200px content width

---

## 3. Color System

### Brand Colors
```css
:root {
  /* Primary Palette */
  --viska-slate-50: #f8fafc;
  --viska-slate-100: #f1f5f9;
  --viska-slate-200: #e2e8f0;
  --viska-slate-300: #cbd5e1;
  --viska-slate-400: #94a3b8;
  --viska-slate-500: #64748b;
  --viska-slate-600: #475569;
  --viska-slate-700: #334155;
  --viska-slate-800: #1e293b;
  --viska-slate-900: #0f172a;

  /* Accent Colors */
  --viska-verify: #10b981;      /* Verified states, signatures */
  --viska-caution: #f59e0b;     /* Unverified, pending */
  --viska-error: #ef4444;       /* Failed verification, errors */
  --viska-chain: #3b82f6;       /* Receipt chains, links */

  /* Semantic Colors */
  --viska-success: var(--viska-verify);
  --viska-warning: var(--viska-caution);
  --viska-danger: var(--viska-error);
  --viska-info: var(--viska-chain);
}
```

### Dark Mode (Primary)
```css
.theme-dark {
  /* Backgrounds */
  --bg-primary: var(--viska-slate-900);     /* Main background */
  --bg-secondary: var(--viska-slate-800);   /* Cards, modals */
  --bg-tertiary: var(--viska-slate-700);    /* Hover states */
  
  /* Text */
  --text-primary: var(--viska-slate-50);    /* Headers, primary text */
  --text-secondary: var(--viska-slate-300); /* Body text */
  --text-tertiary: var(--viska-slate-400);  /* Metadata, timestamps */
  
  /* Borders */
  --border-primary: var(--viska-slate-600);
  --border-secondary: var(--viska-slate-700);
}
```

### Light Mode (Optional)
```css
.theme-light {
  /* Backgrounds */
  --bg-primary: var(--viska-slate-50);
  --bg-secondary: #ffffff;
  --bg-tertiary: var(--viska-slate-100);
  
  /* Text */
  --text-primary: var(--viska-slate-900);
  --text-secondary: var(--viska-slate-700);
  --text-tertiary: var(--viska-slate-500);
  
  /* Borders */
  --border-primary: var(--viska-slate-200);
  --border-secondary: var(--viska-slate-300);
}
```

---

## 4. Typography

### Font Stack
```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
}
```

### Type Scale
```css
:root {
  /* Display */
  --text-display: 2.25rem;     /* 36px */
  --text-display-lh: 1.2;

  /* Headings */
  --text-h1: 1.875rem;         /* 30px */
  --text-h1-lh: 1.3;
  
  --text-h2: 1.5rem;           /* 24px */
  --text-h2-lh: 1.35;
  
  --text-h3: 1.25rem;          /* 20px */
  --text-h3-lh: 1.4;
  
  --text-h4: 1.125rem;         /* 18px */
  --text-h4-lh: 1.45;

  /* Body */
  --text-body: 0.875rem;       /* 14px */
  --text-body-lh: 1.5;
  
  --text-body-sm: 0.75rem;     /* 12px */
  --text-body-sm-lh: 1.5;

  /* Specialized */
  --text-code: 0.8125rem;      /* 13px */
  --text-code-lh: 1.6;
  
  --text-meta: 0.6875rem;      /* 11px */
  --text-meta-lh: 1.45;
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

## 5. Spacing & Layout

### Spacing Scale
```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
}
```

### Grid System
```css
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container { padding: 0 var(--space-6); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--space-8); }
}
```

### Border Radius
```css
:root {
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
}
```

---

## 6. Visual Assets & Icons

### 6.1 Logo Implementation

#### Logo Specifications
```css
.viska-logo {
  /* Standard size */
  height: 32px;
  width: auto;
}

.viska-logo-sm {
  /* Small/mobile size */
  height: 24px;
  width: auto;
}

.viska-logo-lg {
  /* Large/hero size */
  height: 48px;
  width: auto;
}
```

#### Logo Usage Rules
- **Minimum size**: 20px height (maintains symbol legibility)
- **Clearspace**: Minimum 16px on all sides
- **Symbol only**: Use for favicons, app icons, and spaces < 120px wide
- **Symbol + wordmark**: Default usage for headers and branding
- **Monochrome**: White on dark backgrounds, dark on light backgrounds

#### Favicon & App Icons
```html
<!-- Favicon implementation -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### 6.2 Icon System

#### Icon Library: Lucide Icons
Using [Lucide](https://lucide.dev) for consistency and quality.

#### Core Icons Mapping
```javascript
const iconMap = {
  // Navigation
  home: 'home',
  tasks: 'list-checks',
  environments: 'server',
  docs: 'file-text',
  search: 'search',
  menu: 'menu',
  close: 'x',
  
  // Actions
  download: 'download',
  copy: 'copy',
  share: 'share-2',
  archive: 'archive',
  edit: 'edit-2',
  delete: 'trash-2',
  refresh: 'refresh-cw',
  
  // Status
  verified: 'shield-check',
  warning: 'alert-triangle',
  error: 'alert-circle',
  info: 'info',
  success: 'check-circle',
  pending: 'clock',
  
  // Crypto/Security
  hash: 'hash',
  key: 'key',
  lock: 'lock',
  chain: 'link',
  signature: 'pen-tool',
  
  // File/Code
  file: 'file',
  folder: 'folder',
  code: 'code',
  diff: 'git-compare',
  log: 'scroll-text',
  
  // UI
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  plus: 'plus',
  minus: 'minus',
  dots: 'more-horizontal'
};
```

#### Icon Implementation
```css
.icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.icon-sm {
  width: 14px;
  height: 14px;
}

.icon-lg {
  width: 20px;
  height: 20px;
}

.icon-xl {
  width: 24px;
  height: 24px;
}
```

---

## 7. Component Library

### 7.1 Navigation Header

#### Desktop Layout
```css
.header {
  height: 64px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  padding: 0 var(--space-8);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-right: var(--space-8);
}

.header-nav {
  display: flex;
  gap: var(--space-8);
  margin-right: auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
```

#### Mobile Layout
```css
@media (max-width: 767px) {
  .header {
    height: 56px;
    padding: 0 var(--space-4);
  }
  
  .header-nav {
    display: none; /* Hidden, use mobile menu */
  }
}
```

### 7.2 Proof Surface Component

#### Structure
```html
<div class="proof-surface">
  <div class="proof-header">
    <h3>Proof Surface</h3>
    <button class="proof-toggle">Collapse</button>
  </div>
  
  <div class="proof-grid">
    <div class="proof-item">
      <label>Plan Hash</label>
      <div class="hash-display">
        <code>sha256:a1b2c3...</code>
        <span class="verified-badge">Verified</span>
      </div>
    </div>
    
    <div class="proof-item">
      <label>Receipt Chain</label>
      <div class="receipt-status">
        <span class="chain-ok">Chain OK</span>
        <span class="receipt-count">91 entries</span>
      </div>
    </div>
    
    <div class="proof-item">
      <label>Critic Verdict</label>
      <div class="critic-status">
        <span class="status-passing">All suites passing</span>
      </div>
    </div>
  </div>
  
  <div class="proof-actions">
    <button class="btn-primary">Download Trust Pack</button>
    <button class="btn-secondary">Verify Locally</button>
    <button class="btn-secondary">Replay Run</button>
  </div>
</div>
```

#### Styling
```css
.proof-surface {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  position: sticky;
  top: var(--space-4);
  z-index: 10;
}

.proof-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
  margin: var(--space-4) 0;
}

.proof-item label {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  display: block;
  margin-bottom: var(--space-1);
}

.hash-display {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.verified-badge {
  background: var(--viska-verify);
  color: white;
  font-size: var(--text-meta);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-weight: var(--font-medium);
}
```

### 7.3 Status Pills

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-xl);
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
}

.status-pill.open {
  background: rgba(59, 130, 246, 0.1);
  color: var(--viska-chain);
}

.status-pill.running {
  background: rgba(245, 158, 11, 0.1);
  color: var(--viska-caution);
}

.status-pill.merged {
  background: rgba(16, 185, 129, 0.1);
  color: var(--viska-verify);
}

.status-pill.failed {
  background: rgba(239, 68, 68, 0.1);
  color: var(--viska-error);
}

.status-pill.archived {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-tertiary);
}
```

### 7.4 Button System

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--viska-chain);
  color: white;
  border-color: var(--viska-chain);
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.btn-secondary:hover {
  background: var(--border-primary);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-body-sm);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
}
```

### 7.5 Form Elements

```css
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.form-input {
  width: 100%;
  padding: var(--space-3);
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  color: var(--text-primary);
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--viska-chain);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}
```

### 7.6 Data Tables

```css
.data-table {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table th {
  background: var(--bg-tertiary);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-body-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.data-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-secondary);
  font-size: var(--text-body);
}

.data-table tr:hover td {
  background: var(--bg-tertiary);
}

.data-table tr:last-child td {
  border-bottom: none;
}
```

---

## 8. Interactive States & Animations

### 8.1 Button States

#### Primary Button States
```css
.btn-primary {
  /* Default state already defined above */
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-primary:disabled {
  background: var(--viska-slate-600);
  color: var(--viska-slate-400);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--viska-chain);
  outline-offset: 2px;
}
```

#### Loading States
```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 8.2 Form Validation States

```css
.form-input.valid {
  border-color: var(--viska-verify);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input.invalid {
  border-color: var(--viska-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-body-sm);
  color: var(--viska-error);
  margin-top: var(--space-1);
}

.form-success {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-body-sm);
  color: var(--viska-verify);
  margin-top: var(--space-1);
}
```

### 8.3 Verification Process Animation

```css
.verification-progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
}

.verification-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--viska-slate-600);
  border-top-color: var(--viska-verify);
  border-radius: 50%;
  animation: verifyingSpin 1.5s linear infinite;
}

@keyframes verifyingSpin {
  to { transform: rotate(360deg); }
}

.verification-complete {
  color: var(--viska-verify);
  animation: verifyComplete 0.3s ease-out;
}

@keyframes verifyComplete {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

### 8.4 Hash Display Interactions

```css
.hash-display {
  position: relative;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.hash-display:hover {
  background: var(--bg-tertiary);
}

.hash-display code {
  font-family: var(--font-mono);
  font-size: var(--text-code);
  user-select: all; /* Allow easy selection */
}

.hash-copied {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-body-sm);
  color: var(--viska-verify);
  animation: tooltipAppear 0.2s ease-out;
}

@keyframes tooltipAppear {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

### 8.5 Live Update Indicators

```css
.task-item {
  transition: border-color var(--transition-normal);
}

.task-item.updated {
  border-color: var(--viska-verify);
  animation: taskUpdated 2s ease-out;
}

@keyframes taskUpdated {
  0% { background: rgba(16, 185, 129, 0.1); }
  100% { background: transparent; }
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--viska-verify);
  border-radius: 50%;
  animation: livePulse 2s infinite;
}

@keyframes livePulse {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  50% { 
    opacity: 0.7;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
  }
}
```

---

## 9. Content Strategy & Microcopy

### 9.1 Button Labels

#### Primary Actions
- **Create Task**: "Code" (primary), "Ask" (secondary)
- **Verification**: "Download Trust Pack", "Verify Locally", "Replay Run"
- **File Operations**: "Download Evidence", "Copy Hash", "View Diff"
- **Navigation**: "Back to Tasks", "View Details", "Open Environment"

#### Secondary Actions
- **Management**: "Archive Task", "Share Link", "Export Logs"
- **Settings**: "Configure Environment", "Manage Permissions", "Update Settings"

### 9.2 Status Messages

#### Loading States
```javascript
const loadingMessages = {
  creating: "Creating task...",
  planning: "Generating plan...", 
  executing: "Running task...",
  verifying: "Verifying signatures...",
  downloading: "Preparing trust pack...",
  replaying: "Replaying execution..."
};
```

#### Success States
```javascript
const successMessages = {
  taskCreated: "Task created successfully",
  verificationComplete: "Signatures verified",
  trustPackReady: "Trust pack downloaded",
  hashCopied: "Hash copied to clipboard",
  replayComplete: "Replay completed successfully"
};
```

#### Error States
```javascript
const errorMessages = {
  taskFailed: "Task execution failed",
  verificationFailed: "Signature verification failed", 
  downloadFailed: "Download failed. Please try again.",
  networkError: "Connection lost. Retrying...",
  permissionDenied: "Insufficient permissions"
};
```

### 9.3 Empty States

#### Tasks Page
```html
<div class="empty-state">
  <div class="empty-icon">
    <svg><!-- list-checks icon --></svg>
  </div>
  <h3>No tasks yet</h3>
  <p>Describe your first mission to get started with Viska.</p>
  <button class="btn-primary">Create Task</button>
</div>
```

#### Search Results
```html
<div class="empty-state">
  <div class="empty-icon">
    <svg><!-- search icon --></svg>
  </div>
  <h3>No results found</h3>
  <p>Try adjusting your search terms or filters.</p>
</div>
```

#### Environment Offline
```html
<div class="empty-state error">
  <div class="empty-icon">
    <svg><!-- alert-circle icon --></svg>
  </div>
  <h3>Environment offline</h3>
  <p>Last healthy: 2 hours ago</p>
  <button class="btn-secondary">Reconnect</button>
</div>
```

### 9.4 Placeholder Text

#### Form Inputs
- **Mission Input**: "Describe the task you have in mind and the Viska agent will help you plan, code, and ship it."
- **Search Tasks**: "Search tasks by title, repository, or summary"
- **Environment Name**: "e.g., Production API Gateway"
- **Repository URL**: "https://github.com/org/repo"

#### Hash Truncation
```javascript
// For display purposes, show first 8 and last 8 characters
function truncateHash(hash) {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}
// Example: "sha256:a1b2c3d4...f8e9d0a1"
```

### 9.5 Help Text & Tooltips

#### Verification Tooltips
- **Plan Hash**: "Cryptographic signature of the execution plan"
- **Receipt Chain**: "Immutable log of all task steps"
- **Critic Verdict**: "Automated verification results"
- **Trust Pack**: "Downloadable evidence bundle for independent verification"

#### Time Formatting
```javascript
const timeFormats = {
  justNow: "Just now",
  minutes: "5m ago",
  hours: "2h ago", 
  days: "3d ago",
  absolute: "Mar 15, 2025 at 2:30 PM"
};
```

### 9.6 Error Recovery

#### Network Issues
```html
<div class="error-banner">
  <svg><!-- wifi-off icon --></svg>
  <span>Connection lost. Some features may be unavailable.</span>
  <button class="btn-sm">Retry</button>
</div>
```

#### Verification Failures
```html
<div class="verification-error">
  <svg><!-- alert-triangle icon --></svg>
  <div>
    <strong>Verification failed</strong>
    <p>Unable to verify signatures. Check receipt chain integrity.</p>
    <button class="btn-sm">View Details</button>
  </div>
</div>
```

---

## 10. Screen Specifications

### 10.1 Overview Page

#### Layout Structure (Desktop 1440px+)
```css
.overview-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  padding: var(--space-8);
}

.overview-widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.mission-input {
  grid-column: 1 / -1;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}
```

#### Mission Input Component
```css
.mission-textarea {
  width: 100%;
  min-height: 120px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: var(--text-body);
  line-height: var(--text-body-lh);
  resize: vertical;
  margin-bottom: var(--space-4);
}

.mission-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

#### Widget Cards
```css
.widget-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.widget-title {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.widget-metric {
  font-size: var(--text-display);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: 1;
}

.widget-change {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
}
```

### 10.2 Task Detail Page

#### Two-Column Layout
```css
.task-detail {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-8);
  padding: var(--space-8);
}

.task-main {
  min-width: 0; /* Allows content to shrink */
}

.task-sidebar {
  position: sticky;
  top: var(--space-4);
  height: fit-content;
}
```

#### Tab Navigation
```css
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
  margin-bottom: var(--space-6);
}

.tab-button {
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  font-size: var(--text-body);
  color: var(--text-tertiary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.tab-button.active {
  color: var(--text-primary);
  border-bottom-color: var(--viska-chain);
}

.tab-button:hover {
  color: var(--text-secondary);
}
```

#### Diff Viewer
```css
.diff-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-4);
  height: 600px;
}

.file-tree {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow-y: auto;
}

.diff-viewer {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--text-code);
}

.diff-line {
  display: block;
  padding: 0 var(--space-3);
  line-height: var(--text-code-lh);
}

.diff-line.added {
  background: rgba(16, 185, 129, 0.1);
  color: var(--viska-verify);
}

.diff-line.removed {
  background: rgba(239, 68, 68, 0.1);
  color: var(--viska-error);
}
```

### 10.3 Diff Viewer Specifications

#### Syntax Highlighting Theme
```css
/* Viska Dark Code Theme */
.diff-viewer {
  background: #1a1d23;
  color: #e6e8eb;
}

.diff-viewer .token.comment {
  color: #6b7280; /* Gray-500 */
  font-style: italic;
}

.diff-viewer .token.string {
  color: #10b981; /* Viska verify green */
}

.diff-viewer .token.number {
  color: #f59e0b; /* Viska caution amber */
}

.diff-viewer .token.keyword {
  color: #3b82f6; /* Viska chain blue */
  font-weight: 500;
}

.diff-viewer .token.function {
  color: #8b5cf6; /* Purple-500 */
}

.diff-viewer .token.operator {
  color: #f3f4f6; /* Gray-100 */
}

.diff-viewer .token.punctuation {
  color: #9ca3af; /* Gray-400 */
}

/* Diff-specific highlighting */
.diff-line-number {
  color: #6b7280;
  background: #111827;
  padding: 0 var(--space-2);
  border-right: 1px solid var(--border-primary);
  user-select: none;
  min-width: 50px;
  text-align: right;
}

.diff-line.added {
  background: rgba(16, 185, 129, 0.15);
  border-left: 3px solid var(--viska-verify);
}

.diff-line.removed {
  background: rgba(239, 68, 68, 0.15);
  border-left: 3px solid var(--viska-error);
}

.diff-line.modified {
  background: rgba(245, 158, 11, 0.15);
  border-left: 3px solid var(--viska-caution);
}
```

#### File Tree Styling
```css
.file-tree-item {
  padding: var(--space-1) var(--space-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border-radius: var(--radius-sm);
  margin: var(--space-1) var(--space-2);
}

.file-tree-item:hover {
  background: var(--bg-tertiary);
}

.file-tree-item.selected {
  background: rgba(59, 130, 246, 0.2);
  color: var(--viska-chain);
}

.file-tree-item.modified {
  color: var(--viska-caution);
}

.file-tree-item.added {
  color: var(--viska-verify);
}

.file-tree-item.removed {
  color: var(--viska-error);
  text-decoration: line-through;
}
```

### 10.4 Responsive Adaptations

#### Mobile (≤767px)
```css
@media (max-width: 767px) {
  .overview-layout {
    grid-template-columns: 1fr;
    padding: var(--space-4);
    gap: var(--space-4);
  }
  
  .task-detail {
    grid-template-columns: 1fr;
    padding: var(--space-4);
    gap: var(--space-4);
  }
  
  .diff-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .file-tree {
    max-height: 200px;
  }
  
  .proof-surface {
    position: static; /* Not sticky on mobile */
  }
}
```

#### Tablet (768px-1023px)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .overview-layout {
    padding: var(--space-6);
    gap: var(--space-6);
  }
  
  .task-detail {
    grid-template-columns: 1fr 280px;
    padding: var(--space-6);
    gap: var(--space-6);
  }
}
```

---

## 8. Motion & Interaction

### Transition Standards
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease-out;
}

/* Hover states */
.interactive {
  transition: all var(--transition-fast);
}

/* Modal/overlay animations */
.modal-enter {
  animation: modalEnter var(--transition-normal) ease-out;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Live update indicator */
.live-indicator {
  position: relative;
}

.live-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--viska-verify);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Loading States
```css
.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 9. Implementation Guidelines

### CSS Architecture
```
styles/
├── base/
│   ├── reset.css
│   ├── variables.css
│   └── typography.css
├── components/
│   ├── buttons.css
│   ├── forms.css
│   ├── proof-surface.css
│   └── tables.css
├── layouts/
│   ├── header.css
│   ├── overview.css
│   └── task-detail.css
└── utilities/
    ├── spacing.css
    └── responsive.css
```

### Component Development
1. **Atomic Design**: Build from atoms (buttons) to organisms (proof surface)
2. **BEM Methodology**: Use consistent naming (`.proof-surface__item--verified`)
3. **CSS Custom Properties**: Leverage variables for theming and consistency
4. **Progressive Enhancement**: Start with semantic HTML, enhance with CSS/JS

### Performance Considerations
- **Virtualization**: For large lists (receipts, logs) use virtual scrolling
- **Lazy Loading**: Defer non-critical content below the fold
- **Asset Optimization**: Use system fonts, optimize images, minimize CSS
- **Critical CSS**: Inline above-the-fold styles

### Accessibility Requirements
- **WCAG AA Compliance**: 4.5:1 contrast minimum for normal text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators, logical tab order

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Grid**: Full support required
- **CSS Custom Properties**: Full support required
- **Graceful Degradation**: Fallbacks for older browsers where necessary

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] CSS variables and color system
- [ ] Typography scale and font loading
- [ ] Spacing system and utilities
- [ ] Base component styles (buttons, forms, tables)

### Phase 2: Core Components
- [ ] Header navigation with responsive behavior
- [ ] Proof surface component with sticky positioning
- [ ] Status pills and verification badges
- [ ] Mission input with keyboard shortcuts

### Phase 3: Complex Layouts
- [ ] Overview page with widget grid
- [ ] Task detail with tabbed interface
- [ ] Diff viewer with syntax highlighting
- [ ] Environments table with health indicators

### Phase 4: Polish
- [ ] Loading states and skeletons
- [ ] Micro-interactions and hover effects
- [ ] Error states and empty states
- [ ] Performance optimization

---

**End of Specification**

This design system prioritizes Viska's core values of trust, precision, and understated intelligence while providing developers with comprehensive implementation guidance.