import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'; // <-- ADD THIS LINE

export default defineConfig({
  plugins: [
    tailwindcss(),
    visualizer({ open: true, filename: 'bundle-stats.html' }), // <-- AND ADD THIS LINE
  ],
})