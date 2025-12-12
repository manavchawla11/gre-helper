import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // loads .env into env object
  const target = env.VITE_AUTOMATE_SUBSCRIBE_URL;

  if (!target) {
    console.warn('⚠️ Missing VITE_AUTOMATE_SUBSCRIBE_URL in .env');
  }

  return {
    plugins: [react()],
    server: {
      proxy: target
        ? {
            '/automate-subscribe': {
              target,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/automate-subscribe/, ''),
            },
          }
        : {},
    },
  };
});
