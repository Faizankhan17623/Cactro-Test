import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev we proxy /api to the backend so the frontend can just call
// "/api/..." without worrying about CORS or ports.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
