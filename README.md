# Kevin · Personal blog

Kevin 的个人博客：文章、短想法、收藏，以及独立的项目索引。默认英文、深色，支持中文和浅色模式。

首页以 Kevin 和当前能力为中心：AI 产品、macOS 工具、企业 AI 定制。从插画延续出的墨蓝绿、暖白与杏橙配色，以头像延展的狐狸工作台形象替代泛泛的介绍，X/GitHub 后直接接最近文章，桌面侧栏展示 valseit、Avatar 和 Flash。全站只使用 Kevin，不展示公司或任职经历。代码为原创实现。导航、按钮、筛选、搜索、内容卡片与目录采用统一玻璃表面；本地 Geist 可变字体统一标题、正文与标签层级。

正式站点为 https://kevin1988.fun/，源码仓库为 `kevinaimonster/blog`。网站源码在 `site/`；`master` 通过 GitHub Actions 构建并发布 `dist/` 到 GitHub Pages。仓库根目录的旧 Hexo 产物只作历史保留，不再作为部署目录。

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
| 基础排版与响应式样式       | `site/src/styles/journal.css`                      |
| 搜索和分类筛选             | `site/src/components/GardenFeed.tsx`               |
| 插画提示词与来源           | `docs/workflows/digital-garden/field-notes-art.md` |

个人介绍、Second Me / valseit / Avatar / UPon 资料取自用户指定的 [kevin.top](https://kevin.top/)，未迁入可能过时的星数或运营进度。Flash 保留已确认的公开发布仓库链接。建站近况与开篇文章为本次建站稿。旧站的两条记录已保留在原地址：`/First-Post/`（原空正文记录）和 `/2024/06/19/hello-world/`（Hexo 示例）；可从 `/archives/` 查看。

头像沿用 `kevin.top`，保存为 `site/public/images/kevin-avatar.jpg`。开篇文章末尾的插画由内置 imagegen 创作并保存为 `site/public/images/field-notes-cover.png`；这是想象场景，非个人摄影。上一版图片留在素材目录中，本版不再展示。首页形象图由内置 imagegen 基于头像创作，保存为 `site/public/images/kevin-workbench.png`，提示词见 `docs/workflows/digital-garden/kevin-workbench-art.md`。只有 X 与 GitHub 社交入口；RSS 是独立订阅功能。

新增文章时复制 Markdown frontmatter，日期使用 `YYYY-MM-DD`，指定 `locale: en` 或 `locale: zh`。同一篇文章在两个语言目录下使用相同文件名，即可建立中英文关联；仅发布一个语言也可以。语言元数据只指向实际存在的译文；没有译文时，切换按钮进入另一语言的文章列表。`draft: true` 会从列表、详情路由、首页和 RSS 排除。文件名默认决定文章路径；发布后不要直接改名。可用 `permalink: /your-stable-path/` 固定旧链接。`updated: YYYY-MM-DD` 只用于内容实际更新，不能把每次部署日期当作文章更新日期。`archived: true` 保留正文地址，但从首页、RSS、站点地图和搜索索引中排除；适用于旧模板记录，不应用于正常文章。阅读页目录从文章二级标题自动生成。

文章可在 frontmatter 中配置 `illustration: { src, alt, caption }`。只在该文章末尾显示插画，并用于文章的分享预览；首页使用狐狸工作台形象作为分享图。

## 默认外观与语言

首次访问默认深色、英文，不跟随系统。选择分别保存在浏览器的 `garden-theme` 与 `garden-language` 中；以前明确选择的浅色仍保留。英文位于 `/`，中文位于 `/zh/`，各有文章、RSS 与元数据。切换语言保留当前页面；再次从 `/` 进入时恢复保存的语言。直接打开某个语言的内容链接时尊重该链接。

`site/src/styles/glass.css` 管理玻璃材质、插画背景氛围、字体层级和对应响应式规则；`journal.css` 保留基础布局。无 backdrop-filter 支持或用户要求减少透明效果时使用更实的表面，并尊重减少动态效果偏好。

主题、语言切换和手机菜单使用原生交互；搜索和筛选使用 React。无 JavaScript 时正文、文章链接和语言链接仍可访问。手机菜单为原生 dialog；键盘焦点、Escape、减弱动态效果均有处理。

## 发布

工作流为 `.github/workflows/pages.yml`：PR 执行依赖安装、类型检查、构建和产物测试；合并到 `master` 后重新执行检查并发布 GitHub Pages。Pages 使用 GitHub Actions 构建模式，保留自定义域名。环境只允许 `master` 部署。HTTPS 由现有 Cloudflare 边缘证书提供，主域名的 HTTP 请求由下述规则永久跳转到 HTTPS。

正式构建：

```sh
SITE_URL=https://kevin1988.fun SITE_INDEXABLE=true npm run build
SITE_URL=https://kevin1988.fun SITE_INDEXABLE=true npm test
```

`SITE_URL` 默认正式域名，覆盖 canonical、结构化数据、分享图及订阅链接。只有 `SITE_INDEXABLE=true` 才启用索引和站点地图；本地和私密预览默认 `noindex`，robots 禁止抓取，站点地图为空。`.openai/hosting.json` 仍绑定原来的私人预览项目，与正式域名的部署分开。

SEO 随构建生成：独立标题/摘要、canonical、现有译文的互相 hreflang 与 x-default、Open Graph/Twitter、文章 BlogPosting、作者、发布日期与可选更新日期。`/sitemap.xml` 只列正式可索引页面；`/robots.txt` 声明站点地图；404 和旧空白/模板记录为 noindex。RSS 在 `/rss.xml`、`/zh/rss.xml`，旧订阅地址 `/atom.xml` 提供有效 Atom feed。页面正文为静态 HTML，爬虫不需要运行 JavaScript。

旧版回退点为 `pre-v1-20261029`。若需退回旧 Hexo，先暂停新工作流的自动部署，从该标签恢复旧产物到回退分支，再将 Pages source 指向该分支根目录并切换为 legacy；保留 `kevin1988.fun`、Cloudflare 代理与主域名 HTTPS 跳转规则。不要在新工作流仍运行时同时切换发布源。新版正常迭代可直接 revert 代码并由 Actions 重新发布。

验证通过意味着部署与技术 SEO 已检查，不等于搜索引擎已经重新抓取或收录。

实施及验证记录：`docs/workflows/digital-garden/workflow.md`。

## 正式域名入口

Cloudflare Single Redirect `Blog HTTPS canonical redirect` 只匹配 `(http.host eq "kevin1988.fun" and not ssl)`，以 301 转向 `concat("https://kevin1988.fun", http.request.uri.path)`，保留 query string。其他子域名不匹配此规则，DNS 与代理状态未改。

切换 GitHub Pages 构建模式时，GitHub 重置了 `https_enforced`；重新开启返回自定义域名证书不存在。当前 GitHub 的该开关为 false，访客侧的证书与强制 HTTPS 由 Cloudflare 提供，并已实测 HTTP → 301 → HTTPS 200。不能仅用 GitHub 的 `html_url` 字段判断公开 HTTPS 状态；正式链接、canonical 和订阅地址统一使用 `https://kevin1988.fun`。若以后迁出 Cloudflare，需先为新入口配置有效证书与 HTTPS 跳转。
