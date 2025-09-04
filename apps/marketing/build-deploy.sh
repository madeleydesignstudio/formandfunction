#!/bin/bash

# Build script for @formfunction/marketing app deployment
# This script ensures proper build artifacts are generated for Vercel

set -e  # Exit on error

echo "🚀 Starting build for @formfunction/marketing..."

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "📍 Script directory: $SCRIPT_DIR"
echo "📍 Project root: $PROJECT_ROOT"

# Change to project root
cd "$PROJECT_ROOT"

echo "🧹 Cleaning previous builds..."
rm -rf apps/marketing/.next
rm -rf apps/marketing/out

echo "📦 Installing dependencies..."
bun install

echo "🔧 Building marketing app..."
turbo build --filter=@formfunction/marketing

echo "✅ Verifying build artifacts..."
if [ ! -f "apps/marketing/.next/routes-manifest.json" ]; then
    echo "❌ Error: routes-manifest.json not found!"
    exit 1
fi

if [ ! -f "apps/marketing/.next/build-manifest.json" ]; then
    echo "❌ Error: build-manifest.json not found!"
    exit 1
fi

echo "📋 Build artifacts verification:"
ls -la "apps/marketing/.next/"*manifest*.json

echo "✨ Build completed successfully!"
echo "🎯 Ready for deployment to Vercel"
