# Kevin · 数字花园

个人网站：近况、Markdown 笔记、收藏、项目。以 Spotlight 的公开演示为视觉参照，独立编写页面代码，没有使用 Tailwind Plus 的模板源码或素材。

当前版按实际页面对照实现：居中胶囊导航、64px 圆形头像、48px/56px 大标题、宽幅倾斜照片带、左侧文章流与右侧信息卡片、黑白灰配色与少量青绿色。第一版偏离参照的绿色便签和大项目封面已移除。

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

| 内容                                   | 文件                                  |
| -------------------------------------- | ------------------------------------- |
| 中文名字、介绍、导航、近况、收藏、项目 | `site/src/data/site.ts`               |
| 英文内容与语言辅助函数                 | `site/src/data/i18n.ts`               |
| 长篇笔记                               | `site/src/content/notes/{en,zh}/*.md` |
| 首页布局                               | `site/src/views/Home.astro`           |
| 色彩、字体、间距和响应式样式           | `site/src/styles/global.css`          |
| 搜索和分类筛选                         | `site/src/components/GardenFeed.tsx`  |

个人介绍、Second Me / valseit / Avatar / UPon 项目资料取自用户指定的 [kevin.top](https://kevin.top/)，文字作了压缩，未迁入可能过时的星数或上架进度。Flash 保留已确认的公开发布仓库链接。建站近况与建站笔记仍为起始文案。

头像与海滩背景插画沿用用户指定的 kevin.top，分别保存在 `kevin-avatar.jpg` 与 `kevin-beach.jpg`。其余四张图片是可替换的图库示意，并非个人摄影或旅行经历；配置、作者与来源见 `photos` 数组，文件在 `site/public/images/`。使用 [Unsplash License](https://unsplash.com/license) 下的图库素材，未使用 Spotlight 演示站的照片。

首页及关于页的社交入口只保留 X 与 GitHub。X 地址由用户明确提供：`https://x.com/KevinAIMonster`；GitHub 地址为 `https://github.com/kevinaimonster`。RSS 保留为独立订阅功能。

新增笔记时复制现有 Markdown 的 frontmatter，日期使用 `YYYY-MM-DD`，并指定 `locale: en` 或 `locale: zh`。同一篇笔记在两个语言目录下使用相同文件名，以支持当前页面切换语言；发布前一并补全两个版本。`draft: true` 会同时从列表、详情路由、首页和 RSS 排除。文件名即文章路径，发布后改名会改变链接。

## 默认外观与语言

首次访问默认深色、英文，不跟随系统语言或系统主题。顶栏支持浅色/深色和中文/英文切换；选择分别保存在当前浏览器的 `garden-theme` 与 `garden-language` 中。以前明确选择的浅色仍保留。

英文页面位于 `/`，中文页面位于 `/zh/`；各自有独立的笔记、RSS 与元数据。语言切换保留当前页面；再次从 `/` 进入时恢复保存的语言。直接打开某个语言的内容链接时尊重该链接。浏览器禁用本地存储或 JavaScript 时，默认页面仍是深色英文，中文链接仍可使用。

## 发布

`npm run build` 输出到 `dist/`，可独立部署到静态托管。当前 `.openai/hosting.json` 绑定私人预览 Sites 项目。`SITE_URL` 可覆盖 canonical 与 RSS 的域名；切换 `kevin1988.fun` 前需设置为正式域名并重新构建，同时制定旧文章 URL 的迁移/重定向。

详细实施及验证记录：`docs/workflows/digital-garden/workflow.md`。
