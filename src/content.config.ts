import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().default(() => new Date()),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    cover: z.string().optional(),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const weeklyCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/weekly' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().default(() => new Date()),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    issue: z.number(),
    draft: z.boolean().default(false),
  }),
});

const noteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
});

const fundamentalsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/Fundamentals' }),
  schema: noteSchema,
});

const linuxCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/Linux' }),
  schema: noteSchema,
});

export const collections = {
  blog: blogCollection,
  weekly: weeklyCollection,
  fundamentals: fundamentalsCollection,
  linux: linuxCollection,
};
