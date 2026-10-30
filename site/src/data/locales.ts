export type Locale = 'en' | 'zh';
export const localeFromPath = (path: string): Locale =>
  /^\/zh(?:\/|$)/.test(path) ? 'zh' : 'en';
export const withoutLocale = (path: string) =>
  path.replace(/^\/zh(?=\/|$)/, '') || '/';
export const localizedPath = (path: string, locale: Locale) =>
  `${locale === 'zh' ? '/zh' : ''}${withoutLocale(path)}`;
export const translator = (locale: Locale) => (zh: string, en: string) =>
  locale === 'zh' ? zh : en;
