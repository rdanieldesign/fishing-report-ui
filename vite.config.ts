import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server:
    mode === 'remote'
      ? {
          proxy: {
            '/api': {
              target: 'https://api.fishing-report.site',
              changeOrigin: true,
            },
          },
        }
      : undefined,
}));
