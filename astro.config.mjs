// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://Diego303.github.io',
  base: '/licit-docs/',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
