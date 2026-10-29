import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site:
    process.env.SITE_URL ||
    'https://kevin-digital-garden.kevinmonster.chatgpt.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), mdx()],
});
