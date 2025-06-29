import { z } from 'astro:content';

import pt from './pt-br.yml';
import en from './en.yml';
import de from './de.yml';

const langSchema = z.object({
  blog: z.string(),
  comments: z.string(),
  published: z.string(),
  experiments: z.string(),
  home: z.string(),
  next: z.string(),
  previous: z.string(),
  read_more: z.string(),
  share: z.string(),
  updated: z.string(),
  opened: z.string(),
  page: z.string(),
  go_to_previous_page: z.string(),
  go_to_next_page: z.string(),
  go_to_page: z.string(),
  home_welcome: z.string(),
  home_welcome_text: z.string(),
  gh_issues_all_i_opened: z.string(),
  gh_prs_all_i_opened: z.string(),
  recent_posts: z.string(),
  all_my_posts: z.string(),
  toggle_theme_title: z.string(),
  all_posts_with_tag: z.string(),
});

export const translations = {
  en: langSchema.parse(en),
  'pt-br': langSchema.parse(pt),
  de: langSchema.parse(de),
};

export type TranslationsLang = keyof typeof translations;

export function t(key: keyof typeof translations.en, lang: TranslationsLang) {
  return translations[lang][key];
}
