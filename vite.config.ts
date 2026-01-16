
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid TS error about missing property on Process type
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in your code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.ODILBEK_API_KEY': JSON.stringify(env.ODILBEK_API_KEY)
    },
    server: {
      port: 3000,
      host: true // This allows the server to be accessed via network IP if needed
    }
  };
});
