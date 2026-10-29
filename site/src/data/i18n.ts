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
    title: 'Kevin Bao · Field notes',
    description:
      'Kevin Bao’s personal journal. On AI, making things, and everything I’m still figuring out.',
    about: [
      'Hi, I’m Kevin Bao, an engineer and former CTO of Mindverse. I now build independent AI products.',
      'At Mindverse, I worked on Second Me: a local-first personal AI that lets you train a model to think like you. The project is open source and accompanied by a research paper.',
      'I also build custom AI for businesses through Hangzhou Guiyan Tanyu Technology Co., Ltd. valseit provides an LLM gateway and custom applications; UPon brings chat, cost tracking, and top-up billing into existing workflows.',
      'I like making small AI tools. Some make it, some don’t. This space brings together open-source work, products, experiments, and the thoughts behind them.',
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
          role: 'As CTO at Mindverse',
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
            'An enterprise integration that brings chat, cost tracking, and top-up billing into existing workflows. Delivered through Guiyan Tanyu.',
          role: 'By Guiyan Tanyu',
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
