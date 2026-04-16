import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration
 *
 * optimizeDeps.include: Forces Vite to pre-bundle these packages during
 * startup. This resolves ESM/CJS compatibility issues with lucide-react
 * and framer-motion under Vite 8, which caused the application to render
 * a blank white screen silently.
 */
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react'],
  },
})
