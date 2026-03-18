
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      'process.env.VERTEX_CLIENT_EMAIL': JSON.stringify(env.VERTEX_CLIENT_EMAIL || process.env.VERTEX_CLIENT_EMAIL),
      'process.env.VERTEX_PRIVATE_KEY': JSON.stringify(env.VERTEX_PRIVATE_KEY || process.env.VERTEX_PRIVATE_KEY),
    },
    server: {
      port: 3000,
      host: true 
    }
  };
});
