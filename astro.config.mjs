// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://flavien-gaujard.fr',
  server: {
    host: true,
    port: 3000,
  },
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'General Sans',
      cssVariable: '--font-display',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fragment Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['monospace'],
    },
  ],
});
