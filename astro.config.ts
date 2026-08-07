import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import { remarkRewriteMdLinks } from './src/utils/remarkRewriteMdLinks';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkRewriteMdLinks],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  adapter: cloudflare(),
});