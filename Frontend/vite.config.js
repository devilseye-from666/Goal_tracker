import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  server: {
    proxy: {
      '/api': 'https://goal-tracker-ohcq.onrender.com', // proxies /api requests to your backend
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase to 1000 KB or more
  },

})
