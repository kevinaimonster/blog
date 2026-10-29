# Kevin · Personal blog

Kevin 的个人博客：文章、短想法、收藏，以及独立的项目索引。默认英文、深色，支持中文和浅色模式。

首页以 Kevin 和当前能力为中心：AI 产品、macOS 工具、企业 AI 定制。深海蓝、青蓝与杏橙配色，以头像延展的狐狸工作台形象替代泛泛的介绍，X/GitHub 后直接接最近文章，桌面侧栏展示 valseit、Avatar 和 Flash。全站只使用 Kevin，不展示公司或任职经历。代码为原创实现。

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

| 内容                       | 文件                                               |
| -------------------------- | -------------------------------------------------- |
| 中文资料、近况、收藏、项目 | `site/src/data/site.ts`                            |
| 英文内容与语言辅助函数     | `site/src/data/i18n.ts`                            |
| 长篇文章                   | `site/src/content/notes/{en,zh}/*.md`              |
| 首页布局                   | `site/src/views/Home.astro`                        |
| 全站视觉与响应式样式       | `site/src/styles/journal.css`                      |
| 搜索和分类筛选             | `site/src/components/GardenFeed.tsx`               |
| 插画提示词与来源           | `docs/workflows/digital-garden/field-notes-art.md` |

个人介绍、Second Me / valseit / Avatar / UPon 资料取自用户指定的 [kevin.top](https://kevin.top/)，未迁入可能过时的星数或运营进度。Flash 保留已确认的公开发布仓库链接。建站近况与开篇文章仍为起始文案，不代表已迁移旧博客文章。

头像沿用 `kevin.top`，保存为 `site/public/images/kevin-avatar.jpg`。开篇文章末尾的插画由内置 imagegen 创作并保存为 `site/public/images/field-notes-cover.png`；这是想象场景，非个人摄影。上一版图片留在素材目录中，本版不再展示。首页形象图由内置 imagegen 基于头像创作，保存为 `site/public/images/kevin-workbench.png`，提示词见 `docs/workflows/digital-garden/kevin-workbench-art.md`。只有 X 与 GitHub 社交入口；RSS 是独立订阅功能。

新增文章时复制 Markdown frontmatter，日期使用 `YYYY-MM-DD`，指定 `locale: en` 或 `locale: zh`。同一篇文章在两个语言目录下使用相同文件名，以支持当前页面切换语言；发布前补全两个版本。`draft: true` 会从列表、详情路由、首页和 RSS 排除。文件名即文章路径，发布后改名会改变链接。阅读页目录从文章二级标题自动生成。

文章可在 frontmatter 中配置 `illustration: { src, alt, caption }`。只在该文章末尾显示插画，并用于文章的分享预览；首页使用狐狸工作台形象作为分享图。

## 默认外观与语言

首次访问默认深色、英文，不跟随系统。选择分别保存在浏览器的 `garden-theme` 与 `garden-language` 中；以前明确选择的浅色仍保留。英文位于 `/`，中文位于 `/zh/`，各有文章、RSS 与元数据。切换语言保留当前页面；再次从 `/` 进入时恢复保存的语言。直接打开某个语言的内容链接时尊重该链接。

主题、语言切换和手机菜单使用原生交互；搜索和筛选使用 React。无 JavaScript 时正文、文章链接和语言链接仍可访问。手机菜单为原生 dialog；键盘焦点、Escape、减弱动态效果均有处理。

## 发布

`npm run build` 输出 `dist/`，可部署到静态托管。`.openai/hosting.json` 绑定现有私人预览项目。`SITE_URL` 可覆盖 canonical 与 RSS 域名；切换 `kevin1988.fun` 前需设置正式域名并重新构建，同时安排旧文章 URL 的迁移与重定向。

实施及验证记录：`docs/workflows/digital-garden/workflow.md`。
