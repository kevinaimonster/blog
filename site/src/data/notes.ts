import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export const noteSlug = (note: CollectionEntry<'notes'>) =>
  note.id.replace(/^(en|zh)\//, '');
export const getNotes = async (locale: Locale) =>
  (
    await getCollection(
      'notes',
      ({ data }) => !data.draft && data.locale === locale,
    )
  ).sort((a, b) => b.data.date.localeCompare(a.data.date));
