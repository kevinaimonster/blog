export const site = {
  name: 'Kevin',
  title: 'Kevin · 数字花园',
  description:
    'Kevin 的数字花园。记录正在做的项目，整理值得留下的想法、笔记与收藏。',
  headline: ['把想法做成产品，', '把过程留在这里。'],
  intro:
    '你好，我是 Kevin。我在这里记录正在做的项目，整理技术与产品上的思考，也收藏值得反复回看的链接。这是一个持续更新的个人空间，短想法、笔记和未完成的事情，都可以先留下来。',
  github: 'https://github.com/kevinaimonster',
  // 所有个人介绍集中在这里。只填写愿意公开的信息。
  about: [
    '你好，我是 Kevin。这个网站是我在互联网上的一块自留地。',
    '这里会逐渐收录项目、笔记、短想法和收藏。完整的文章可以慢慢写，一条值得记下的线索也可以先留下。',
    '内容会持续更新；有些是完成的作品，有些仍然在生长。',
  ],
};

export const navigation = [
  { label: '花园', href: '/' },
  { label: '笔记', href: '/notes/' },
  { label: '收藏', href: '/bookmarks/' },
  { label: '项目', href: '/projects/' },
  { label: '关于', href: '/about/' },
];

export const thoughts = [
  {
    id: 'a-new-garden',
    date: '2026-10-29',
    text: '给这个网站重新找了一个方向：更克制的排版，更轻的表达。先留下一条想法，再慢慢长成一篇笔记。',
    tag: '建站记录',
  },
];

export const bookmarks = [
  {
    id: 'spotlight',
    title: 'Spotlight',
    url: 'https://spotlight.tailwindui.com/',
    domain: 'tailwindui.com',
    description:
      '这次改版的视觉参考。喜欢它的留白、清晰排版，以及作品与生活并置的方式。',
    category: '设计参考',
    date: '2026-10-29',
  },
];

export const projects = [
  {
    id: 'flash',
    name: 'Flash',
    eyebrow: 'MACOS APP',
    description: 'macOS 应用。公开发布页提供安装包、版本记录与自动更新信息。',
    url: 'https://github.com/kevinaimonster/flash-releases',
    linkLabel: '查看发布页',
    tags: ['macOS', '产品'],
    visual: 'flash',
  },
  {
    id: 'garden',
    name: '这个数字花园',
    eyebrow: 'PERSONAL SPACE',
    description: '把项目、笔记和零散的思考放在一起。慢慢记录，持续生长。',
    url: '/about/',
    linkLabel: '关于这个空间',
    tags: ['写作', '持续更新'],
    visual: 'garden',
  },
];

// 图库示意照片，并非个人摄影。替换照片与来源时一并更新此处。
export const photos = [
  {
    src: '/images/mountains.webp',
    alt: '晴空下的雪山，图库示意',
    credit: 'Ryan Schroeder',
    source:
      'https://unsplash.com/photos/landscape-photography-mountain-range-with-snow-Gg7uKdHFb_c',
  },
  {
    src: '/images/workspace.webp',
    alt: '窗边的黑白工作空间，图库示意',
    credit: 'Jon Tyson',
    source:
      'https://unsplash.com/photos/an-empty-office-desk-in-front-of-a-window-HsMVmGngmWM',
  },
  {
    src: '/images/architecture.webp',
    alt: '白色建筑的线条，图库示意',
    credit: 'Joel Filipe',
    source:
      'https://unsplash.com/photos/white-concrete-high-rise-building-under-cloudy-sky-HiOgJdpg0qo',
  },
  {
    src: '/images/ocean.webp',
    alt: '阳光下的海浪，图库示意',
    credit: 'Kellen Riggin',
    source:
      'https://unsplash.com/photos/ocean-waves-crashing-under-a-warm-sky-Ty3FE6YCwpI',
  },
  {
    src: '/images/layers.webp',
    alt: '暮色中层叠的山峦，图库示意',
    credit: 'Willian Justen de Vasconcellos',
    source:
      'https://unsplash.com/photos/landscape-photography-of-mountains-with-fog-_MMP5j_fCqw',
  },
];
