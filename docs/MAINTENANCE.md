# Kevin Blog 维护手册

日常使用方式是：**本地交互式 CLI → 写 Markdown → 预览 → Git 推送 → GitHub Actions 自动上线**。不需要登录后台，也没有需要维护的数据库。网站保留现有外观、英文/深色默认值和中英文内容。

## 1. 第一次使用

```sh
git clone https://github.com/kevinaimonster/blog.git
cd blog
# 已安装 nvm 时使用；也可以自行安装 Node >= 22.23.4
nvm install
nvm use
npm ci
npm run blog
```

没有 nvm、或者当前 Node 太旧时，可直接使用指定版本启动菜单，不改变系统 Node：

```sh
npm exec --yes --package=node@22.23.4 -- npm run blog
```

这条命令启动的菜单及其预览、检查和发布子进程都会使用该 Node 版本。首次使用需要下载运行时。需要直接执行子命令时，在末尾加 `-- server`、`-- deploy` 等即可。

本机已有仓库位于 `/Users/kevinaimonster/workspace/blog`，不必重新 clone。写作前先确认没有未完成的改动，再 `git switch master`、`git pull --ff-only`。第一次推送需要这台机器已获得 GitHub 仓库写权限；CLI 使用现有 Git 登录，不保存 token。

菜单提供新建、内容清单、草稿预览、准备发布、归档、改回草稿、检查、提交发布和仓库状态。选择一个操作完成后回到终端，重新运行 `npm run blog` 即可继续。所有命令在仓库根目录执行。

## 2. 发一篇文章

1. 运行 `npm run blog`，选择「新建」→「文章」→语言，输入标题、英文标识、日期和摘要。默认语言为英文。标识如 `building-a-small-tool`，用于文件名和永久链接。
2. CLI 显示文件位置。用 VS Code、Obsidian、Typora 或其他编辑器打开对应 `.md`，在第二行 `---` 分隔线之后写正文。新文章自动设置 `draft: true`。
3. 运行 `npm run blog -- server`，打开终端显示的本地地址。这里可以看到草稿，页面顶部有「本地草稿预览」提示，带 `noindex`。完成后按 Ctrl+C 退出。
4. 运行 `npm run blog -- publish`，选择草稿并确认。这一步只把本地 `draft` 改为 `false`；缺少摘要或正文会报错并恢复草稿状态。
5. 运行 `npm run blog -- deploy`。它检查内容、类型、生产构建、链接和 SEO，展示文件、分支和待推送提交；输入提交说明并确认后，才会提交和推送。
6. 打开 [部署记录](https://github.com/kevinaimonster/blog/actions/workflows/pages.yml)，等本次提交的 **build 和 deploy 都成功**。再打开新文章的正式 URL，核对正文、图片与中英文切换。Git push 成功本身不表示部署完成。

如果当前分支是 `master`，推送会触发正式部署；其他分支只推送到同名分支，CLI 提供创建 PR 的链接，合并到 `master` 后上线。CLI 不会自动合并、强推或解决冲突。

> 草稿只表示“不进入发布站点”。这是公开 Git 仓库，推送过的 Markdown、Git 历史及 `public/` 中的图片仍可能被访问。私密笔记应保存在仓库外；草稿图片也会作为静态资源复制到构建产物。

## 3. 命令速查

| 命令                                | 作用                                             |
| ----------------------------------- | ------------------------------------------------ |
| `npm run blog`                      | 打开交互菜单                                     |
| `npm run blog -- new`               | 向导创建文章、近况、收藏或项目，默认草稿         |
| `npm run blog -- list`              | 显示内容、语言、草稿/归档状态和文件路径          |
| `npm run blog -- server`            | 本地预览，包括草稿；Ctrl+C 停止                  |
| `npm run blog -- publish`           | 本地取消草稿状态，准备发布                       |
| `npm run blog -- draft`             | 改回草稿，下次部署移除公开页面/列表              |
| `npm run blog -- archive`           | 退役文章：保留 URL，移出列表、订阅和索引         |
| `npm run blog -- generate`          | 生成正式静态文件到 `dist/`，排除草稿，不推送     |
| `npm run blog -- check`             | 完整检查：类型、内容、生产构建、产物与 SEO 测试  |
| `npm run blog -- deploy --dry-run`  | 检查本次内容发布，不提交、不推送、不 fetch       |
| `npm run blog -- deploy`            | 检查、确认、提交并推送当前分支                   |
| `npm run blog -- status`            | 本地分支/提交/改动和部署入口；不查询线上是否成功 |
| `npm run content:check`             | 只检查内容字段、重复 URL 和引用图片              |
| `npm run dev`                       | 常规开发预览，隐藏草稿                           |
| `npm run dev:drafts -- --port 4337` | 指定草稿预览端口                                 |

非交互新建文章也支持完整参数：

```sh
npm run blog -- new --kind note --locale en --slug my-note \
  --title "My note" --description "What this article is about"
```

`npm run post:new -- --slug my-note --locale en --title "My note"` 是同一草稿生成器的快捷入口。

## 4. 内容放在哪里

| 内容                        | 文件                                                     | 维护方法                                |
| --------------------------- | -------------------------------------------------------- | --------------------------------------- |
| 英文文章                    | `site/src/content/notes/en/*.md`                         | CLI 新建，编辑 Markdown                 |
| 中文文章                    | `site/src/content/notes/zh/*.md`                         | CLI 新建，编辑 Markdown                 |
| 英文介绍、近况、收藏、项目  | `site/src/content/settings/en.json`                      | CLI 新建条目，编辑 JSON 改已有内容      |
| 中文介绍、近况、收藏、项目  | `site/src/content/settings/zh.json`                      | 独立维护中文文案                        |
| Kevin 名字、头像、X、GitHub | `site/src/content/settings/shared.json`                  | 编辑共享字段                            |
| 图片                        | `site/public/images/`                                    | 放入文件，用 `/images/文件名.webp` 引用 |
| 首页布局                    | `site/src/views/Home.astro`                              | 属于代码修改，走分支和 PR               |
| 全站排版、玻璃材质          | `site/src/styles/journal.css`、`glass.css`               | 属于代码修改，走分支和 PR               |
| SEO 与路由                  | `site/src/data/seo.ts`、`notes.ts`、`layouts/Base.astro` | 正常发文无需修改                        |

近况用于短想法；收藏用于外部链接；项目用于作品和能力介绍。通过 `new` 选择对应类型即可填写表单。它们存于 JSON 的 `thoughts`、`bookmarks`、`projects` 数组，新条目也是草稿；用 `publish` 选择该条目发布。修改已有条目时按稳定的 `id` 查找，每个数组内的 `id` 不能重复。删除条目会在下次部署后从列表消失。

项目的 `featured: true` 表示展示在首页侧栏，按 JSON 数组顺序排列。收藏的显示域名从 `url` 自动提取，不用维护第二份域名。近况有独立 `title` 和 `text`，每条英文内容都使用自己填写的文案。近况和收藏目前不进入 RSS；需要文章详情页与订阅通知的内容，应写成 Markdown 文章。

两种语言分别维护，不会自动翻译。文章使用相同文件名建立对应关系，如 `en/my-note.md` 和 `zh/my-note.md`；只写一种语言也可以。只有已发布的实际译文才进入生产 `hreflang`，没有译文时切换到另一语言的文章列表。JSON 条目不要求两种语言数量一致。

## 5. Markdown 与 SEO 约定

```yaml
---
locale: en
title: Building a small tool
description: A concrete summary of the problem, solution, and result.
date: '2026-10-29'
tags:
  - Building
draft: true
---
```

下面直接写正文，用 `##` 开始章节标题，阅读目录自动生成。文件模板见 [post.md](templates/post.md)。摘要应准确描述文章，标题和摘要不能为空；发布日期必须是真实的 `YYYY-MM-DD`。**日期不是定时发布开关**：即使填写未来日期，`draft: false` 也会在下一次部署公开。

可选字段：

```yaml
updated: '2026-10-30'
permalink: /notes/building-a-small-tool/
illustration:
  src: /images/building-a-small-tool.webp
  alt: A diagram of the tool workflow
  caption: The workflow used in this project.
  width: 1600
  height: 900
```

- 发布后保持文件名和 URL 稳定。调整标题不改变链接；确需更名文件时先用 `permalink` 保留原链接。中文自定义链接必须以 `/zh/` 开头，英文不能使用该前缀。重名或占用系统路由会阻止构建。
- `updated` 只用于实质修改内容，不能早于发布日期，不要随着每次部署自动刷新。
- `illustration` 用于文章末尾插图与社交分享图。`src` 指向本地图片，`alt` 描述画面，`caption` 注明说明/来源；宽高可同时省略或按真实尺寸同时填写。正文图片用 `![说明](/images/example.webp)`。
- 图片推荐压缩为适合网页的 WebP/JPEG/PNG，使用英文文件名。构建验证图片引用是否存在，不会自动压缩原图。不要删除其他文章仍引用的图片。
- `archived: true` 保留正文 URL，并设置 `noindex`、移出首页/RSS/sitemap；适用于退役内容和旧模板，正常旧文章不必设这个字段。
- `draft: true` 从生产页面、列表、订阅和 sitemap 中排除；生产构建即使误设置 `SHOW_DRAFTS=true` 也不会生成草稿页面。

标题、摘要、canonical、Open Graph/Twitter、BlogPosting、日期与译文关联由同一份内容自动生成。正式 `/sitemap.xml`、`/robots.txt`、英文 `/rss.xml`、中文 `/zh/rss.xml`、旧 `/atom.xml` 自动更新。检查通过代表技术 SEO 合格，不代表搜索引擎已经收录。

## 6. 修改已有内容、撤回与回滚

**修改文章：**直接编辑原 Markdown，保留路径，实质更新时填写 `updated`，预览后 `deploy`。不需要重新 `publish` 已经为 `draft: false` 的文章。修改近况/收藏/项目或个人介绍，编辑对应 JSON，检查后同样发布。

**撤下文章：**推荐 `archive`，保留读者和搜索引擎已有的 URL。确实需要移除公开正文再用 `draft`，下一次部署后旧 URL 会变成 404。以上都只是本地修改，执行发布后才影响线上；已经公开的 Git 历史不会被这些操作擦除。

**发布失败：**先看 [Actions](https://github.com/kevinaimonster/blog/actions/workflows/pages.yml) 本次提交的失败步骤。构建失败时，上一版正式站仍在。修正后重新推送；只有确认是服务临时问题才重跑同一任务。

**内容回滚：**在干净工作区切到最新 `master`，确认错误的提交 SHA，使用 `git revert <错误提交SHA>` 产生反向提交，运行 `npm run validate`，再 `git push origin master`。等待新部署成功并核对实际页面。多提交或合并提交应先检查 diff，在分支上回滚并走 PR，不用 `reset --hard` 或强推改写生产历史。

## 7. 代码、依赖与发布配置

写作 CLI 的自动提交范围仅包含文章 Markdown、三份设置 JSON 和 `site/public/images/` 图片。发现代码、工作流、README 等未提交改动时，`deploy` 会停止；这是为了让日常发文的提交范围明确。CLI 会展示当前分支已有、尚未推送的提交，确认前也要检查这些提交。

改组件或脚本时使用常规 Git 流程：新建分支 → 修改 → `npm run validate` → 审查 `git diff` → 指定文件提交 → 推送分支 → PR → 检查通过后合并。不要为了发文章把一批未完成的代码一同提交。依赖更新也走这条流程，同时提交 `package.json` 和 `package-lock.json`；不建议自动执行会跨版本改依赖的修复命令。

`npm run validate` 使用正式域名和可索引模式执行检查，不会推送。一般开发 `npm run dev` 默认不允许索引。CI 对 PR 和 `master` 都执行检查，只允许 `master` 部署。工作流文件在 `.github/workflows/pages.yml`；输出目录为 `dist/`。仓库根目录旧 Hexo HTML 是历史产物，不是当前网站源码，也不需要手动生成到根目录。

目前公开入口由 GitHub Pages + Cloudflare 提供。Cloudflare 为 `kevin1988.fun` 的 HTTP 请求做保留路径和查询参数的 HTTPS 301 跳转；日常发文不需要改 DNS、Pages 来源或 Cloudflare。旧链接 `/First-Post/`、`/2024/06/19/hello-world/` 和 `/archives/` 的兼容性由测试覆盖。

## 8. 常见问题与固定检查

| 现象                      | 处理                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Astro 提示 Node 不受支持  | 使用 `.nvmrc` 指定的 Node 22.23.4 或满足 engines 的版本，再 `npm ci`                   |
| 草稿在普通预览看不到      | 使用 `npm run blog -- server`；`npm run dev` 故意隐藏草稿                              |
| `publish` 失败            | 根据文件路径修复摘要、正文、日期、重复链接或图片；状态会恢复，不会推送                 |
| `deploy` 提示存在其他改动 | 先处理代码/文档改动，使用正常 Git 分支流程；不要直接全量 add                           |
| 远端 master 有新提交      | 保存本地工作后拉取并解决分歧，再重新检查发布；CLI 不会强推                             |
| 推送认证失败              | 修复 GitHub 的 Git 登录或 SSH 配置，再运行发布；已经创建的本地提交仍在，无需重复写文章 |
| push 成功但站点没变       | 核对 Actions 对应提交的 deploy 状态，再刷新文章 URL；不要只看首页缓存                  |
| 文章跳转或 404            | 检查 `draft`、语言目录、文件名与 `permalink`，确认部署的是含该文章的提交               |
| 切换语言回到文章列表      | 另一个语言没有同名、已发布的文章，属于预期行为                                         |

每次发布后：核对本次部署 SHA、实际文章 URL、正文图片、canonical、订阅和 sitemap；有译文时点一次语言切换。每月：检查项目/收藏外链、依赖安全提示和域名到期状态。源码和历史保存在 GitHub；另外保留本地工作副本，尚未推送的草稿仅存在本机。

当前没有评论、账号后台、定时发文或自动翻译。它是一个由 Kevin 维护的静态个人博客，不是开放注册论坛。工程结构见 [ARCHITECTURE.md](ARCHITECTURE.md)。
