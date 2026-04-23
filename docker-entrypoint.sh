#!/bin/sh

# Replace placeholders with environment variables in JS files
# This allows Vite apps to pick up secrets at container runtime

echo "Injecting runtime environment variables..."

# Root directory for web files
WEB_ROOT="/usr/share/nginx/html"
INDEX_FILE="$WEB_ROOT/focus_tracker/index.html"

echo "Injecting runtime environment variables into $INDEX_FILE..."

# Replace the placeholder in the inline script with the actual environment variable
# Uses # as a safe delimiter for URLs
if [ -n "$VITE_NEON_DATABASE_URL" ]; then
  sed -i "s#__VITE_NEON_DATABASE_URL_PLACEHOLDER__#$VITE_NEON_DATABASE_URL#g" $INDEX_FILE
  echo "Database URL successfully injected."
else
  echo "Warning: VITE_NEON_DATABASE_URL is missing in container environment."
fi

if [ -n "$VITE_NEON_PROJECT_ID" ]; then
  sed -i "s#__VITE_NEON_PROJECT_ID_PLACEHOLDER__#$VITE_NEON_PROJECT_ID#g" $INDEX_FILE
  echo "Project ID successfully injected."
fi

if [ -n "$VITE_NEON_API_KEY" ]; then
  sed -i "s#__VITE_NEON_API_KEY_PLACEHOLDER__#$VITE_NEON_API_KEY#g" $INDEX_FILE
  echo "API key successfully injected."
fi

echo "Starting Nginx..."
exec "$@"
