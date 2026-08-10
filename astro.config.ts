import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import { unified } from '@astrojs/markdown-remark';
import { remarkRewriteMdLinks } from './src/utils/remarkRewriteMdLinks';

const mermaidPlugin = [
  rehypeMermaid,
  {
    // Inline SVG keeps diagrams crisp and works offline in static dist/.
    // Single (light) theme + CSS card background keeps diagrams readable
    // under the site's class-based dark mode toggle.
    strategy: 'img-svg' as const,
  },
];

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [
    mdx({
      rehypePlugins: [mermaidPlugin, rehypeKatex],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Leave ```mermaid fences as plain code so rehype-mermaid can replace them.
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    processor: unified({
      remarkPlugins: [remarkMath, remarkRewriteMdLinks],
      rehypePlugins: [mermaidPlugin, rehypeKatex],
    }),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
