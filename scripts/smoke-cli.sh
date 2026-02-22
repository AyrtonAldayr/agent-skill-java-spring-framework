#!/usr/bin/env bash
# Smoke test: run CLI in non-interactive mode and verify key files exist.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLI="$REPO_ROOT/bin/create-spring-app.js"
PROJECT_NAME="smoke-test-project"
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'skill-smoke')

cd "$TMP_DIR"
node "$CLI" "$PROJECT_NAME" --no-interactive

PROJECT_DIR="$TMP_DIR/$PROJECT_NAME"
if [ ! -d "$PROJECT_DIR" ]; then
  echo "FAIL: Project directory not created: $PROJECT_DIR"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/build.gradle.kts" ]; then
  echo "FAIL: build.gradle.kts not found"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/src/main/resources/application.yaml" ]; then
  echo "FAIL: application.yaml not found"
  exit 1
fi

# Default package is com.example; app name from "smoke-test-project" -> SmokeTestProject
JAVA_FILE=$(find "$PROJECT_DIR/src/main/java" -name "*Application.java" 2>/dev/null | head -1)
if [ -z "$JAVA_FILE" ] || [ ! -f "$JAVA_FILE" ]; then
  echo "FAIL: Application main class not found under src/main/java"
  exit 1
fi

echo "PASS: Smoke test — CLI generated project with build.gradle.kts, application.yaml, and Application class."
rm -rf "$TMP_DIR"
