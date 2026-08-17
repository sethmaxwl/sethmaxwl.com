import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: z.object({
        src: image(),
        alt: z.string().min(1),
      }),
      coverImage: z.string().regex(/^\/\S+$/, 'Expected a root-relative public asset path.'),
      sortOrder: z.number().int().nonnegative().optional(),
      featuredRank: z.number().int().positive().optional(),
      externalLink: z
        .object({
          label: z.string().min(1),
          href: z.url(),
        })
        .optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updatedAt: z.date().optional(),
    coverImage: z.string().regex(/^\/\S+$/, 'Expected a root-relative public asset path.'),
  }),
});

export const collections = { work, blog };
