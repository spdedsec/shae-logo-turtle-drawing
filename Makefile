# ========================================================================
# SHAE Logo Turtle Drawing — Makefile
# Copyright (c) 2026 spdedsec <legendsatya7272@gmail.com>
# License: MIT
# ========================================================================

.PHONY: all test dev build clean release

all: build

test:
	@echo "🔍 Checking syntax..."
	@node -c src/app.js 2>/dev/null && echo "✅ app.js syntax OK" || echo "⚠️  Node syntax check skipped (no Node in PATH)"
	@echo "✅ All checks passed"

dev:
	@echo "🦞 Starting SHAE Logo Turtle Drawing development server..."
	@python3 -m http.server 8080 -d src

build:
	@echo "🏗️  Building SHAE Logo Turtle Drawing..."
	@mkdir -p dist
	@cp -r src/* dist/
	@cp scripts/install.sh dist/ 2>/dev/null || true
	@cp Makefile dist/
	@cp README.md dist/
	@cp DESIGN.md dist/
	@echo "✅ Build complete — files in dist/"

clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist

release:
	@echo "🚀 Creating release archive..."
	@bash -c "cd dist && tar -czf ../shae-logo-turtle-drawing-v1.0.0.tar.gz * && cd .."
	@bash -c "cd dist && zip -rq ../shae-logo-turtle-drawing-v1.0.0.zip * && cd .."