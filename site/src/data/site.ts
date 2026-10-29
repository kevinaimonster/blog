export const site = {
  name: 'Kevin',
  title: 'Kevin · 个人手记',
  description:
    'Kevin 的个人博客。AI 产品、macOS 工具、企业 AI 定制，以及开发过程中的笔记。',
  github: 'https://github.com/kevinaimonster',
  x: 'https://x.com/KevinAIMonster',
  avatar: '/images/kevin-avatar.jpg',
  // 所有个人介绍集中在这里。只填写愿意公开的信息。
  about: [
    '我是 Kevin，独立开发 AI 产品和 macOS 工具，也做企业 AI 定制。',
    '我关注 AI 应用从想法到落地的过程：产品交互、模型接入、应用开发，以及与已有工作流的集成。',
    'Avatar 是与 AI 一起整理想法的无限画布，Flash 是 macOS 应用。valseit 提供模型网关、路由、成本归因与定制应用；UPon 把对话和计费接入企业工作流。',
    '这里记录项目中的技术选择、产品实验和复盘，也留下还没想明白的想法。',
  ],
};

export const navigation = [
  { label: '首页', href: '/' },
  { label: '文章', href: '/notes/' },
  { label: '收藏', href: '/bookmarks/' },
  { label: '项目', href: '/projects/' },
  { label: '关于', href: '/about/' },
];

export const thoughts = [
  {
    id: 'a-new-garden',
    date: '2026-10-29',
    text: '把这个网站当作个人博客重新开始。先留下一条想法，再慢慢长成一篇笔记。不用等到想明白，才开始记录。',
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
      '曾经参考过的个人网站设计。清晰的排版和适度的留白，依然值得回看。',
    category: '设计参考',
    date: '2026-10-29',
  },
];

// 项目能力取自已确认的资料；不展示公司或任职履历。
export const projects = [
  {
    id: 'second-me',
    name: 'Second Me',
    description:
      '本地优先的个人 AI，训练一个像自己一样思考的模型。开源并发表论文。',
    url: 'https://github.com/mindverse/Second-Me',
    role: '个人 AI',
    category: '开源',
  },
  {
    id: 'valseit',
    name: 'valseit',
    description:
      '企业 AI 定制：多厂商模型路由、成本归因、计费账本，以及建立在网关之上的定制应用。',
    url: 'https://kevin.top/valseit/',
    role: '企业 AI 定制',
    category: '企业服务',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    description:
      'AI 共创无限画布。随手写画，让零散的想法变成卡片与结构，和 AI 一起整理、共创。',
    url: 'https://avatar-nu-ten.vercel.app',
    role: 'AI 共创画布',
    category: '产品实验',
  },
  {
    id: 'upon',
    name: 'UPon',
    description: '企业集成方案：将对话、成本核算与充值计费接入现有工作流。',
    url: 'https://kevin.top/#projects',
    role: '工作流集成',
    category: '已交付',
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'macOS 应用。公开发布页提供安装包、版本记录与自动更新信息。',
    url: 'https://github.com/kevinaimonster/flash-releases',
    role: 'macOS 应用',
    category: '产品',
  },
];
