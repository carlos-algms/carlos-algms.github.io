// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  site: 'https://carlos-algms.github.io',

  trailingSlash: 'always',

  build: {
    assets: 'assets',
  },

  i18n: {
    locales: ['de', 'en', 'pt-br'],
    defaultLocale: 'pt-br',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  experimental: {
    svg: true,
  },

  integrations: [
    react(),

    process.env.NODE_ENV === 'production' &&
      partytown({
        config: {
          forward: ['dataLayer.push', 'gtag'],
        },
      }),
  ],

  vite: {
    plugins: [tailwindcss(), yaml()],
  },
});
