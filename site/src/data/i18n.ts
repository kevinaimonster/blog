import en from '../content/settings/en.json';
import zh from '../content/settings/zh.json';
import shared from '../content/settings/shared.json';
import { settingsSchema, sharedSchema } from './content-schema.mjs';
import { draftPreview } from './preview';
import type { Locale } from './locales';
export * from './locales';

const profiles = { en: settingsSchema.parse(en), zh: settingsSchema.parse(zh) };
const identity = sharedSchema.parse(shared);
const paths = ['/', '/notes/', '/bookmarks/', '/projects/', '/about/'];
const labels = {
  en: ['Journal', 'Writing', 'Bookmarks', 'Projects', 'About'],
  zh: ['首页', '文章', '收藏', '项目', '关于'],
};

export const getContent = (locale: Locale) => {
  const content = profiles[locale];
  return {
    site: { ...identity, ...content.site },
    navigation: paths.map((href, index) => ({
      href,
      label: labels[locale][index],
    })),
    thoughts: content.thoughts.filter((item) => draftPreview || !item.draft),
    bookmarks: content.bookmarks
      .filter((item) => draftPreview || !item.draft)
      .map((item) => ({ ...item, domain: new URL(item.url).hostname })),
    projects: content.projects.filter((item) => draftPreview || !item.draft),
  };
};
