# Vercel Deployment Instructions

To deploy the new Vite-based web application to Vercel, follow these settings in your Vercel project configuration:

### 1. General Project Settings
- **Framework Preset**: Other
- **Root Directory**: Keep it EMPTY (repo root)

### 2. Build & Development Settings
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `apps/vite-web/dist`
- **Install Command**: `npm install` (if not already handled by Build Command)

### 3. Environment Variables
Migrate your variables with the `VITE_` prefix:
- `VITE_ENABLE_PRIVY`: `true` or `false`
- `VITE_PRIVY_APP_ID`: Your Privy App ID

### 4. Why This Works
By deploying from the repo root, Vercel correctly handles the npm workspaces. The root `package.json` build script ensures that the `@arena-dash/engine` package is built before the `vite-web` application, resolving all internal dependency issues.
