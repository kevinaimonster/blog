# Kevin · 数字花园

原创个人网站：近况、Markdown 笔记、收藏、项目。视觉参考 Spotlight 的留白和阅读节奏，没有使用 Tailwind Plus 的模板源码或素材。

旧 Hexo 生成文件保留在根目录；新网站在 `site/`。GitHub Pages 仍从 `master` 根目录发布，开发分支不会替换线上站点。

## 本地开发

需要 Node >= 22.23.4。

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
```

## 修改内容

| 内容                               | 文件                                 |
| ---------------------------------- | ------------------------------------ |
| 名字、介绍、导航、近况、收藏、项目 | `site/src/data/site.ts`              |
| 长篇笔记                           | `site/src/content/notes/*.md`        |
| 首页布局                           | `site/src/pages/index.astro`         |
| 色彩、字体、间距和响应式样式       | `site/src/styles/global.css`         |
| 搜索和分类筛选                     | `site/src/components/GardenFeed.tsx` |

首版的建站近况、建站笔记和介绍是待确认的起始文案。Flash 使用已确认的公开发布仓库链接；没有填入未经确认的履历或数据。

新增笔记时复制现有 Markdown 的 frontmatter，日期使用 `YYYY-MM-DD`。`draft: true` 会同时从列表、详情路由、首页和 RSS 排除。文件名即文章路径，发布后改名会改变链接。

## 发布

`npm run build` 输出到 `dist/`，可独立部署到静态托管。当前 `.openai/hosting.json` 绑定私人预览 Sites 项目。`SITE_URL` 可覆盖 canonical 与 RSS 的域名；切换 `kevin1988.fun` 前需设置为正式域名并重新构建，同时制定旧文章 URL 的迁移/重定向。

详细实施及验证记录：`docs/workflows/digital-garden/workflow.md`。
