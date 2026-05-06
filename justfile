default:
    @just --list

# Install dependencies (clean, lockfile-driven).
install:
    npm ci

# Vite dev server on http://localhost:3000 with HMR.
dev:
    npm run dev

# Production build to ./dist.
build:
    npm run build

# Vitest in watch-once mode.
test:
    npm test

# biome check (formatter + linter).
lint:
    npm run lint

# Required before pushing. Mirrors what CI runs.
check: lint test build

# Build the container image locally (multi-stage, npm ci inside Docker).
# Requires NODE_AUTH_TOKEN env var (https://github.com/orgs/intility/discussions/13).
docker-build:
    docker build -t react-vibe-app:local --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN .

# Build image the same way CI does: pre-build on host, copy dist/ into nginx.
# Requires just build to have run first (or runs it automatically).
docker-build-ci: build
    docker build -t react-vibe-app:ci -f Dockerfile.CI .
