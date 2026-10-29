#!/usr/bin/env bash
# Auto-save: every 2 minutes, commit and push any changes to GitHub.
cd "$(dirname "$0")/.." || exit 1

# Only allow one copy of this script to run at a time.
exec 9>/tmp/autosave-ian-jung.lock
flock -n 9 || { echo "Auto-save is already running."; exit 0; }

echo "Auto-save running: changes are pushed to GitHub every 2 minutes."
while true; do
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -q -m "Auto-save $(date '+%Y-%m-%d %H:%M')"
    git push -q && echo "$(date '+%H:%M') saved to GitHub" || echo "$(date '+%H:%M') push failed, will retry"
  fi
  sleep 120
done
