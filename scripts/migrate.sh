#!/bin/bash
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is required"
  exit 1
fi

echo "Running migration with DATABASE_URL=$(echo $DATABASE_URL | sed 's/:.*@/:***@/')"

npx prisma generate

if [ "$NODE_ENV" = "production" ]; then
  npx prisma migrate deploy
else
  npx prisma migrate dev --name ${MIGRATION_NAME:-init}
fi
