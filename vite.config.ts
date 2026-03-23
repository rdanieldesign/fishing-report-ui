import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxies /api/* to the backend dev server
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
