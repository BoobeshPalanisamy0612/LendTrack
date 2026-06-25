import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // must match vercel.json distDir
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://boobesh-lend-track.vercel.app',
        changeOrigin: true,
      },
    },
  },
});