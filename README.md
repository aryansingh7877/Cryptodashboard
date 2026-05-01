# Nebula Markets

Nebula Markets is a modern crypto dashboard built with React and TanStack Start.  
It focuses on a clean premium UI, responsive layouts, and a smooth real-time market browsing experience.

## Highlights

- Live crypto market view with auto-refreshing data
- Search, category filtering, watchlist pinning, and top movers
- Responsive UX for mobile, tablet, and desktop
- GSAP-powered micro-interactions and animated landing loader
- Dark/light theme support
- Built with a scalable component structure using Tailwind and Radix UI

## Tech Stack

- React 19 + TypeScript
- TanStack Start + TanStack Router
- TanStack Query
- Vite 7
- Tailwind CSS 4
- GSAP
- Cloudflare Worker deployment support (`wrangler`)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm (or Bun if you prefer)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Deploy on Cloudflare Workers

This project is already configured for Cloudflare Workers via `wrangler.jsonc`.

### 1) Login once

```bash
npx wrangler login
```

### 2) (Optional) Run Worker locally

```bash
npm run cf:dev
```

### 3) Deploy to production

```bash
npm run cf:deploy
```

After deploy, Wrangler prints your live Worker URL.

## Deploy on Vercel

This project now supports Vercel using Nitro for TanStack Start SSR.

1) Import the GitHub repository in Vercel  
2) Keep default install/build commands (`npm install`, `npm run build`)  
3) Deploy (no UI changes required)

If Vercel asks for a start command in manual environments, use:

```bash
npm run start
```

### Lint and format

```bash
npm run lint
npm run format
```

## Project Structure

```text
src/
  components/      # UI building blocks and feature sections
  hooks/           # Data/theme/watchlist hooks
  routes/          # File-based routes (TanStack Router)
  services/        # API/data access layer
  styles.css       # Global styles and theme tokens
```

## Notes

- The dashboard is optimized for smooth interactions even when data updates frequently.
- Initial page entry now uses a reusable GSAP loading screen to avoid abrupt first paint.
- The project currently uses npm lockfile by default, while Bun config files also exist.
- Vite proxy routes are used only in local dev; production requests are configured to avoid `/api` proxy 404s.

## License

This project is for personal/portfolio/demo usage unless you define a different license.
