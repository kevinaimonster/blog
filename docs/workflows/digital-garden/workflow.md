# Kevin 数字花园

## 当前状态

- 用户选择 Spotlight 的专业、成熟风格，并明确选择「没有，按这个风格做原创版本」。
- 阶段：deliver；状态：implementation_verified。
- 本次终点：原创网站实现、验证、私密预览。正式域名继续使用既有 master 发布结果。
- 基线：kevinaimonster/blog，master fd3f84618d7f888907f27c777cb7c61aa2191303；实现分支 codex/digital-garden。

## 业务基线与设计

| 规则 | 依据 | 设计与验收 |
| --- | --- | --- |
| B1 保持专业、成熟、简洁的视觉 | 用户选择 | 原创排版，响应式，明暗主题，减少动效 |
| B2 数字花园容纳短想法、笔记、收藏、时间线 | 用户选择 | 首页聚合更新流；可按类别筛选和搜索；独立内容页 |
| B3 便于后续修改 | 用户希望再魔改 | Astro 静态生成＋React 交互；site.ts 内容；Markdown 笔记；CSS 设计变量 |
| B4 不虚构经历或作品 | 已确认信息有限 | 使用 Kevin 名字、公开 GitHub 与 Flash 发布页；首篇建站稿由本次建站生成，待用户编辑 |
| B5 先提供私密预览 | 本轮执行范围 | 独立分支＋owner-private Sites；不改 Pages 发布分支、不绑定或变更域名 |

## 最小设计

- site/src/data/site.ts 提供个人资料、项目、短想法、收藏；site/src/content/notes 保存 Markdown。
- Astro 在构建时生成所有路由、RSS；React 只负责更新流筛选与搜索，原生轻量脚本处理主题。
- 无账号、数据库、表单收集或外部内容同步。无运行时服务依赖。
- 旧 Hexo 产物暂留仓库根目录，新的构建输出单独放 dist；后续正式切换使用静态产物发布，避免把框架源码直接当 Pages 页面。
- 设计为本次原创，没有获取、复制或使用付费模板源文件。

## 就绪

conditional：用户已确认原创实现。真实文章尚未提供，起步内容仅含建站稿与本次选定的设计收藏；发布到正式域名前需用户审阅内容。

## 验证与交付

- 构建：Astro 静态输出 7 个 HTML 页面及 RSS；构建成功。
- 类型检查：15 个文件，0 errors / 0 warnings / 0 hints。
- 构建产物测试：页面基础元数据、内部链接与资源存在性、RSS 域名与文章链接全部通过。
- Chrome 实测：笔记/收藏筛选、大小写不敏感关键词搜索、无结果状态、恢复全部 3 条内容、主题切换及跨页保留、笔记详情与关于/项目页导航均通过。
- 视觉检查：桌面完整首页、深色阅读页、390px 手机首页；320px 首页与关于页 scrollWidth 等于视口宽度。
- 本地开发：使用 Node 22.23.4，dev 与 preview 均能前台启动。指定 --ignore-lock 避免 Astro 在代理环境自动后台化后根路径不一致；本轮服务会在交付时停止。
- 截图：/Users/kevinaimonster/empty/artifacts/kevin-garden-preview.png（本地验证证据，不进入部署产物）。
- 私密预览项目：appgprj_6ae356b37bb08191b39044a2b3247240；预期 URL https://kevin-digital-garden.kevinmonster.chatgpt.site 。实际发布状态以 Sites 部署记录为准。
- 正式域名与旧 master 保持原有状态；旧文章迁移、真实内容审阅及正式域名切换属于后续上线工作。
