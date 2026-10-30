import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { noteSchema } from './data/content-schema.mjs';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: noteSchema,
});

export const collections = { notes };
