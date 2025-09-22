# Server Management Scripts

This directory contains utility scripts for managing the Agent Frontend development server.

## Available Scripts

### 🚀 start.sh
Starts the development server with comprehensive checks and setup.

**Features:**
- ✅ Validates Node.js and npm installation
- 📦 Automatically installs dependencies if needed
- 🔍 Checks for port conflicts (port 5173)
- 🎯 Provides clear feedback and error messages
- 🛑 Handles graceful shutdown with Ctrl+C

**Usage:**
```bash
# From project root
./scripts/start.sh
```

**What it does:**
1. Verifies environment (Node.js, npm, project structure)
2. Installs portal dependencies if missing
3. Checks if port 5173 is already in use
4. Starts the development server with hot reload
5. Sets up proper cleanup on exit

### 🛑 stop.sh
Stops the development server and frees up resources.

**Features:**
- 🔍 Finds all processes using port 5173
- 🕰️ Attempts graceful shutdown first (SIGTERM)
- 💥 Forces termination if needed (SIGKILL)
- ✅ Verifies all processes are stopped
- 📊 Shows detailed process information

**Usage:**
```bash
# From project root
./scripts/stop.sh
```

**What it does:**
1. Searches for processes on port 5173
2. Shows running processes for transparency
3. Sends SIGTERM for graceful shutdown
4. Waits for processes to terminate
5. Uses SIGKILL if graceful shutdown fails
6. Verifies port 5173 is free

## Quick Commands

```bash
# Start development server
./scripts/start.sh

# Stop development server
./scripts/stop.sh

# Restart development server
./scripts/stop.sh && ./scripts/start.sh
```

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Stop any existing servers
./scripts/stop.sh

# Then start fresh
./scripts/start.sh
```

### Permission Denied
If you get permission errors:
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Then run normally
./scripts/start.sh
```

### Node.js Not Found
If Node.js is not installed:
1. Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Restart your terminal
3. Run the start script again

### Dependencies Not Installing
If npm install fails:
```bash
# Clear npm cache
cd portal
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Return to root and start server
cd ..
./scripts/start.sh
```

### Server Won't Stop
If the stop script can't terminate processes:
```bash
# Find processes manually
lsof -i :5173

# Kill specific process ID
kill -9 <PID>

# Or restart your system as last resort
```

## Integration with Development Workflow

### VS Code Integration
Add these to your VS Code tasks (`/.vscode/tasks.json`):

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "./scripts/start.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Stop Dev Server",
      "type": "shell",
      "command": "./scripts/stop.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

### Package.json Scripts
You can also add these to your root `package.json`:

```json
{
  "scripts": {
    "start": "./scripts/start.sh",
    "stop": "./scripts/stop.sh",
    "restart": "./scripts/stop.sh && ./scripts/start.sh"
  }
}
```

Then use:
```bash
npm start    # Start server
npm run stop # Stop server
npm run restart # Restart server
```

## Advanced Usage

### Background Mode
To run the server in the background:
```bash
# Start in background
nohup ./scripts/start.sh > server.log 2>&1 &

# Monitor logs
tail -f server.log

# Stop when needed
./scripts/stop.sh
```

### Development with Multiple Terminals
1. **Terminal 1**: Run development server
   ```bash
   ./scripts/start.sh
   ```

2. **Terminal 2**: Run tests in watch mode
   ```bash
   cd portal
   npm test -- --watch
   ```

3. **Terminal 3**: Development commands
   ```bash
   cd portal
   npm run lint
   ```

## Script Internals

### Error Handling
Both scripts use `set -e` to exit on any error and include comprehensive error checking:
- Environment validation
- Process detection
- Graceful error messages
- Cleanup on unexpected exits

### Cross-Platform Compatibility
Scripts are designed for Unix-like systems (macOS, Linux):
- Uses standard Unix tools (`lsof`, `kill`, `ps`)
- Bash shell scripting
- POSIX-compliant commands

### Security Considerations
- Scripts validate input and environment
- Use safe process termination methods
- Don't expose sensitive information
- Fail securely with clear error messages