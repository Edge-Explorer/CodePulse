# CodePulse AI Frontend

A high-performance, visually immersive dashboard for code intelligence, built with React 19, Vite, and Framer Motion.

## 🏗️ Architecture
The project follows a modular, scalable architecture to ensure reliability and ease of debugging:

- **`/src/components`**: Reusable UI atoms and molecules (Sidebars, Statistcs Cards).
- **`/src/pages`**: High-level screen components (Landing, Dashboard overview).
- **`/src/main.jsx`**: The entry point, equipped with a Global Error Catcher for production observability.

## 🎨 Design System
- **Theme**: Futuristic Dark Mode with Glassmorphism.
- **Animations**: Orchestrated via Framer Motion for staggered entrances and layout transitions.
- **Icons**: Standardized Lucide-React icon set.

## 🛠️ Troubleshooting & Reliability
During development, we encountered and resolved:
1. **Directory Collisions**: Re-structured the monorepo to prevent nested project folders.
2. **Vite Cache Invalidation**: Implemented a `npx vite optimize --force` workflow to resolve corrupted dependency bundling.
3. **Ghost Crashes**: Integrated a custom global error handler in `main.jsx` to catch and display runtime failures on the screen.

## 🚀 Getting Started
```bash
npm install
npm run dev
```
