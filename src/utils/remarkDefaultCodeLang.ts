import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * Fences without a language are router and firewall CLI on this blog.
 * Give them the cisco grammar so Shiki can color prompts, keywords, and addresses.
 */
export function remarkDefaultCodeLang() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      if (!node.lang) node.lang = 'cisco';
    });
  };
}
