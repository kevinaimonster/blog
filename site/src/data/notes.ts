import { getCollection, type CollectionEntry } from 'astro:content';
import { localizedPath, type Locale } from './i18n';

export const noteSlug = (note: CollectionEntry<'notes'>) =>
  note.id.replace(/^(en|zh)\//, '');
export const notePath = (note: CollectionEntry<'notes'>) =>
  note.data.permalink ||
  localizedPath(`/notes/${noteSlug(note)}/`, note.data.locale);

export const getPublishedNotes = async (locale?: Locale) =>
  (
    await getCollection(
      'notes',
      ({ data }) => !data.draft && (!locale || data.locale === locale),
    )
  ).sort((a, b) => b.data.date.localeCompare(a.data.date));

export const getNotes = async (locale: Locale) =>
  (await getPublishedNotes(locale)).filter((note) => !note.data.archived);

export const noteAlternates = async (note: CollectionEntry<'notes'>) =>
  (await getPublishedNotes())
    .filter((candidate) => noteSlug(candidate) === noteSlug(note))
    .map((candidate) => ({
      locale: candidate.data.locale,
      path: notePath(candidate),
    }));
