import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z
      .object({
        src: z.string().min(1),
        alt: z.string().min(1)
      }),
    externalLink: z
      .object({
        label: z.string().min(1),
        href: z.url()
      })
      .optional()
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
  })
});

export const collections = { work, blog };
