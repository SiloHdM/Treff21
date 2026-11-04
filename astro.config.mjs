// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain steht noch nicht fest (siehe TODO.md). Beim Deploy setzen:
//   SITE_URL=https://www.deine-domain.de npm run build
// Dann werden auch canonical-URLs, og:url und sitemap.xml erzeugt.
const site = process.env.SITE_URL;

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: site ? [sitemap()] : [],
});
