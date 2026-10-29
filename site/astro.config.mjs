import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: process.env.SITE_URL || 'https://kevin1988.fun',
  output: 'static',
  outDir: '../dist',
  trailingSlash: 'always',
  integrations: [react(), mdx()],
});
