// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

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
    sitemap({
      // FIXIT: remove the en and de filters after the pages are translated
      filter: (page) => !(page.includes('/en/') || page.includes('/de/')),
    }),

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
