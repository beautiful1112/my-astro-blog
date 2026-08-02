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
    .replace(/^\d+\s+/i, '')
    .trim();
}

/** Astro content ids / routes are lowercase — always normalize. */
export function noteHref(base: '/fundamentals' | '/linux', id: string): string {
  return `${base}/${id.toLowerCase()}`;
}

export function formatRootLabel(root: string): string {
  return root
    .replace(/_/g, ' ')
    .replace(/^\d+\s+/i, '')
    .trim();
}

export interface NoteMeta {
  id: string;
  title: string;
}

export interface NoteModule {
  id: string;
  label: string;
  indexId?: string;
  notes: NoteMeta[];
}

export interface NoteTopic {
  id: string;
  label: string;
  deepDive?: NoteMeta;
  modules: NoteModule[];
  looseNotes: NoteMeta[];
}

function isReadme(id: string): boolean {
  return id.toLowerCase().endsWith('/readme') || id.toLowerCase() === 'readme';
}

function isDeepDive(id: string): boolean {
  const leaf = id.split('/').pop()?.toLowerCase() ?? '';
  return leaf.endsWith('_deep_dive') || leaf.endsWith('-deep-dive');
}

/** Build Multicast / BGP style topic → module → note hierarchy. */
export function buildNoteTopics(notes: NoteMeta[]): NoteTopic[] {
  const byRoot = new Map<string, NoteMeta[]>();

  for (const note of notes) {
    const root = note.id.includes('/') ? note.id.split('/')[0]! : '_root';
    const list = byRoot.get(root) ?? [];
    list.push(note);
    byRoot.set(root, list);
  }

  const topics: NoteTopic[] = [];

  for (const [root, rootNotes] of [...byRoot.entries()].sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )) {
    const deepDive = rootNotes.find((n) => isDeepDive(n.id));
    const remainder = rootNotes.filter((n) => n !== deepDive);

    const moduleMap = new Map<string, NoteMeta[]>();
    const looseNotes: NoteMeta[] = [];

    for (const note of remainder) {
      const parts = note.id.split('/');
      if (parts.length >= 3) {
        const moduleId = `${parts[0]}/${parts[1]}`;
        const list = moduleMap.get(moduleId) ?? [];
        list.push(note);
        moduleMap.set(moduleId, list);
      } else if (parts.length === 2 && !isDeepDive(note.id)) {
        // topic/file.md (non deep-dive) — treat as loose
        looseNotes.push(note);
      } else {
        looseNotes.push(note);
      }
    }

    const modules: NoteModule[] = [...moduleMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([moduleId, moduleNotes]) => {
        const index = moduleNotes.find((n) => isReadme(n.id));
        const children = moduleNotes
          .filter((n) => n !== index)
          .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

        const moduleLeaf = moduleId.split('/')[1] ?? moduleId;
        return {
          id: moduleId,
          label: index?.title || formatRootLabel(moduleLeaf),
          indexId: index?.id,
          notes: children,
        };
      });

    topics.push({
      id: root,
      label: formatRootLabel(root),
      deepDive,
      modules,
      looseNotes: looseNotes.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true }),
      ),
    });
  }

  return topics;
}
