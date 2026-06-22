export const SITE_TITLE = 'Alex Zhao';
export const SITE_DESCRIPTION = 'Sharing and Learning';
export const SITE_AUTHOR = 'Alex Zhao';
export const SITE_URL = 'https://example.com';
export const SITE_AVATAR = '/profile-icon.jpg';
export const SITE_COVER = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920';

export const PAGE_SIZE = 10;

export interface BlogSection {
  label: string;
  href?: string;
  category?: string;
  slug?: string;
}

export const BLOG_SECTIONS: BlogSection[] = [
  { label: 'Homepage', href: '/' },
  { label: 'Moments', category: 'Moments', slug: 'moments' },
  { label: 'Routing & Switching', category: 'Routing & Switching', slug: 'routing-switching' },
  { label: 'Docker', category: 'Docker', slug: 'docker' },
  { label: 'Kubernetes', category: 'Kubernetes', slug: 'kubernetes' },
  { label: 'Ansible', category: 'Ansible', slug: 'ansible' },
  { label: 'NetDevOps', category: 'NetDevOps', slug: 'netdevops' },
  { label: 'Archives', href: '/archives' },
  { label: 'Thoughts and Reflections', category: 'Thoughts and Reflections', slug: 'thoughts-and-reflections' },
  { label: 'Friendly Link', href: '/friends' },
  { label: 'About', href: '/about' },
];

export const BLOG_CATEGORIES = BLOG_SECTIONS
  .filter((section) => section.category)
  .map((section) => section.category!);

export const CATEGORY_BY_SLUG = Object.fromEntries(
  BLOG_SECTIONS
    .filter((section) => section.slug && section.category)
    .map((section) => [section.slug!, section.category!]),
);

export const SLUG_BY_CATEGORY = Object.fromEntries(
  BLOG_SECTIONS
    .filter((section) => section.slug && section.category)
    .map((section) => [section.category!, section.slug!]),
);

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function categoryHref(category: string): string {
  const slug = SLUG_BY_CATEGORY[category] ?? slugifyCategory(category);
  return `/categories/${slug}`;
}

export function sectionHref(section: BlogSection): string {
  if (section.slug) {
    return `/categories/${section.slug}`;
  }
  return section.href ?? '/';
}

export const NAV_ITEMS = BLOG_SECTIONS.map((section) => ({
  label: section.label,
  href: sectionHref(section),
}));

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/beautiful1112', icon: 'github' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-zhao-05ab54275', icon: 'linkedin' },
  { name: 'RSS', href: '/rss.xml', icon: 'rss' },
];

export const SITE_TAGS = [
  'BGP',
  'Multicast',
  'troubleshooting',
  'Tacacs',
  'Fortigate',
  'Firewall',
  'Grafana',
  'Influxdb',
  'CCIE',
  'RESTCONF',
  'NETCONF',
  'EIGRP',
  'OSPF',
];

export const npmCDN = '';
export const walineServer = '';
