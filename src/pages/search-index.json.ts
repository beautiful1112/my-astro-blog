import { getCollection } from 'astro:content';
import { formatRootLabel, noteHref, noteTitle } from '../utils/notes';

function stripMarkdown(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Keep enough body text for keyword search without bloating the index. */
const BODY_LIMIT = 3000;

function noteCategory(id: string): string {
  const root = id.includes('/') ? id.split('/')[0]! : id;
  return formatRootLabel(root);
}

export async function GET() {
  const [blogPosts, weeklyPosts, fundamentals, linux] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('weekly', ({ data }) => !data.draft),
    getCollection('fundamentals', ({ data }) => !data.draft),
    getCollection('linux', ({ data }) => !data.draft),
  ]);

  const entries = [
    ...blogPosts.map((p) => ({
      title: p.data.title,
      description: p.data.description || '',
      category: p.data.category || '',
      tags: p.data.tags || [],
      slug: p.id,
      href: `/post/${p.id}`,
      type: 'blog' as const,
      date: p.data.date.toISOString(),
      body: stripMarkdown(p.body || '').slice(0, BODY_LIMIT),
    })),
    ...weeklyPosts.map((p) => ({
      title: p.data.title,
      description: p.data.description || '',
      category: 'Weekly',
      tags: p.data.tags || [],
      slug: p.id,
      href: `/weekly/${p.id}`,
      type: 'weekly' as const,
      date: p.data.date.toISOString(),
      body: stripMarkdown(p.body || '').slice(0, BODY_LIMIT),
    })),
    ...fundamentals.map((n) => ({
      title: noteTitle(n.id, n.body, n.data.title),
      description: n.data.description || '',
      category: noteCategory(n.id),
      tags: [] as string[],
      slug: n.id,
      href: noteHref('/fundamentals', n.id),
      type: 'fundamentals' as const,
      date: null,
      body: stripMarkdown(n.body || '').slice(0, BODY_LIMIT),
    })),
    ...linux.map((n) => ({
      title: noteTitle(n.id, n.body, n.data.title),
      description: n.data.description || '',
      category: 'Linux',
      tags: [] as string[],
      slug: n.id,
      href: noteHref('/linux', n.id),
      type: 'linux' as const,
      date: null,
      body: stripMarkdown(n.body || '').slice(0, BODY_LIMIT),
    })),
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
}
