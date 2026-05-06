# Claude Code guidance for timing-react-vibe

This is a React SPA on the Intility **vibe** app platform (`aa349-vibe`). Vite + React 19 + TypeScript + Bifrost. Keep dependencies minimal and stay close to standard tooling.

## Stack

- Node 20+, Vite, TypeScript 5.9+
- React 19, react-router v7 (data router)
- `@intility/bifrost-react` for UI components and CSS tokens
- No client-side auth library. The platform gateway (Dex) handles auth.
- biome (formatter + linter) and eslint with `@intility/eslint-config-react-compiler`
- vitest + happy-dom + @testing-library/react for tests
- Production container: `ghcr.io/intility/nginx-unprivileged-react`, listens on `:8080`

No global state library, no styled-components, no custom fetch wrappers. If something is already in Bifrost or react-router, use it.

## Run, test, build

```sh
just install      # npm ci
just dev          # Vite dev server on :3000
just check        # lint + test + build (CI mirror)
just docker-build # local image (needs NODE_AUTH_TOKEN env var)
```

Always run `just check` before declaring a task done. CI runs the same.

## Conventions

- Conventional Commits required (`feat:`, `fix:`, `chore:`, `feat!:`). release-please drives versioning.
- Use `just` for any task script. No Makefiles, no `scripts/*.sh`.
- No em dashes in text. Plain language.
- One route per file under `src/routes/`. Components under `src/components/`.
- Prefer Bifrost components and `bf-*` classes over custom CSS. CSS modules (`*.module.css`) when custom styling is unavoidable.
- Never hardcode colors. Use `--bfc-*` color tokens and `--bfs*` spacing tokens. Reference: <https://bifrost.intility.com>.
- Path alias `~/*` maps to `src/*` (configured in `tsconfig.app.json`). Use it for imports across folders.

## Auth

Auth is handled at the platform gateway by Dex. No client-side auth library is included. If you need to call APIs that require a bearer token, add a fetch wrapper that reads the token from the session cookie or a backend-for-frontend endpoint.

## Deployment

The platform handles it. Push to `main` → image build → sha-tag pinned in `deploy/base/kustomization.yaml` → Argo CD reconcile → live in ~50s.

- Container must listen on `:8080` (probes hit `GET /`).
- Resource limits in `deploy/base/deployment.yaml`. Bump if the bundle grows.
- Per-namespace `ResourceQuota` caps total resource use; bump in `deploy/base/resourcequota.yaml` for larger apps.
- Hostname is `<repo>.aa349-1l5zl3.intility.dev` (set in `deploy/base/httproute.yaml`).
- The Dockerfile mounts `NODE_AUTH_TOKEN` for `npm ci`. CI sources it from the org-level `NPM_INTILITY_COM_TOKEN` secret (inherited).

## What NOT to add

- Sentry. The vibe templates do not use it. Frontend telemetry, when introduced, will go through the platform OTel collector.
- A second CI workflow. The three workflows (`build-image.yml`, `template-init.yml`, `release-please.yml`) are the contract; the platform's `build-image.yml` is the only thing that pins sha tags.
- Argo manifests outside `deploy/base/`. The platform `ApplicationSet` only points at `deploy/base/`.
- `@fortawesome/pro-*` icon packs. They were stripped from this template; Bifrost's bundled icon set is enough for most cases.
- A custom nginx config. The base image already has SPA fallback (`try_files $uri /index.html`).
- `.env.local` files committed to git. Use real env vars or Actions secrets.
