# __APP_NAME__

Live at: <https://__APP_NAME__.aa349-1l5zl3.intility.dev/>

Container image: `ghcr.io/__APP_OWNER__/__APP_NAME__`.

## What this is

A React SPA on the Intility **vibe** app platform (`aa349-vibe`). Bootstrapped from `intility/react-vibe-template`. Vite + React 19 + TypeScript + Bifrost. MSAL is wired up for Entra ID login.

The platform handles deployment: `git push` to `main` builds an image, pins its sha tag in `deploy/base/kustomization.yaml`, and Argo CD reconciles the cluster. Steady-state push-to-live is around 50 seconds.

## How to develop

Prerequisites: Node 20+, [just](https://github.com/casey/just), a populated `~/.npmrc` (see [Intility NPM setup](https://github.com/orgs/intility/discussions/13)).

```sh
just install   # npm ci
just dev       # http://localhost:3000 with HMR
just check     # lint + test + build (run before pushing)
```

Live edits go in `src/`. Static assets in `public/`. The Vite dev server listens on `:3000`; the production container listens on `:8080`.

## How releases work

Conventional Commits are required. release-please opens a release PR on each push to `main`, bumping `package.json` based on commit history.

```
feat: add profile dropdown      # minor bump
fix: correct redirect URI       # patch bump
feat!: switch to Dex            # major bump
```

Merging the release PR cuts a tag, which the `build-image.yml` workflow turns into an immutable semver-tagged image.

## What's in this repo

- `src/` — React app (App.tsx, router, routes, components, MSAL auth helpers).
- `public/` — static assets served at the site root (favicons).
- `index.html` — Vite entry HTML.
- `Dockerfile` — multi-stage build. Builder runs `npm ci` + `npm run build`; runtime is `ghcr.io/intility/nginx-unprivileged-react`. Listens on `:8080`.
- `deploy/base/` — Kustomize manifests Argo CD applies to the cluster (Deployment, Service, HTTPRoute, NetworkPolicy, ResourceQuota).
- `deploy/overlays/` — per-environment overrides (empty by default).
- `.github/workflows/` — `build-image.yml` (image build + sha-pin), `template-init.yml` (one-shot, deletes itself), `release-please.yml` (semver releases).
- `justfile` — task runner.

## Required setup

When you create a new repo from this template, GitHub Actions runs `template-init.yml` once on the first push. It:

1. Substitutes `__APP_NAME__` and `__APP_OWNER__` in the tree.
2. Substitutes `__ENTRA_CLIENT_ID__` in `.env` (you replace this manually with your Entra app registration's client ID).
3. Writes `apps/<repo>.yaml` to `intility/aa349-vibe`, which registers the app with the platform.
4. Self-deletes.

CI uses the org-level `NPM_INTILITY_COM_TOKEN` secret (inherited automatically) and feeds it to the Dockerfile under the env name `NODE_AUTH_TOKEN`. No per-repo secret setup is needed unless your repo opts out of org secret inheritance.

## How the platform sees your app

`intility/aa349-vibe` runs an Argo CD `ApplicationSet` that watches `apps/*.yaml`. When `template-init.yml` writes your `apps/<repo>.yaml`, the ApplicationSet creates an `Application` pointing at this repo's `deploy/base/` and syncs it to namespace `app-<repo>`.

After that, every push to `main`:
1. `build-image.yml` builds and pushes `ghcr.io/__APP_OWNER__/__APP_NAME__:sha-XXXXXXX`.
2. The same workflow rewrites `deploy/base/kustomization.yaml`'s `newTag:` and pushes the manifest commit back.
3. Argo CD detects the manifest change (org-level webhook to `argocd-server`) and rolls the Deployment.

## Customization

- **Resources / replicas**: edit `deploy/base/deployment.yaml` directly, or add an overlay under `deploy/overlays/`.
- **Hostname**: edit `deploy/base/httproute.yaml`. Default is `<repo>.aa349-1l5zl3.intility.dev`.
- **NetworkPolicy**: defaults allow only ingress from the platform Gateway, plus DNS and HTTPS egress. Add rules in `deploy/base/networkpolicy.yaml` if you need to call internal services.
- **Auth**: MSAL is wired in `src/auth/`. To switch off auth-required routes, see comments in `src/App.tsx`. To swap auth providers entirely, replace `src/auth/`.
- **Telemetry**: not configured by default. Add `OTEL_*` env vars in `deploy/base/deployment.yaml` and an egress rule in `deploy/base/networkpolicy.yaml` (see `gohtmx-vibe-template` for the pattern).

## Help

Platform questions: <https://github.com/intility/aa349-vibe>. Template questions: <https://github.com/intility/react-vibe-template>.
