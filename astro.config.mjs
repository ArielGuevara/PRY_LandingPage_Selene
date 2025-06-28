// @ts-check
import { defineConfig } from 'astro/config';

import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), svgr()],
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },

  experimental: {
    //svg: true
  },
  adapter: vercel()
});