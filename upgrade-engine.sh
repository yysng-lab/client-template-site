#!/usr/bin/env bash
set -e

ENGINE="@yysng/astro-boilerplate"

echo "🔄 Upgrading AI Edit engine..."

npm uninstall $ENGINE
npm install $ENGINE@latest

git add package.json package-lock.json
git commit -m "chore: upgrade AI Edit engine"

git push

echo "✅ Engine upgrade complete."
