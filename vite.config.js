import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: `http://127.0.0.1:${process.env.BATLAIYE_BACKEND_PORT || process.env.PORT || 3000}`,
        ws: true,
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (error, request) => {
            const target = proxy.options.target?.href || proxy.options.target?.toString?.() || 'configured backend';
            console.error(`[vite socket proxy] ${request.url} → ${target}: ${error.code || error.message}. Start the backend with npm run dev, or npm run dev:server in another terminal.`);
          });
        },
      },
    },
  },
});
