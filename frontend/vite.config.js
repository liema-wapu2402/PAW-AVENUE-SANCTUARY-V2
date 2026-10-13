import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // `npm run dev` opens the browser straight on the Home page
  server: { port: 5173, open: '/' },
});
