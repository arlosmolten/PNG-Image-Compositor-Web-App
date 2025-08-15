import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/PNG-Image-Compositor-Web-App/',
  plugins: [react()],
  server: {
    open: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
