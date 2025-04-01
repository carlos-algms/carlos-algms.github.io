import { defineCollection, z } from 'astro:content';

const issueSchema = z.object({
  html_url: z.string(),
  state: z.enum(['open', 'closed']),
  title: z.string(),
  number: z.number(),
  repository_url: z.string(),
  created_at: z.string(),
  assignee: z
    .optional(
      z.object({
        html_url: z.string(),
        login: z.string(),
      }),
    )
    .nullable(),
});

export const githubIssues = defineCollection({
  loader: searchGitHub('issue'),
  schema: issueSchema,
});

export const githubPrs = defineCollection({
  loader: async () => {
    const prs = await searchGitHub('pr')();

    const prsWithPrData = await Promise.all(
      prs.map(async (pr: { pull_request: { url: string } }) => {
        const prData = await fetch(pr.pull_request.url, {
          headers: {
            Authorization: `token ${import.meta.env.GH_TOKEN}`,
          },
        }).then((res) => res.json());

        return {
          ...pr,
          pull_request: {
            ...prs.pull_request,
            ...prData,
          },
        };
      }),
    );

    return prsWithPrData;
  },
  schema: issueSchema.extend({
    pull_request: z.object({
      head: z.object({
        label: z.string(),
        ref: z.string(),
      }),
      base: z.object({
        label: z.string(),
        ref: z.string(),
        repo: z.object({
          full_name: z.string(),
        }),
      }),
    }),
  }),
});

function searchGitHub(type: 'pr' | 'issue') {
  return async () => {
    const url = [
      'https://api.github.com/search/issues?sort=created&order=desc&per_page=10&q=',
      `is:${type}`,
      'author:carlos-algms',
      '-org:carlos-algms',
      '-user:carlos-algms',
      '-user:webdev-tools',
      '-user:talesprates',
    ].join('+');

    console.log(`Github ${type} URL: `, url);

    const issues = await fetch(url, {
      headers: {
        Authorization: `token ${import.meta.env.GH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          console.error('Github error: ', data);
          throw new Error(data.message);
        }

        return data;
      })
      .then((data) =>
        data.items.map((issue: any) => ({
          ...issue,
          // Astro requires the id to be a string
          id: issue.id.toString(),
        })),
      );

    console.log(`Github ${type} loaded: `, issues.length);

    return issues;
  };
}
