
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // SECURITY UPDATE: The 'define' block has been removed. 
    // We no longer inject process.env.API_KEY into the client.
    server: {
      port: 3000,
      host: true 
    }
  };
});
