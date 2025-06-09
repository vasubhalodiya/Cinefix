// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  // vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'), // ✅ Needed to use '@/redux/movieApi'
  },
}
});
