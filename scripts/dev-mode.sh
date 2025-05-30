#!/bin/bash

# Hot reload script for VS Code extension development
# This script watches for changes and triggers a reload

WORKSPACE_DIR="$(dirname "$0")"
THEME_DIR="$WORKSPACE_DIR/themes"

echo "🔥 Starting hot reload for VS Code extension..."
echo "📁 Watching: $THEME_DIR"
echo "💡 Press Ctrl+C to stop"

# Function to reload the extension development window
reload_extension() {
    echo "🔄 Change detected! Reloading extension..."
    
    # Try to reload the extension development host window
    osascript -e 'tell application "DEV-VisualStudioCode"' \
              -e 'activate' \
              -e 'tell application "System Events"' \
              -e 'keystroke "r" using {command down}' \
              -e 'end tell' \
              -e 'end tell' 2>/dev/null
    
    echo "✅ Reload command sent"
}

# Check if fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo "❌ fswatch is not installed. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install fswatch
    else
        echo "❌ Homebrew not found. Please install fswatch manually:"
        echo "   brew install fswatch"
        exit 1
    fi
fi

# Watch for changes in themes directory and package.json
fswatch -o --event Updated "$THEME_DIR" "$WORKSPACE_DIR/package.json" | while read event; do
    reload_extension
done
