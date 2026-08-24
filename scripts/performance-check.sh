#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://localhost:9000}"
front_url="${2:-http://localhost:4200}"

printf '%s\n' 'Performance smoke check'
printf 'API health target: %s\n' "$base_url"
printf 'Front target: %s\n' "$front_url"

curl --fail --silent --show-error --output /dev/null \
  --write-out 'API status=%{http_code} total=%{time_total}s\n' \
  "$base_url/actuator/health" 2>/dev/null || \
  curl --fail --silent --show-error --output /dev/null \
    --write-out 'API status=%{http_code} total=%{time_total}s\n' \
    "$base_url/api/topics"

curl --fail --silent --show-error --output /dev/null \
  --write-out 'Front status=%{http_code} total=%{time_total}s\n' \
  "$front_url/auth"
