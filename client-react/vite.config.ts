import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxies /api/* to the backend dev server — mirrors Angular's proxy.conf.json
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
