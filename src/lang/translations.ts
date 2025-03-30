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
});

export const translations = {
  en: langSchema.parse(en),
  'pt-br': langSchema.parse(pt),
  de: langSchema.parse(de),
};

export type TranslationsLang = keyof typeof translations;

export function t(
  key: keyof typeof translations.en,
  // FIXIT: make lang param mandatory
  lang: TranslationsLang = 'pt-br',
) {
  return translations[lang][key];
}
