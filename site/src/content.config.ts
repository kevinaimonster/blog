import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    locale: z.enum(['en', 'zh']),
    title: z.string(),
    description: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    permalink: z
      .string()
      .regex(/^\/(?!\/)(?:[A-Za-z0-9_-]+\/)+$/)
      .optional(),
    archived: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    illustration: z
      .object({
        src: z.string(),
        alt: z.string(),
        caption: z.string(),
      })
      .optional(),
  }),
});

export const collections = { notes };
