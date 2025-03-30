// @ts-check
import { defineConfig } from 'astro/config';

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

  integrations: [react()],

  vite: {
    plugins: [tailwindcss(), yaml()],
  },
});
