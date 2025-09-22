#!/bin/bash

# Agent Frontend - Development Server Stop Script
# This script stops the development server for the Agent Frontend application

set -e  # Exit on any error

echo "🛑 Stopping Agent Frontend Development Server..."
echo "===================================================="

# Check if lsof is available
if ! command -v lsof &> /dev/null; then
    echo "❌ Error: lsof command not found. Cannot check for running processes."
    echo "   Please install lsof or manually kill the process."
    exit 1
fi

# Check if any process is running on port 5173
if ! lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
    echo "ℹ️  No development server found running on port 5173"
    echo "✅ Nothing to stop"
    exit 0
fi

echo "🔍 Found development server running on port 5173"

# Show what processes are running
echo ""
echo "Current processes on port 5173:"
lsof -Pi :5173 -sTCP:LISTEN

echo ""
echo "🔄 Terminating processes..."

# Get the PIDs of processes using port 5173
PIDS=$(lsof -ti:5173)

if [ -n "$PIDS" ]; then
    # First try to terminate gracefully
    echo "   Sending SIGTERM to processes: $PIDS"
    for pid in $PIDS; do
        if kill -TERM "$pid" 2>/dev/null; then
            echo "   ✅ Sent SIGTERM to process $pid"
        else
            echo "   ⚠️  Could not send SIGTERM to process $pid (may already be stopped)"
        fi
    done

    # Wait a moment for graceful shutdown
    sleep 2

    # Check if any processes are still running
    REMAINING_PIDS=$(lsof -ti:5173 2>/dev/null || true)

    if [ -n "$REMAINING_PIDS" ]; then
        echo "   Some processes are still running. Sending SIGKILL..."
        for pid in $REMAINING_PIDS; do
            if kill -KILL "$pid" 2>/dev/null; then
                echo "   ✅ Sent SIGKILL to process $pid"
            else
                echo "   ⚠️  Could not send SIGKILL to process $pid"
            fi
        done

        # Final check
        sleep 1
        if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
            echo "   ❌ Some processes may still be running on port 5173"
            echo "   You may need to manually kill them or restart your system"
            exit 1
        fi
    fi

    echo "✅ All development server processes stopped successfully"
else
    echo "   ℹ️  No processes found to terminate"
fi

echo ""
echo "🎉 Development server stopped. Port 5173 is now available."
echo "   Run ./scripts/start.sh to start the server again."