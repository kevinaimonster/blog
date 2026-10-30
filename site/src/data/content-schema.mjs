import { z } from 'astro/zod';

const text = z.string().trim().min(1, 'Must not be empty');
const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable lowercase slug');
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(date.valueOf()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, 'Use a real calendar date: YYYY-MM-DD');
const webUrl = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), 'Use an http or https URL');
const imagePath = z
  .string()
  .regex(/^\/images\/[A-Za-z0-9_./-]+$/)
  .refine(
    (value) => !value.split('/').includes('..'),
    'Image must stay inside public/images',
  );

export const noteSchema = z
  .object({
    locale: z.enum(['en', 'zh']),
    title: text,
    description: z.string(),
    date: dateSchema,
    updated: dateSchema.optional(),
    permalink: z
      .string()
      .regex(/^\/(?!\/)(?:[A-Za-z0-9_-]+\/)+$/)
      .optional(),
    archived: z.boolean().default(false),
    tags: z.array(text).default([]),
    draft: z.boolean().default(false),
    illustration: z
      .object({
        src: imagePath,
        alt: text,
        caption: text,
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.illustration &&
      !!data.illustration.width !== !!data.illustration.height
    )
      ctx.addIssue({
        code: 'custom',
        path: ['illustration'],
        message: 'Specify both width and height, or omit both',
      });
    if (!data.draft && !data.description.trim())
      ctx.addIssue({
        code: 'custom',
        path: ['description'],
        message: 'Published notes need a description',
      });
    if (data.updated && data.updated < data.date)
      ctx.addIssue({
        code: 'custom',
        path: ['updated'],
        message: 'Updated date must not precede publication',
      });
  });

export const sharedSchema = z
  .object({ name: text, github: webUrl, x: webUrl, avatar: imagePath })
  .strict();
export const settingsSchema = z
  .object({
    site: z
      .object({
        title: text,
        description: text,
        tagline: text,
        about: z.array(text).min(1),
      })
      .strict(),
    thoughts: z.array(
      z
        .object({
          id,
          title: text,
          date: dateSchema,
          text,
          tag: text,
          draft: z.boolean().default(false),
        })
        .strict(),
    ),
    bookmarks: z.array(
      z
        .object({
          id,
          title: text,
          url: webUrl,
          description: text,
          category: text,
          date: dateSchema,
          draft: z.boolean().default(false),
        })
        .strict(),
    ),
    projects: z.array(
      z
        .object({
          id,
          name: text,
          description: text,
          url: webUrl,
          role: text,
          category: text,
          featured: z.boolean().default(false),
          draft: z.boolean().default(false),
        })
        .strict(),
    ),
  })
  .strict()
  .superRefine((data, ctx) => {
    for (const collection of ['thoughts', 'bookmarks', 'projects']) {
      const seen = new Set();
      data[collection].forEach((entry, index) => {
        if (seen.has(entry.id))
          ctx.addIssue({
            code: 'custom',
            path: [collection, index, 'id'],
            message: 'Duplicate ID in this collection',
          });
        seen.add(entry.id);
      });
    }
  });
