import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Bump lastmod when a page's content meaningfully changes.
const lastmod = {
  '/': '2026-10-12',
  '/privatlivspolitik': '2026-07-13',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://sophierantzau.dk',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        if (lastmod[path]) item.lastmod = lastmod[path];
        return item;
      },
    }),
  ],
});
