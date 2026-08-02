/** Derive a display title from note body or path id. */
export function noteTitle(id: string, body?: string, explicit?: string): string {
  if (explicit?.trim()) return explicit.trim();

  if (body) {
    const match = body.match(/^#\s+(.+)$/m);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  const leaf = id.split('/').pop() || id;
  return leaf
    .replace(/\.mdx?$/i, '')
    .replace(/_/g, ' ')
    .replace(/^\d+\s+/, '')
    .trim();
}

export function noteHref(base: '/fundamentals' | '/linux', id: string): string {
  return `${base}/${id}`;
}

/** Group note ids by top-level folder (e.g. 01_Multicast). */
export function groupNotesByRoot(ids: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const id of ids) {
    const root = id.includes('/') ? id.split('/')[0]! : 'Notes';
    const list = groups.get(root) ?? [];
    list.push(id);
    groups.set(root, list);
  }

  for (const [key, list] of groups) {
    list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    groups.set(key, list);
  }

  return groups;
}

export function formatRootLabel(root: string): string {
  return root
    .replace(/_/g, ' ')
    .replace(/^\d+\s+/, '')
    .trim();
}
