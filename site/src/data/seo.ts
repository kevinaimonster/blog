import { localizedPath, type Locale } from './i18n';

export const indexable = import.meta.env.SITE_INDEXABLE === 'true';
export const pagePaths = [
  '/',
  '/about/',
  '/projects/',
  '/bookmarks/',
  '/notes/',
];
export const pageAlternates = (path: string) =>
  (['en', 'zh'] as Locale[]).map((locale) => ({
    locale,
    path: localizedPath(path, locale),
  }));
export const escapeXml = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
