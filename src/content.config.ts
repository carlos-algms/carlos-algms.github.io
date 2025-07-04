import { defineCollection, getCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { githubIssues, githubPrs } from './content/github.content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './source/_posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    updated: z.date(),
    tags: z.array(z.string()),
    lang: z.enum(['en', 'de', 'pt-br']),
    comments: z.optional(z.boolean()),
  }),
});

export const collections = { blog, githubIssues, githubPrs };

export async function getBlogPostsSorted() {
  const posts = await getCollection('blog');

  return posts.toSorted((a, b) => {
    return b.data.updated.getTime() - a.data.updated.getTime();
  });
}
