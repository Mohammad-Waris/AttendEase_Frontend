import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [react()],
  base:process.env.VITE_BASE_PATH||"/AttendEase_Frontend"
});
