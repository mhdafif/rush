# Deploying RUSH

A static Vite/React SPA — no backend, no database, no environment variables
at build or runtime (verified: no `import.meta.env` usage anywhere in `src/`).
It's built and served via [Nixpacks](https://nixpacks.com), with
[`serve`](https://github.com/vercel/serve) as the static file server.

## Dokploy

1. **Create Application** → connect this repo/branch.
2. **Build type: Nixpacks** — auto-detected, no Dockerfile in this repo.
   `nixpacks.toml` at the repo root pins the exact build steps (see below),
   so Dokploy doesn't need to guess.
3. **Domains** tab → add `rush.aafif.space` → set the container port to
   **`3000`** (matches `serve`'s hardcoded port in `package.json`'s `start`
   script and in `nixpacks.toml`). Dokploy's built-in Traefik issues the
   Let's Encrypt cert and handles routing — nothing else to configure.
4. Deploy. Under the hood this runs, in order:
   - `corepack enable && pnpm install --frozen-lockfile`
   - `pnpm build` (→ `vite build` → static output in `dist/`)
   - `pnpm start` (→ `serve -s dist -l 3000`)
5. Future updates: push to the connected branch, or hit **Redeploy** in
   Dokploy. No manual steps.

(The exact field name for the container port may differ slightly by
Dokploy version — look for wherever it asks which port the container
listens on internally.)

## Raw Nixpacks + Docker (bypassing Dokploy, e.g. for a quick local test)

```bash
curl -sSL https://nixpacks.com/install.sh | bash   # if the nixpacks CLI isn't installed yet
nixpacks build . --name rush
docker run -d --name rush -p 3000:3000 --restart unless-stopped rush
```

Then point whatever's in front of it (reverse proxy, or nothing for a quick
check) at `http://localhost:3000`.

## Why it's set up this way

- **`nixpacks.toml`** pins the three phases explicitly instead of leaning on
  Nixpacks' auto-detection, so the build can't silently change behavior later:
  install (`pnpm install --frozen-lockfile`) → build (`pnpm build`) → start
  (`pnpm start`).
- **`serve` is a real dependency, not a devDependency.** `vite preview` was
  the obvious first choice (it's already bundled with Vite, zero extra
  packages) but Vite itself is a devDependency — if Nixpacks' production
  install ever prunes devDependencies (`NODE_ENV=production` makes both npm
  and pnpm skip them), `vite preview` would go missing at runtime. `serve`
  guarantees the static server survives into the production install.
- **Port 3000 is hardcoded**, not read from a `$PORT` env var, since Dokploy
  expects you to declare a fixed container port in its UI rather than
  injecting one — a fixed number on both sides removes the ambiguity.
- **Node version** comes from `.nvmrc` (already in this repo, `v24.14.1`) —
  Nixpacks reads it automatically, so it isn't duplicated in `nixpacks.toml`.
