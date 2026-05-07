import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@omnicut/core': path.resolve(__dirname, '../../packages/core/src'),
      '@omnicut/store': path.resolve(__dirname, '../../packages/store/src'),
      '@omnicut/media-engine': path.resolve(__dirname, '../../packages/media-engine/src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'state-vendor': ['zustand', 'jotai', '@tanstack/react-query'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'jotai'],
  },
});
