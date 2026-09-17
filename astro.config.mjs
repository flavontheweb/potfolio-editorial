// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://flavien-gaujard.fr',
  server: {
    host: true,
    port: 3000,
  },
});
