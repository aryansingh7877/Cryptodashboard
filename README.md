# Nebula Markets

[Live Demo](https://nebulamarkets.vercel.app/)

Nebula Markets is a modern crypto dashboard built with React and TanStack Start.  
It focuses on a clean premium UI, responsive layouts, and a smooth real-time market browsing experience.

## Highlights

- **Live Market View:** Real-time data updates with auto-refresh logic.
- **Advanced Navigation:** Search, category filtering, and watchlist pinning.
- **Top Movers:** Instant identification of the biggest market gainers/losers.
- **Premium UX:** GSAP-powered micro-interactions and high-fidelity orbital visualizations.
- **Responsive Design:** Optimized for mobile, tablet, and desktop screens.
- **Glassmorphism Aesthetic:** A stunning, modern UI built with Tailwind CSS 4.

## Tech Stack

- **React 19** + TypeScript
- **TanStack Start** + TanStack Router (File-based routing)
- **TanStack Query** (State management & caching)
- **Vite 7**
- **Tailwind CSS 4**
- **GSAP** (High-performance animations)

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

## Deploy on Vercel

This project supports Vercel using Nitro for TanStack Start SSR.

1. Import the GitHub repository in Vercel.
2. Keep default install/build commands (`npm install`, `npm run build`).
3. Deploy (no UI changes required).

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

- **Performance:** Optimized for smooth interactions even with high-frequency data updates.
- **Initial Load:** Uses a reusable GSAP loading screen to prevent FOUC (Flash of Unstyled Content).
- **Environment Aware:** Vite proxy routes are used in local dev; production requests are configured to hit the API directly to avoid proxy 404s.

## License

This project is for personal/portfolio/demo usage.

**Live Link:** [https://nebulamarkets.vercel.app/](https://nebulamarkets.vercel.app/)
