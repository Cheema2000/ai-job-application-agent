import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/runs':  'http://localhost:3001',
      '/jobs':  'http://localhost:3001',
      '/files': 'http://localhost:3001',
      '/ws': {
        target:    'ws://localhost:3001',
        ws:        true,
        changeOrigin: true,
      },
    },
  },
});
