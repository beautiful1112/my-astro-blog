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

export function topicHref(topicId: string): string {
  return `/fundamentals/topic/${topicId.toLowerCase()}`;
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

export interface NoteNav {
  topicId: string;
  topicLabel: string;
  topicHref: string;
  moduleLabel?: string;
  moduleHref?: string;
  isModuleIndex: boolean;
  isDeepDive: boolean;
}

export function isReadme(id: string): boolean {
  const lower = id.toLowerCase();
  return lower.endsWith('/readme') || lower === 'readme';
}

export function isDeepDive(id: string): boolean {
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

/** Resolve chrome links for a Fundamentals note from its collection id. */
export function resolveNoteNav(id: string, topics: NoteTopic[]): NoteNav | null {
  const parts = id.split('/');
  if (parts.length === 0) return null;

  const topicId = parts[0]!;
  const topic = topics.find((t) => t.id === topicId);
  const topicLabel = topic?.label ?? formatRootLabel(topicId);

  if (isDeepDive(id) || parts.length === 1) {
    return {
      topicId,
      topicLabel,
      topicHref: topicHref(topicId),
      isModuleIndex: false,
      isDeepDive: isDeepDive(id),
    };
  }

  const moduleId = `${parts[0]}/${parts[1]}`;
  const mod = topic?.modules.find((m) => m.id === moduleId);
  const moduleLabel = mod?.label ?? formatRootLabel(parts[1]!);
  const moduleHref = mod?.indexId
    ? noteHref('/fundamentals', mod.indexId)
    : undefined;

  return {
    topicId,
    topicLabel,
    topicHref: topicHref(topicId),
    moduleLabel,
    moduleHref,
    isModuleIndex: isReadme(id),
    isDeepDive: false,
  };
}
