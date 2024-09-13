import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Explicitly set the port to 3000
    watch: {
      usePolling: true  // Enable polling for better compatibility with Docker
    },
    proxy: {
      '/api': {
        target: 'https://uni005eu5.fusionsolar.huawei.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
