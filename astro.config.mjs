import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bmassey-brannen.github.io/astro',
//   base: '/astro',
  buildOptions: {
    publicPath: '/astro/',
  },
  integrations: [mdx(), sitemap()],
});
