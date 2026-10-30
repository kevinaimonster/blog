# Kevin 数字花园

## 当前状态

- 用户选择 Spotlight 的专业、成熟风格，并明确选择「没有，按这个风格做原创版本」。用户随后否定了第一版的视觉相似度，本次按原站实际布局纠正。
- 当前阶段：implement；状态：maintenance_cli_verification。v1.0.0 已正式发布并验证；本轮新增本地写作与维护能力，详见文末。
- 本次终点：用户已确认第一版并明确授权推送原仓库、覆盖正式博客；执行 SEO 与旧链接迁移后，将新版发布到 kevin1988.fun。本节与最后一节取代早先仅私密预览、不动 master 的限制。
- 基线：kevinaimonster/blog，master fd3f84618d7f888907f27c777cb7c61aa2191303；实现分支 codex/digital-garden。

## 业务基线与设计

| 规则 | 依据 | 设计与验收 |
| --- | --- | --- |
| B1 保持 Spotlight 的可识别视觉与布局 | 用户选择和第一版负反馈 | 居中胶囊导航、圆形头像、黑色大标题、五张倾斜照片、文章与右侧卡片双栏；按相同视口与原站对照 |
| B2 数字花园容纳短想法、笔记、收藏、时间线 | 用户选择 | 首页聚合更新流；可按类别筛选和搜索；独立内容页 |
| B3 便于后续修改 | 用户希望再魔改 | Astro 静态生成＋React 交互；site.ts 内容；Markdown 笔记；CSS 设计变量 |
| B4 不虚构经历或作品 | 已确认信息有限 | 使用 Kevin 名字、公开 GitHub 与 Flash 发布页；首篇建站稿由本次建站生成，待用户编辑 |
| B5 先提供私密预览 | 本轮执行范围 | 独立分支＋owner-private Sites；不改 Pages 发布分支、不绑定或变更域名 |

## 最小设计

- site/src/data/site.ts 提供个人资料、项目、短想法、收藏；site/src/content/notes 保存 Markdown。
- Astro 在构建时生成所有路由、RSS；React 只负责更新流筛选与搜索，原生轻量脚本处理主题。
- 无账号、数据库、表单收集或外部内容同步。无运行时服务依赖。
- 旧 Hexo 产物暂留仓库根目录，新的构建输出单独放 dist；后续正式切换使用静态产物发布，避免把框架源码直接当 Pages 页面。
- 代码独立编写，以公开演示站的结构与视觉作为参照，没有获取或使用付费模板源文件。
- 第一版错误：绿色便签、项目封面和小字号时间线替代了原站的关键结构。功能验证不能证明视觉符合要求，此前关于风格还原的交付表述不准确。
- 用户确认修正后的视觉，并指定 kevin.top 作为基础素材来源。本轮替换个人介绍、头像、海滩插画及 Second Me / valseit / Avatar / UPon 资料；保留 Flash。原站头像与海滩图为插画，其余四张为明确标注的图库示意。
- 社交入口只保留 X 与 GitHub；X 链接由用户明确提供 https://x.com/KevinAIMonster 。RSS 属于独立订阅卡片，不占社交入口。
- 用户指定默认深色和英文：首次渲染使用深色，显式保存的浅色继续生效。英文为根路径，中文在 /zh/；顶栏切换当前页面并记住选择，根入口恢复语言偏好，直接内容链接尊重 URL。
- 中英文共用 views 页面模板；个人资料、项目、近况、收藏、首篇笔记、搜索控件、无障碍标签和 RSS 均已翻译。笔记存于 content/notes/en 与 zh，同名文件对应两个语言版本。

## 就绪

conditional：用户已确认视觉方向并提供个人素材来源。kevin.top 的博客目录为空，起步文章仍仅含建站稿；发布到正式域名前需用户审阅文章内容。

## 验证与交付

- 本轮构建：Astro 静态输出 13 个 HTML 页面及中英文 RSS；构建成功。
- 本轮类型检查：23 个文件，0 errors / 0 warnings / 0 hints。
- 本轮 5 项产物测试全部通过：元数据与深色 HTML 默认值、内部链接/资源、中英文 RSS、各页翻译/对应语言链接、首次加载及已保存偏好（含存储禁用场景）。
- 本轮浏览器工具返回 The browser access host is unavailable，未执行新版页面的视觉与点击复验；英文移动端筛选/搜索已按更长文本调整为可换行。
- 上轮 Chrome 实测：笔记/收藏筛选、大小写不敏感关键词搜索、无结果状态、恢复全部 3 条内容、主题切换及跨页保留、笔记详情、RSS 复制、手机菜单与 Escape 关闭通过。
- 上轮视觉检查：桌面完整首页、深色阅读页、390px 手机首页；320px 首页与关于页 scrollWidth 等于视口宽度。
- 本地开发：使用 Node 22.23.4，dev 与 preview 均能前台启动。指定 --ignore-lock 避免 Astro 在代理环境自动后台化后根路径不一致；本轮服务会在交付时停止。
- 1512px 桌面对照：原站与修正版内容左边界 x=244px；主标题 y=216px、宽 672px、高 112px、48px 字号/56px 行高；照片单张 288×320px、间隔 32px、倾斜 ±2°；下方双栏宽 512/416px、间隔 96px。中文文案长度与照片内容不同。
- 本轮对照截图：/Users/kevinaimonster/empty/artifacts/spotlight-reference.png 和 spotlight-revision.png（本地证据，不进入部署产物）。
- 素材替换验证：构建、既有 3 项产物测试通过；桌面首页与项目页已目视核验，首页社交区精确包含用户指定的 X / GitHub URL。最新截图另存 kevin-materials.png。
- 私密预览项目：appgprj_6ae356b37bb08191b39044a2b3247240；预期 URL https://kevin-digital-garden.kevinmonster.chatgpt.site 。实际发布状态以 Sites 部署记录为准。
- 正式域名与旧 master 保持原有状态；旧文章迁移、真实内容审阅及正式域名切换属于后续上线工作。


## 设计深化：ai-design-skills

- 用户认为表现力仍弱，并要求安装及应用 https://github.com/elayadesign/ai-design-skills 。已通过 Codex skill-installer 安装 landing-page-design 到 ~/.codex/skills/landing-page-design；下一轮自动可用，本轮直接读取并应用。
- 同时阅读该 skill 指向的 redesign-existing-projects 审查规则。诊断：通用图库占据主视觉，真实作品呈现薄弱；字号、灰阶和信息层级过于接近；移动导航及运动状态需要完善。
- 保留用户明确认可的 Spotlight 布局和深色英文默认值。它是个人数字花园，不套用销售落地页的定价、FAQ、虚构证言或转化指标。
- 已实施：Geist 本地字体、Phosphor 图标、中性深色表面、标题渐变、单一青绿交互色、身份介绍与作品入口、Second Me/Avatar 概念图示、两列作品页、侧栏作品优先、阅读区标题层级、低强度滚动/悬停效果、全屏原生 dialog 菜单、手机可横向浏览的项目图带。
- 图示只表达 kevin.top 已有的产品概念，不声称是实际产品截图；不增加新的个人经历、客户或产品数据。
- 构建与 5 项产物测试通过；27 文件类型检查 0 errors / 0 warnings / 0 hints。
- 浏览器连接 host 不可用，改用 CUA 原生 Safari 独立窗口。实际检查桌面首页、作品页、内容区、浅色中文；搜索 Spotlight 后只显示收藏，清空后恢复 3 项；语言切换保留主题；全屏菜单能打开并由 Escape 关闭。
- 窄屏验证使用 Safari 页面缩放触发响应式断点，不等同于真实手机设备验收。发现 501–600px 英文标题孤词后调整字号；手机图带增加横向浏览，项目优先。

## 2026-10-29：Field notes 个人博客重做

本节替代前述 B1 与「保留 Spotlight 布局」的视觉约束。用户明确要求完全抛弃之前做法，从个人博客出发重做，并允许使用 imagegen。

- 重建首页、文章归档、阅读页、收藏、项目与关于页；删除原有胶囊导航、倾斜图片带、项目概念图、介绍型 hero 和旧样式文件。全站只保留一套 journal.css。
- 设计中心转为写作：Field notes 刊头、开篇文章封面、最近记录与作者页边注；项目成为独立文字索引。使用 Manrope、本地字体文件、炭灰/暖白/暖金，浅色对应暖纸色。
- 使用内置 image_gen 生成海边手记与纸页飞鸟插画。原图 1983 × 793，复制到 site/public/images/field-notes-cover.png。提示词及素材说明见 field-notes-art.md；关于页明确为 AI 插画。
- 个人资料与社交链接沿用已确认的 kevin.top、X 和 GitHub；内容仍只有起始文章、建站近况与 Spotlight 收藏，未声称迁移旧文章。
- 阅读页目录从 Markdown 二级标题生成。保留真实筛选、搜索、空结果恢复、RSS、主题与同页语言切换，默认深色英文。
- 桌面实际观察发现第一屏文章标题过低，已收紧刊头与封面高度；手机顶栏控制区提供 44px 点击目标，搜索输入字号避免小字号聚焦缩放。

验证：

- 最终 Astro check：21 文件，0 errors / 0 warnings / 0 hints。
- 最终构建：13 个 HTML 页面、中英文 RSS；5 项既有产物测试全部通过；git diff --check 通过。
- CUA 原生 Safari 实际观察：1512px 桌面首页、文章阅读页、项目页；用临时 iframe 检查 390px 英文、320px 中文与 640px 阅读布局。临时 QA 页在最终构建时移除，不进入部署。
- 实际交互：收藏筛选只显示 Spotlight；无匹配搜索显示空结果；Show everything 恢复 3 条；手机菜单打开后焦点落在关闭按钮，Escape 关闭；浅色切换后切中文保持浅色；恢复英文深色；文章目录点击后 URL hash 与滚动位置变化。
- 截图：/Users/kevinaimonster/empty/artifacts/kevin-field-notes-desktop.png、kevin-field-notes-responsive.png、kevin-field-notes-reading.png。均为本地构建验收，不声称真实手机设备测试或部署页面截图。
- 继续使用同一个 owner-private Sites 项目及 codex/digital-garden 分支。正式域名、GitHub Pages 设置、master 未改。发布结果以本轮 Sites 原生部署返回为准。


## 2026-10-29：身份、能力与当前项目优先

本节替代上节的大刊头与首页封面设计。用户要求首屏直接介绍自己，整体素色，插画用于文章；随后明确只使用 Kevin，不写公司、职务履历或过去经历，聚焦现在的能力和项目。

- 首页改为头像、Kevin、当前能力、写作主题和 X/GitHub；桌面右侧直接展示 valseit、Avatar、Flash，第一篇文章进入首屏。
- 介绍聚焦 AI 产品、macOS 工具、企业 AI 定制。中英文首页、关于页、项目介绍、作者、页头页脚与元数据统一只用 Kevin，移除公司与履历介绍。
- 深色英文仍为默认值；正文灰阶与交互色改为素色。窄屏优先显示个人介绍和文章。
- 原插画移至中英文开篇文章末尾；主页不再包含该图，文章分享图沿用插画。保留生成来源说明。
- Astro check：21 文件，0 errors / 0 warnings / 0 hints。构建输出 13 个 HTML 页面与中英文 RSS；5 项产物测试通过。
- 对全部 13 个页面的渲染文本检查：无全名、公司和 CTO 履历；插画仅出现在中英文开篇文章。
- CUA 原生 Safari 检查桌面首屏、390px 英文首页、320px 中文首页和 640px 文章插画；无可见横向溢出。这是本地浏览器布局检查，不等同于真实手机测试。
- 本地截图：/Users/kevinaimonster/empty/artifacts/kevin-identity-desktop.png、kevin-identity-responsive.png。临时 QA 页已从部署产物移除。
- 使用既有 owner-private Sites 项目及 codex/digital-garden 分支；发布状态以 Sites 返回为准。


## 2026-10-29：头像形象图与深海蓝配色

用户认为上一版过素，要求用头像延展的形象图替换信息量低的介绍段落，并换掉整体色调。本节替代上节的全站素色方向；只用 Kevin、只谈能力与项目的内容约束继续有效。

- 使用内置 image_gen，以既有狐狸头像为身份参考，生成工作台横幅；保留橙色狐狸、黑框眼镜与蓝色花衬衫。资产为 site/public/images/kevin-workbench.png（2172 × 724），完整提示词见 kevin-workbench-art.md。
- 首页删除两段泛泛介绍，改为 Kevin、三个能力关键词与形象图，保留 X/GitHub、关于入口和最近文章。桌面侧栏项目增加克制的表面色与首字母标记。
- 全站换成深海蓝底、柔和白字、青蓝与杏橙强调色；浅色模式为浅蓝白。主题 meta 和 favicon 同步，默认英文深色不变。
- 手机采用 2:1 裁切，使狐狸和电脑可辨认。旧海边纸页飞鸟插画仍只在开篇文章中。
- Astro check：21 文件，0 errors / warnings / hints。最终构建 13 个 HTML 页面与中英文 RSS；5 项已有测试通过；git diff --check 通过。
- CUA 原生 Safari 目视检查深色桌面、浅色桌面、390px 英文、320px 中文与 640px 阅读页。主题切换实测通过；窄屏无可见横向溢出。临时 iframe QA 页面已移除，不进入部署。
- 本地验收图：/Users/kevinaimonster/empty/artifacts/kevin-workbench-desktop.png、kevin-workbench-responsive.png。属于浏览器尺寸检查，不声称真实设备测试。
- 继续发布同一 owner-private Sites 项目并同步 codex/digital-garden 分支。正式域名、master 与 Pages 配置保持原状。


## 2026-10-29：液态玻璃、插画配色与字体统一

用户认可现有初版，要求组件采用液态玻璃；随后补充背景主色应与现有狐狸插画协调，并使用新安装的设计技能调整字体。本轮保留页面内容结构与现有插画，做全站材质和排版改进。

- 已重新阅读本地 landing-page-design，并按其 companion redesign-existing-projects 先诊断：背景偏冷、缺少与画面暖色的过渡，9–13px 小字过多、层次偏轻，组件表面缺少透光与深度。
- 用户明确要求与插画匹配的颜色和玻璃材质，因此覆盖技能的固定中性暗色/禁止背景渐变限制；不引入其销售落地页区块、虚构证言或转化内容。
- 主色为墨蓝绿 #142d35、暖白 #f5eee2 与杏橙 #f2b780。使用同一插画的低透明模糊背景来承接画面颜色，并在底部淡出；原图文件未修改。浅色为暖纸白与灰绿。
- 新增 glass.css 统一导航、社交按钮、项目/RSS、筛选/搜索、文章卡片、归档、收藏、项目页、目录、关于侧栏及手机菜单的半透明材质、边缘高光、内外阴影与交互状态。
- Manrope 替换为本地 Geist Variable 5.3.0。统一 12/14/16/18/20/24/30/36/48/60px 层级，正文 16–18px，小标签至少 12px；字重聚焦 400/500/600，保留中文系统字体回退。
- 增加 backdrop-filter 不可用与 prefers-reduced-transparency 的实色回退；保留 reduced-motion，菜单使用短距离渐入，按钮有按压和键盘焦点状态。降级媒体条件已实现，未声称在所有浏览器实机测试。
- 清理项目页剩余的过往参与措辞，改为当前 AI 产品、macOS 应用与企业工作流能力。
- 验证：21 文件 Astro check 无 errors/warnings/hints；最终构建 13 个 HTML 页面及中英文 RSS；5 项已有产物测试通过；git diff --check 通过。
- CUA 原生 Safari 检查：桌面深/浅模式、390px 英文与320px 中文首页、640px 项目页、390px 文章归档、320px 中文关于、640px 阅读页。无可见横向溢出；筛选仅显示收藏、主题切换、手机菜单焦点和 Escape 关闭通过。窄屏检查使用临时 iframe，不等同于真实手机测试，临时页已移除。
- 本地截图：/Users/kevinaimonster/empty/artifacts/kevin-glass-desktop.png、kevin-glass-light.png、kevin-glass-responsive.png、kevin-glass-reading.png。
- 同一 owner-private Sites 项目与 codex/digital-garden 分支交付；master、正式域名及 Pages 发布配置不变。


## 2026-10-29：第一版正式发布与文章 SEO

用户原话：“作为第一版先推上去吧……覆盖到 blog 上面去，注意一下它整体文章的 SEO 部分”；随后明确可以直接使用原 blog repo 推代码。授权终点为正式部署和线上验证，无需再次确认。

就绪：ready。已读取旧 master、Pages 设置、环境部署规则和 Actions 权限。正式域名由同一仓库 master 根目录 legacy 发布，HTTPS 开启；仓库无分支保护，github-pages 环境仅允许 master。旧内容仅两条记录：First Post 无正文，Hello World 为 Hexo 示例。没有需要用户补充的迁移映射。

| 规则 | 设计 | 验收 |
| --- | --- | --- |
| P1 将已确认的第一版覆盖正式博客 | 保留现有设计与素材；master 上 Actions 构建 dist 并部署 Pages，保留域名/HTTPS | 正式域名呈现新版，部署 SHA 对应合并提交 |
| P2 文章 SEO 不遗漏 | 页面标题/摘要、canonical、社交预览、BlogPosting、作者日期、中英文现有译文双向关联 | 检查静态 HTML 与线上响应；sitemap 仅列可索引页面 |
| P3 旧文章入口继续工作 | 原 URL 200、保留 Hello World 原锚点；旧归档 URL 仍可访问；atom.xml 继续订阅 | 原目录与 index.html 地址均验证；旧空白/模板条目 noindex，排除当前 feed |
| P4 正式发布可回退、预览不索引 | 旧 master 标签；生产显式 SITE_INDEXABLE=true，预览默认 noindex | 生产与预览两组产物测试；GitHub Actions 构建门禁 |

实现：共享 SEO 与路由辅助函数，Markdown 支持稳定 permalink、实际 updated 日期与 archived。文章元数据源自同一份 frontmatter。网站地图使用同一路由清单；草稿不生成详情与订阅项。历史页面保留日期和内容来源，不引入旧评论组件。

发布前验证：

- Node 22.23.4 下 Astro check：26 文件，0 errors / warnings / hints。
- 正式与私密预览两种环境分别构建，通过 9 项产物测试：元数据、全部本地链接/资源、订阅、双语与默认偏好、canonical/分享图/双向 hreflang、BlogPosting 与可见正文一致、索引清单、旧 URL/锚点/Atom。
- 18 个 HTML 页面，正式 sitemap 含 12 个可索引 URL，预览 sitemap 为空。修复了 Astro 404 页自动生成 /404/ canonical 的问题，明确为 /404.html 并设 noindex。
- 本地 Safari 实际打开 First Post，确认旧链接内容、无目录时的阅读栏布局正常；只检查本轮迁移影响，前述已确认视觉保持。
- 代码经 PR #1 合并，首次正式部署提交 973e029c616a0693428ed9a929538cbebb871301。PR CI 40937188849 和 master 发布 40937368229 均成功；原 master 已推送标签 pre-v1-20261029。
- HTTPS OAuth 凭据缺少 workflow scope，推送改用机器上已授权的 SSH；未增加权限。Pages 构建模式已切到 workflow。
- Pages 模式切换重置 https_enforced，GitHub API 恢复时返回自定义域名证书不存在。现有 Cloudflare HTTPS 证书一直可用；通过已经登录的 Chrome 控制台添加仅匹配主域名 HTTP 的 301 规则 Blog HTTPS canonical redirect，保留路径/query。其他域名、子域名、DNS、代理及 TLS 模式未改。最终验证文章带参数地址 HTTP 301 → HTTPS 200，无循环。
- 正式 HTTPS 验证 28 个 HTML/订阅/robots/不存在路径响应以及 7 个引用资源，全部通过；404 返回真实 404，旧 directory/index.html 地址均 200；RSS、Atom、sitemap 均通过 XML 解析；12 个 sitemap URL 均为正式域名。文章 BlogPosting、canonical、索引状态与语言关联已检查；线上图片哈希与原素材一致。
- Safari 实际打开正式首页，首屏、图片和玻璃材质正常；Bookmarks 筛选只留下 Spotlight，恢复 All 正常。截图：/Users/kevinaimonster/empty/artifacts/kevin-blog-v1-live.png；HTTP 检查明细：kevin-blog-v1-live-check.json（本地 artifacts）。
- 本轮未提交 Search Console，未声称已被搜索引擎收录；技术 SEO 与生产响应验证完成。


## 2026-10-29：本地 Markdown 与交互式维护 CLI

用户要求检查整个工程，补齐发文与标准维护方式；明确选择“本地写 Markdown，通过 Git 推送发布”，并要求“类似 Hexo 那样有交互的 CLI”。就绪：ready。无需引入登录后台或数据库，维持已确认的设计与生产部署链。

| 规则 | 实现 | 验收 |
| --- | --- | --- |
| M1 日常发文有标准入口 | npm run blog 交互菜单；new/server/generate/deploy 命令 | 隔离副本真实终端完成新建与状态流转 |
| M2 草稿可预览且不会误发 | 默认 draft，DEV + SHOW_DRAFTS 双重约束，预览 noindex | 本地草稿 HTTP 200；生产不产生路由、feed 或客户端内容 |
| M3 维护所有现有内容类型 | Markdown 文章、分语言 JSON 资料/近况/收藏/项目，稳定 ID | 新条目用自身文案、双语独立，无固定英文覆盖 |
| M4 Git 发布可审查和回滚 | 发布前校验、展示分支和文件、确认提交推送；保留旧 URL | dry-run 无 Git/远端写入，拒绝混入未完成代码 |
| M5 标准维护可交接 | README 快速入口、维护手册、架构审计、模板 | 文档命令与真实操作一致，明确 Git 推送和上线区别 |

审计发现：原英文近况与收藏采用硬编码映射，会覆盖新增内容；没有草稿预览；部分测试写死建站文章；文章插图宽高固定为起始图片。已改为独立内容 JSON、共享 schema 校验、开发专用预览、按内容集合验证元数据和可配置插图尺寸。生产设计与现有正文保持。

本地验证已完成；测试文章只存在于隔离临时副本，不提交到正式内容库。

- Node 22.23.4：Astro check 28 个文件，0 errors / warnings / hints；生产构建 18 页，14 项测试全部通过。
- 真实终端菜单创建英文草稿；空正文 publish 被阻止并恢复原文件。发现并修正 YAML 日期未加引号导致 Astro 读取成 Date 的兼容问题；新建和状态切换统一引用字符串日期。
- 隔离副本草稿文章 HTTP 200、正文与 JSON 草稿可见、预览提示和 noindex 正确；开发 RSS/Atom 排除草稿。生产刻意设置 SHOW_DRAFTS=true，仍无草稿路由，HTML/XML/JS/JSON 不含测试正文或 JSON 草稿标记。
- publish 后文章出现在详情、RSS/Atom/sitemap，单语言文章没有指向不存在译文的 alternate 元数据；14 项测试在新增文章后仍全部通过。
- deploy --dry-run 不改变 HEAD、暂存区和临时远端；真实交互 deploy 完成确认、提交、推送到本地 bare 测试仓库，工作区干净。正式工作区混有代码时，写作 deploy 按预期拒绝自动提交。
- archive 后文章 URL 和正文保留，设置 noindex，从首页、列表、订阅和 sitemap 移除。
- 本地验收证据：/Users/kevinaimonster/empty/artifacts/kevin-blog-cli-acceptance.json。没有发布测试文章；正式发布结果另行记录。
