#!/usr/bin/env bash
# Wait for the GitHub Pages deploy of a commit. Usage: scripts/deploy-wait.sh <short-sha>
# Reads GITHUB_TOKEN from .env. Tolerates empty or non-JSON API responses.
set -u
SHA="$1"
TOKEN="$(/usr/bin/grep '^GITHUB_TOKEN=' .env | /usr/bin/cut -d= -f2- | /usr/bin/tr -d '"')"
for i in $(seq 1 40); do
  r=$(curl -s -m 20 -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/knackdesk/knackdesk/actions/runs?per_page=1&branch=main&event=push" \
    | /usr/bin/python3 -c 'import sys,json
try:
    w=json.load(sys.stdin)["workflow_runs"][0]; print(w["head_sha"][:7], w["status"], w["conclusion"])
except Exception: print("api-unavailable")' 2>/dev/null)
  echo "$i $r"
  case "$r" in ${SHA}*completed*) exit 0;; esac
  sleep 15
done
echo "timed out waiting for $SHA"; exit 1
