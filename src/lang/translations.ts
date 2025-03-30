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
  pt: langSchema.parse(pt),
  en: langSchema.parse(en),
  de: langSchema.parse(de),
};

export function t(
  key: keyof typeof translations.pt,
  lang: keyof typeof translations = 'pt',
) {
  return translations[lang][key];
}
