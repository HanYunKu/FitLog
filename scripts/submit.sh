#!/usr/bin/env bash
set -euo pipefail

echo "📦 COSI 153A Submission Script"

if [ ! -d .git ]; then
  echo "❌ This directory is not a git repository."
  exit 1
fi

# Detect current branch
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "🔍 Staging all changes..."
git add -A

# Commit only if there is something to commit
if git diff --cached --quiet; then
  echo "ℹ️ No changes to commit."
else
  read -p "📝 Enter your commit message: " commit_msg
  commit_msg=${commit_msg:-"Assignment submission"}
  git commit -m "$commit_msg"
fi

echo "⬇️ Pulling latest (rebase)…"
git pull --rebase origin "$BRANCH" || true

echo "🚀 Pushing to GitHub..."
git push origin "$BRANCH"

echo "✅ Submission complete!"
