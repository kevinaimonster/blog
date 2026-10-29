export const site = {
  name: 'Kevin',
  title: 'Kevin · 数字花园',
  description:
    'Kevin（鲍方毅）的数字花园。独立做 AI 产品，记录开源、企业 AI 定制与产品实验。',
  headline: ['把想法做成产品，', '把过程留在这里。'],
  intro:
    '嗨，我是 Kevin（鲍方毅），工程师，曾任 Mindverse CTO。现在独立做 AI 产品，也承接企业 AI 定制。喜欢做些 AI 小工具——有的活了，有的没活，这里记录它们的过程。',
  github: 'https://github.com/kevinaimonster',
  x: 'https://x.com/KevinAIMonster',
  avatar: '/images/kevin-avatar.jpg',
  // 所有个人介绍集中在这里。只填写愿意公开的信息。
  about: [
    '你好，我是 Kevin，也叫鲍方毅。工程师，曾任 Mindverse CTO，现在独立做 AI 产品。',
    '在 Mindverse CTO 任内，我参与了 Second Me：一个本地优先的个人 AI 项目，让人们训练像自己一样思考的模型，开源并发表论文。',
    '我也通过杭州硅言碳语科技有限公司承接企业 AI 定制。valseit 提供 LLM 网关与定制应用，UPon 则把对话、成本核算和充值计费接入企业已有的工作流。',
    '我喜欢做 AI 小工具：有的活了，有的没活。这个空间记录开源、产品和实验，也留下过程中的想法与复盘。',
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

// 个人经历与项目介绍取自 kevin.top；阶段用作项目背景，不代表实时运营状态。
export const projects = [
  {
    id: 'second-me',
    name: 'Second Me',
    description:
      '本地优先的个人 AI，训练一个像自己一样思考的模型。开源并发表论文。',
    url: 'https://github.com/mindverse/Second-Me',
    role: 'Mindverse CTO 任内',
    category: '开源',
    icon: 'brain',
    featured: true,
  },
  {
    id: 'valseit',
    name: 'valseit',
    description:
      '企业 AI 定制：多厂商模型路由、成本归因、计费账本，以及建立在网关之上的定制应用。',
    url: 'https://kevin.top/valseit/',
    role: '企业 AI 定制',
    category: '企业服务',
    icon: 'network',
    featured: true,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    description:
      'AI 共创无限画布。随手写画，让零散的想法变成卡片与结构，和 AI 一起整理、共创。',
    url: 'https://avatar-nu-ten.vercel.app',
    role: 'AI 共创画布',
    category: '产品实验',
    icon: 'canvas',
    featured: true,
  },
  {
    id: 'upon',
    name: 'UPon',
    description:
      '企业集成方案：将对话、成本核算与充值计费接入现有工作流，由硅言碳语交付。',
    url: 'https://kevin.top/#projects',
    role: '硅言碳语交付',
    category: '已交付',
    icon: 'layers',
    featured: true,
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'macOS 应用。公开发布页提供安装包、版本记录与自动更新信息。',
    url: 'https://github.com/kevinaimonster/flash-releases',
    role: 'macOS 应用',
    category: '产品',
    icon: 'zap',
    featured: false,
  },
];

// kevin.top 原站插画与图库示意混排；不将插画或图库图标为个人摄影。
export const photos = [
  {
    src: '/images/mountains.webp',
    alt: '晴空下的雪山，图库示意',
    credit: 'Ryan Schroeder',
    kind: '图库示意',
    source:
      'https://unsplash.com/photos/landscape-photography-mountain-range-with-snow-Gg7uKdHFb_c',
  },
  {
    src: '/images/workspace.webp',
    alt: '窗边的黑白工作空间，图库示意',
    credit: 'Jon Tyson',
    kind: '图库示意',
    source:
      'https://unsplash.com/photos/an-empty-office-desk-in-front-of-a-window-HsMVmGngmWM',
  },
  {
    src: '/images/kevin-beach.jpg',
    alt: 'kevin.top 的海滩背景插画',
    credit: 'kevin.top',
    kind: '原站插画',
    source: 'https://kevin.top/',
  },
  {
    src: '/images/ocean.webp',
    alt: '阳光下的海浪，图库示意',
    credit: 'Kellen Riggin',
    kind: '图库示意',
    source:
      'https://unsplash.com/photos/ocean-waves-crashing-under-a-warm-sky-Ty3FE6YCwpI',
  },
  {
    src: '/images/layers.webp',
    alt: '暮色中层叠的山峦，图库示意',
    credit: 'Willian Justen de Vasconcellos',
    kind: '图库示意',
    source:
      'https://unsplash.com/photos/landscape-photography-of-mountains-with-fog-_MMP5j_fCqw',
  },
];
