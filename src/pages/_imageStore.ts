const blogRaw = import.meta.glob<{ default: any }>('../content/blog/**/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  query: '?url',
});

const weeklyRaw = import.meta.glob<{ default: any }>('../content/weekly/**/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  query: '?url',
});

const imageMap: Record<string, string> = {};

function buildMap(glob: typeof blogRaw) {
  for (const [key, mod] of Object.entries(glob)) {
    const val: any = mod;
    const inner = val?.default || val;
    const url = typeof inner === 'string' ? inner : (inner?.src || '');
    if (url) {
      const cleanKey = key.replace(/^\.\.\/content\//, '');
      imageMap[cleanKey] = url;
    }
  }
}

buildMap(blogRaw);
buildMap(weeklyRaw);

function slugifyPath(p: string) {
  return p
    .split('/')
    .map((segment) => segment.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .join('/');
}

export function resolveCover(collection: string, entryId: string, cover?: string): string | undefined {
  if (!cover) return undefined;
  if (!cover.startsWith('./') && !cover.startsWith('../')) return cover;

  const relativePath = cover.replace(/^\.\//, '');
  const lookupKey = `${collection}/${entryId}/${relativePath}`.replace(/\\/g, '/');

  if (imageMap[lookupKey]) return imageMap[lookupKey];

  // Astro slugifies content IDs (spaces → hyphens). Vite glob keys keep the original folder name.
  const slugLookup = slugifyPath(lookupKey);
  for (const [key, url] of Object.entries(imageMap)) {
    if (slugifyPath(key) === slugLookup) return url;
  }

  return cover;
}
