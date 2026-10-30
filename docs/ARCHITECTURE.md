# 工程结构与维护边界

## 内容到正式站的路径

```mermaid
flowchart LR
  CLI[本地交互 CLI] --> Source[Markdown / JSON / 图片]
  Source --> Check[内容校验 + Astro check]
  Check --> Build[Astro 静态构建]
  Build --> Test[HTML / 链接 / SEO 测试]
  Test --> Git[确认后 Git 提交与推送]
  Git --> CI[master 的 GitHub Actions]
  CI --> Pages[GitHub Pages dist 产物]
  Pages --> CF[Cloudflare HTTPS]
  CF --> Reader[kevin1988.fun 读者]
```

`scripts/blog.mjs` 提供交互和 Git 操作，`scripts/content.mjs` 提供草稿生成与内容校验。两者和 Astro content collection 共用 `content-schema.mjs`，避免 CLI 接受、网站却无法解析的字段。Node 使用仓库 `.nvmrc` 版本。

`site/src/content/notes` 是 Markdown 文章；`settings/{en,zh,shared}.json` 是结构化资料。英文和中文分别存储，文章按相同 slug 关联。`data/i18n.ts` 只在生成页面时读取内容；浏览器中的 React 筛选组件使用独立 `locales.ts`，不把整套内容 JSON 和草稿打包到客户端。

`data/notes.ts` 统一文章读取、URL 和语言关联；`views/` 负责页面，`layouts/Base.astro` 负责公共结构和元数据；`data/seo.ts`、订阅与 sitemap 路由负责 SEO 输出。页面主要是静态 HTML，React 只用于搜索筛选；不依赖服务端进程或数据库。

草稿仅在 **Astro DEV 且 SHOW_DRAFTS=true** 时显示，`server` 使用这个模式，同时强制 noindex。生产 build 永远排除草稿文章和草稿 JSON 条目；RSS 即使在开发预览中也只包含已发布文章。`public/` 下的文件会直接复制，因此草稿图片不具备私密性。

## 本次维护能力补齐

| 原有缺口                         | 现在的维护方式                                         |
| -------------------------------- | ------------------------------------------------------ |
| 只能手工复制文章，没有标准入口   | 交互菜单、草稿模板、new/server/generate/deploy 命令    |
| 本地看不到草稿                   | 独立草稿预览，提示条 + noindex，与生产生成隔离         |
| 英文近况/收藏被硬编码文案覆盖    | 分语言 JSON，每条内容独立编辑                          |
| 内容和布局代码混放               | 资料移到 settings；内容发布只收集 Markdown、设置和图片 |
| 无有效日期、重复路径和完整性检查 | 共享 schema + 构建前校验，错误文件定位                 |
| 插图尺寸固定为起始图             | 每篇文章可指定真实宽高，或省略两者                     |
| 测试写死起步文章的内容           | 按真实内容集合核对元数据/订阅，仍保留旧 URL 兼容测试   |
| 发布与回滚步骤未记录             | MAINTENANCE.md、PR 模板、明确 Git 与部署的区别         |

## 验证边界

`npm run validate` 执行类型诊断、内容校验、生产构建和 Node 测试。测试检查已有页面元数据、内部链接和资源、RSS/Atom、sitemap、双语与主题逻辑、草稿路由排除，以及 CLI 生成/校验/提交范围。隔离副本中的手动验证另外覆盖真实交互、草稿 HTTP 预览和发布状态转换。

本地检查不等于 GitHub 部署成功；GitHub 部署成功不等于搜索引擎收录。上线验收要关联提交与 Actions，访问真实域名，检查文章、资源、订阅和旧 URL。当前没有搜索引擎收录统计、运行时后台、数据库、登录、评论或定时任务。

部署及历史设计记录见 [workflow.md](workflows/digital-garden/workflow.md)，其历史阶段可能引用已删除的 `site.ts`；当前内容位置以本手册与 README 为准。
