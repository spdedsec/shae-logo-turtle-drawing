#!/usr/bin/env bash
# ========================================================================
# SHAE Logo Turtle Drawing — Installation Script
# Purpose: Copy project to web directory or open index.html in browser
# Copyright (c) 2026 spdedsec <legendsatya7272@gmail.com>
# License: MIT
# ========================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${PROJECT_ROOT}/src"

echo "🐢 SHAE Logo Turtle Drawing Installation Script"
echo "========================================================"

# Check if source files exist
if [ ! -f "${SRC_DIR}/index.html" ] || [ ! -f "${SRC_DIR}/styles.css" ] || [ ! -f "${SRC_DIR}/app.js" ]; then
    echo "❌ Source files not found in ${SRC_DIR}"
    exit 1
fi

echo "✅ Source files found in ${SRC_DIR}"
echo ""

# Option 1: Open in browser
echo "🌐 Opening index.html in default browser..."
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${SRC_DIR}/index.html" &
elif command -v open >/dev/null 2>&1; then
    open "${SRC_DIR}/index.html" &
else
    echo "⚠️  Could not open browser automatically"
    echo "   Open manually: file://${SRC_DIR}/index.html"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "💡 Next steps:"
echo "  - Run 'make dev' to start local development server (http://localhost:8080)"
echo "  - Run 'make build' to create distribution packages"
echo "  - Visit https://github.com/spdedsec/shae-logo-turtle-drawing for release details"
echo ""
echo "🎨 Design System: SHAE Field Manual (Warm Paper #F2EEE5, Ink #191712, Oxide #B3341B)"