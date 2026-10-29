import * as chinese from './site';

export type Locale = 'en' | 'zh';
export const localeFromPath = (path: string): Locale =>
  /^\/zh(?:\/|$)/.test(path) ? 'zh' : 'en';
export const withoutLocale = (path: string) =>
  path.replace(/^\/zh(?=\/|$)/, '') || '/';
export const localizedPath = (path: string, locale: Locale) =>
  `${locale === 'zh' ? '/zh' : ''}${withoutLocale(path)}`;
export const translator = (locale: Locale) => (zh: string, en: string) =>
  locale === 'zh' ? zh : en;

const english = {
  site: {
    ...chinese.site,
    title: 'Kevin · Field notes',
    description:
      'Kevin’s personal blog. AI products, macOS tools, custom AI for businesses, and notes from the work.',
    about: [
      'I’m Kevin. I build independent AI products, macOS tools, and custom AI for businesses.',
      'My work covers the path from an idea to an AI application: product interaction, model integration, application development, and connections to existing workflows.',
      'Avatar is an infinite canvas for thinking with AI, and Flash is a macOS app. valseit brings together model routing, cost attribution, and custom applications. UPon connects chat and billing to enterprise workflows.',
      'This blog is where I share technical decisions, product experiments, and lessons from the work, including ideas that are still taking shape.',
    ],
  },
  navigation: chinese.navigation.map((item, index) => ({
    ...item,
    label: ['Journal', 'Writing', 'Bookmarks', 'Projects', 'About'][index],
  })),
  thoughts: chinese.thoughts.map((item) => ({
    ...item,
    text: 'Starting over with this space as a personal blog. A quick thought today can grow into a longer note tomorrow. No need to have it all figured out before writing it down.',
    tag: 'Building this site',
  })),
  bookmarks: chinese.bookmarks.map((item) => ({
    ...item,
    description:
      'A personal website design I’ve spent time with. Its clear typography and generous spacing are still worth revisiting.',
    category: 'Design reference',
  })),
  projects: chinese.projects.map((project) => ({
    ...project,
    ...(
      {
        'second-me': {
          description:
            'Train a personal AI that thinks like you, locally. Open source, with a research paper.',
          role: 'Personal AI',
          category: 'Open source',
        },
        valseit: {
          description:
            'Custom enterprise AI: an LLM gateway with multi-provider routing, cost attribution, and billing, plus bespoke applications built on top.',
          role: 'Custom enterprise AI',
          category: 'Enterprise',
        },
        avatar: {
          description:
            'An infinite canvas for thinking with AI. Turn scattered ideas into cards, structure, and next steps.',
          role: 'An AI canvas',
          category: 'Experiment',
        },
        upon: {
          description:
            'An enterprise integration that brings chat, cost tracking, and top-up billing into existing workflows.',
          role: 'Workflow integration',
          category: 'Delivered',
        },
        flash: {
          description:
            'A macOS app with public downloads, release notes, and automatic update information.',
          role: 'macOS app',
          category: 'Product',
        },
      } as Record<
        string,
        { description: string; role: string; category: string }
      >
    )[project.id],
  })),
};

export const getContent = (locale: Locale) =>
  locale === 'zh' ? chinese : english;
