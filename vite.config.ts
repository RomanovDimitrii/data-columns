import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: '../dist'
  },
  server: {
    historyApiFallback: {
      disableDotRule: true,
      index: '/index.html'
    }
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
