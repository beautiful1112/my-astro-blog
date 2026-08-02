import path from 'node:path';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

function resolveNoteBase(filepath: string): { basePath: string; fileDir: string } | null {
  const normalized = filepath.replace(/\\/g, '/');
  const fundamentalsIdx = normalized.lastIndexOf('/Fundamentals/');
  const linuxIdx = normalized.lastIndexOf('/Linux/');

  if (fundamentalsIdx !== -1) {
    const rel = normalized.slice(fundamentalsIdx + '/Fundamentals/'.length);
    return {
      basePath: '/fundamentals',
      fileDir: path.posix.dirname(rel),
    };
  }

  if (linuxIdx !== -1) {
    const rel = normalized.slice(linuxIdx + '/Linux/'.length);
    return {
      basePath: '/linux',
      fileDir: path.posix.dirname(rel),
    };
  }

  return null;
}

function rewriteMarkdownUrl(fileDir: string, basePath: string, url: string): string | null {
  const [rawPath, hash = ''] = url.split('#');
  if (!rawPath || !/\.mdx?$/i.test(rawPath)) return null;

  const withoutExt = rawPath.replace(/\.mdx?$/i, '');
  const resolved = path.posix.normalize(path.posix.join(fileDir, withoutExt));
  const cleaned = resolved.replace(/^\.\//, '').replace(/\/$/, '');
  const hashSuffix = hash ? `#${hash}` : '';
  return `${basePath}/${cleaned}${hashSuffix}`.replace(/\/{2,}/g, '/');
}

/** Rewrite relative `.md` links inside Fundamentals/Linux notes to site routes. */
export function remarkRewriteMdLinks() {
  return (tree: Root, file: VFile) => {
    const filepath = file.history?.[0] || file.path || '';
    const note = resolveNoteBase(filepath);
    if (!note) return;

    visit(tree, 'link', (node) => {
      if (typeof node.url !== 'string') return;
      if (
        node.url.startsWith('http://') ||
        node.url.startsWith('https://') ||
        node.url.startsWith('mailto:') ||
        node.url.startsWith('#') ||
        node.url.startsWith('/')
      ) {
        return;
      }

      const rewritten = rewriteMarkdownUrl(note.fileDir, note.basePath, node.url);
      if (rewritten) {
        node.url = rewritten;
      }
    });
  };
}
