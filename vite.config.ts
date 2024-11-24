import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://romanovdimitrii.github.io/data-columns/',
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: './dist'
  },
  server: {
    fs: {
      strict: false
    }
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
