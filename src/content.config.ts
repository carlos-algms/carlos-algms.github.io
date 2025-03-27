import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './source/_posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    updated: z.date(),
    tags: z.array(z.string()),
    comments: z.optional(z.boolean()),
  }),
});

export const collections = { blog };
