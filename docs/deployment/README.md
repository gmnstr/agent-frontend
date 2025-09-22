# Deployment Guide

## Overview

This guide covers deploying the Agent Frontend application to various environments including development, staging, and production.

## Build Process

### Production Build
```bash
cd portal
npm run build
```

This creates optimized files in the `portal/dist/` directory:
- Static HTML, CSS, and JavaScript files
- Optimized images and assets
- Source maps for debugging
- Gzipped assets for better performance

### Build Configuration
The build process is configured in `portal/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@fluentui/react-components'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

## Environment Configuration

### Environment Variables
Create environment-specific `.env` files:

```bash
# .env.local (development)
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
VITE_ENABLE_MOCK_API=true

# .env.staging
VITE_API_BASE_URL=https://api-staging.example.com
VITE_APP_ENV=staging
VITE_ENABLE_MOCK_API=false

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=production
VITE_ENABLE_MOCK_API=false
VITE_SENTRY_DSN=your-sentry-dsn
```

### Runtime Configuration
```typescript
// src/config/environment.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  appEnv: import.meta.env.VITE_APP_ENV || 'production',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
} as const
```

## Static Site Hosting

### Netlify Deployment

#### 1. Connect Repository
- Connect your Git repository to Netlify
- Set build directory to `portal/`

#### 2. Build Settings
```yaml
# netlify.toml
[build]
  base = "portal/"
  command = "npm run build"
  publish = "dist/"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### 3. Environment Variables
Set in Netlify dashboard:
- `VITE_API_BASE_URL`
- `VITE_APP_ENV`
- `VITE_SENTRY_DSN`

### Vercel Deployment

#### 1. Project Configuration
```json
{
  "buildCommand": "cd portal && npm run build",
  "outputDirectory": "portal/dist",
  "installCommand": "cd portal && npm install"
}
```

#### 2. Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "portal/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### GitHub Pages Deployment

#### 1. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'portal/package-lock.json'

      - name: Install dependencies
        run: cd portal && npm ci

      - name: Build
        run: cd portal && npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./portal/dist
```

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY portal/package*.json ./
RUN npm ci

COPY portal/ .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_vary on;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    restart: unless-stopped

  # Optional: Include backend services
  api:
    image: your-api-image:latest
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
```

## CDN and Performance

### Content Delivery Network
Configure CDN for better global performance:

```javascript
// vite.config.ts - CDN configuration
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
```

### Performance Optimizations

#### 1. Asset Optimization
- Image compression and WebP format
- Font subsetting and preloading
- JavaScript tree shaking
- CSS purging

#### 2. Caching Strategy
```nginx
# Long-term caching for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Short-term caching for HTML
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

#### 3. Compression
Enable Brotli and Gzip compression:

```nginx
# Enable compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/js
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;

# Brotli compression (if available)
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    application/json
    application/javascript
    text/xml
    application/xml;
```

## Monitoring and Analytics

### Error Tracking with Sentry
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: 0.1,
    environment: config.appEnv,
  })
}
```

### Performance Monitoring
```typescript
// Performance metrics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Analytics Integration
```typescript
// Google Analytics 4
import { gtag } from 'ga-gtag'

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
})
```

## Security Considerations

### Content Security Policy
```html
<!-- CSP headers -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.example.com wss://api.example.com;">
```

### Environment Variables Security
- Never expose sensitive keys in client-side code
- Use environment variables for configuration
- Validate all environment variables at build time

### HTTPS Configuration
```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

## Deployment Checklist

### Pre-deployment
- [ ] Run tests: `npm test`
- [ ] Build successfully: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Update environment variables
- [ ] Review security headers
- [ ] Check for console errors

### Post-deployment
- [ ] Verify application loads correctly
- [ ] Test critical user flows
- [ ] Check performance metrics
- [ ] Monitor error rates
- [ ] Verify analytics tracking
- [ ] Test on multiple devices/browsers

### Rollback Plan
- Keep previous build artifacts
- Implement blue-green deployment
- Have database migration rollback scripts
- Monitor application health post-deployment

## Troubleshooting

### Common Issues

#### 1. Routing Issues (404s)
- Ensure server is configured for SPA routing
- Check nginx configuration for `try_files`
- Verify base URL configuration

#### 2. Environment Variable Issues
- Variables must be prefixed with `VITE_`
- Check build-time vs runtime configuration
- Verify values in deployment environment

#### 3. Build Failures
- Check Node.js version compatibility
- Clear npm cache: `npm ci`
- Verify all dependencies are installed
- Check for TypeScript errors

#### 4. Performance Issues
- Enable compression (gzip/brotli)
- Implement proper caching headers
- Optimize images and assets
- Check for JavaScript errors

### Debugging Production Issues
```typescript
// Enable debug mode for specific environments
if (config.appEnv !== 'production') {
  window.DEBUG = true
  console.log('Debug mode enabled')
}

// Conditional logging
const log = config.appEnv === 'development' ? console.log : () => {}
```