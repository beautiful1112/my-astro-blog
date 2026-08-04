import path from 'node:path';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Root, Paragraph, Link } from 'mdast';
import type { VFile } from 'vfile';

type NoteBase = '/fundamentals' | '/linux';

interface NoteContext {
  basePath: NoteBase;
  /** Directory of the current file, relative to the collection root. */
  fileDir: string;
}

/**
 * Resolve note context from whatever path Astro/VFile provides.
 * Handles:
 * - absolute paths containing /Fundamentals/ or /Linux/
 * - collection-relative paths like 01_Multicast/02_Mental_Model/note.md
 * - Linux top-level files like Ubuntu_Kernel_Panic_Recovery_Postmortem.md
 */
function resolveNoteContext(filepath: string): NoteContext | null {
  const normalized = filepath.replace(/\\/g, '/');

  const fundamentalsIdx = normalized.lastIndexOf('/Fundamentals/');
  if (fundamentalsIdx !== -1) {
    const rel = normalized.slice(fundamentalsIdx + '/Fundamentals/'.length);
    return {
      basePath: '/fundamentals',
      fileDir: path.posix.dirname(rel),
    };
  }

  const linuxIdx = normalized.lastIndexOf('/Linux/');
  if (linuxIdx !== -1) {
    const rel = normalized.slice(linuxIdx + '/Linux/'.length);
    return {
      basePath: '/linux',
      fileDir: path.posix.dirname(rel),
    };
  }

  // Collection-relative Fundamentals paths (common in content-layer VFiles)
  const bare = normalized.replace(/^\.\//, '');
  if (/^\d{2}_[^/]+(\/|$)/.test(bare)) {
    return {
      basePath: '/fundamentals',
      fileDir: path.posix.dirname(bare),
    };
  }

  // Collection-relative Linux single files / nested files
  if (
    /^[A-Za-z0-9][^/]*\.mdx?$/i.test(bare) ||
    (!bare.includes('content/') && bare.toLowerCase().includes('ubuntu'))
  ) {
    return {
      basePath: '/linux',
      fileDir: path.posix.dirname(bare) === '.' ? '.' : path.posix.dirname(bare),
    };
  }

  return null;
}

function toSiteHref(basePath: NoteBase, relativeWithoutExt: string, hash: string): string {
  const cleaned = relativeWithoutExt
    .replace(/^\.\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
  const hashSuffix = hash ? `#${hash}` : '';
  if (!cleaned || cleaned === '.') {
    return `${basePath}${hashSuffix}`;
  }
  return `${basePath}/${cleaned}${hashSuffix}`.replace(/\/{2,}/g, '/');
}

function rewriteMarkdownUrl(ctx: NoteContext, url: string): string | null {
  const [rawPath, hash = ''] = url.split('#');
  if (!rawPath) return null;

  // Already a site route — force lowercase
  if (rawPath.startsWith('/fundamentals/') || rawPath.startsWith('/linux/')) {
    return toSiteHref(
      rawPath.startsWith('/linux/') ? '/linux' : '/fundamentals',
      rawPath.replace(/^\/(fundamentals|linux)\//, ''),
      hash,
    );
  }

  if (!/\.mdx?$/i.test(rawPath)) return null;

  const withoutExt = rawPath.replace(/\.mdx?$/i, '');
  const resolved = path.posix.normalize(path.posix.join(ctx.fileDir, withoutExt));
  return toSiteHref(ctx.basePath, resolved, hash);
}

function isNavParagraph(node: Paragraph): boolean {
  const text = toString(node);
  if (!text) return false;
  const looksLikeNav =
    /(module index|master index)/i.test(text) &&
    (text.includes('←') || text.includes('↑') || text.includes('|') || text.includes('·'));
  // Only strip short chrome lines, not long body paragraphs that mention "master index"
  return looksLikeNav && text.length < 160;
}

function stripNavParagraphs(tree: Root): void {
  visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
    if (index == null || !parent || !Array.isArray(parent.children)) return;
    if (!isNavParagraph(node)) return;
    parent.children.splice(index, 1);
    return index;
  });
}

function rewriteLinks(tree: Root, ctx: NoteContext | null): void {
  visit(tree, 'link', (node: Link) => {
    if (typeof node.url !== 'string') return;
    if (
      node.url.startsWith('http://') ||
      node.url.startsWith('https://') ||
      node.url.startsWith('mailto:') ||
      node.url.startsWith('#')
    ) {
      return;
    }

    // Absolute site routes: always lowercase even without file context
    if (node.url.startsWith('/fundamentals/') || node.url.startsWith('/linux/')) {
      const [p, hash = ''] = node.url.split('#');
      node.url = `${p.toLowerCase()}${hash ? `#${hash}` : ''}`;
      return;
    }

    if (!ctx) return;
    const rewritten = rewriteMarkdownUrl(ctx, node.url);
    if (rewritten) {
      node.url = rewritten;
    }
  });
}

/**
 * Fundamentals/Linux markdown pipeline:
 * 1. Strip inline Module/Master nav lines (replaced by layout chrome)
 * 2. Rewrite relative .md links to lowercase site routes
 * 3. Normalize any /fundamentals|/linux href casing
 */
export function remarkRewriteMdLinks() {
  return (tree: Root, file: VFile) => {
    const filepath = file.history?.[0] || file.path || '';
    const ctx = resolveNoteContext(filepath);

    stripNavParagraphs(tree);
    rewriteLinks(tree, ctx);
  };
}
