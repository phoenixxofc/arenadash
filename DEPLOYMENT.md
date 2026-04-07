# Vercel Deployment Instructions

To deploy the new Vite-based web application to Vercel, follow these settings in your Vercel project configuration:

### 1. General Project Settings
- **Framework Preset**: Other (Vercel will detect `package.json` but since it's a monorepo, "Other" is often safest for custom overrides)
- **Root Directory**: `apps/vite-web` (Or leave as `.` if you use the `vercel.json` provided in the root)

### 2. Build & Development Settings
If you are deploying from the **root** of the monorepo (recommended):
- **Build Command**: `npm run build --workspace=vite-web`
- **Output Directory**: `apps/vite-web/dist`
- **Install Command**: `npm install`

If you have set the **Root Directory** in Vercel to `apps/vite-web`:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables
Make sure to migrate your environment variables with the `VITE_` prefix:
- `VITE_ENABLE_PRIVY`: `true` or `false`
- `VITE_PRIVY_APP_ID`: Your Privy App ID
- (Any other variables required by your components)

### 4. Monorepo Configuration
The project includes a `vercel.json` at the root which should automatically handle the builds and routing for the `apps/vite-web` directory:

```json
{
  "builds": [
    {
      "src": "apps/vite-web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/apps/vite-web/dist/$1" }
  ]
}
```

This ensures that all incoming requests are routed to the built Vite application.
