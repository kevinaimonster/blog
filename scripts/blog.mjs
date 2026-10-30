#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { spawnSync, spawn } from 'node:child_process';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import {
  createPost,
  readNotes,
  projectRoot,
  validateContent,
  serializeFrontmatter,
} from './content.mjs';
import { settingsSchema } from '../site/src/data/content-schema.mjs';

const origin = 'https://kevin1988.fun';
const repoUrl = 'https://github.com/kevinaimonster/blog';
const help = `Kevin Blog · 本地写作与维护

npm run blog                     交互菜单
npm run blog -- new               向导创建文章、近况、收藏或项目（默认草稿）
npm run blog -- list              查看内容状态、语言和文件位置
npm run blog -- publish           将草稿标记为待发布；不会推送 Git
npm run blog -- draft             将内容改回草稿；下次部署才撤下
npm run blog -- archive           归档文章，保留 URL，移出列表/订阅/索引
npm run blog -- server            本地预览，包含草稿；Ctrl+C 停止
npm run blog -- generate          生成正式静态站点，排除草稿
npm run blog -- check             类型检查、生产构建、内容与 SEO 测试
npm run blog -- deploy            检查、展示改动，确认后提交并推送当前分支
npm run blog -- deploy --dry-run  检查发布范围，不提交或推送
npm run blog -- status            查看分支、改动、正式站和部署入口

文章非交互创建：
npm run blog -- new --kind note --slug my-note --locale en --title "My note" --description "A short summary"

维护手册：docs/MAINTENANCE.md
master 推送后自动部署；其他分支推送后需合并 PR。`;

let terminal;
function interactive() {
  if (!process.stdin.isTTY)
    throw new Error(
      '此操作需要交互终端。新建文章可使用完整参数；帮助：npm run blog -- --help',
    );
  terminal ??= createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return terminal;
}
async function ask(label, fallback = '') {
  return (
    (
      await interactive().question(
        `${label}${fallback ? ` [${fallback}]` : ''}: `,
      )
    ).trim() || fallback
  );
}
async function required(label, fallback = '') {
  let answer;
  do {
    answer = await ask(label, fallback);
    if (!answer) console.log('这一项不能为空。');
  } while (!answer);
  return answer;
}
async function choose(label, options) {
  console.log(`\n${label}`);
  options.forEach((option, index) =>
    console.log(`  ${index + 1}. ${option.label}`),
  );
  for (;;) {
    const value = Number(await ask('选择', '1'));
    if (Number.isInteger(value) && value >= 1 && value <= options.length)
      return options[value - 1].value;
    console.log('请输入菜单中的序号。');
  }
}
async function confirm(label) {
  return /^y(es)?$/i.test(await ask(`${label}（输入 y 确认，其余取消）`, 'n'));
}
function closePrompt() {
  terminal?.close();
  terminal = undefined;
}
function run(
  command,
  args,
  {
    capture = false,
    raw = false,
    env = process.env,
    allowFailure = false,
  } = {},
) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure)
    throw new Error(
      `${command} ${args[0] || ''} 失败。${capture ? result.stderr.trim() : '请查看上方错误；不会继续发布。'}`,
    );
  return capture ? (raw ? result.stdout : result.stdout.trim()) : result.status;
}
const git = (...args) => run('git', args, { capture: true });
const npm = (script, production = false) =>
  run(process.execPath, [process.env.npm_execpath, 'run', script], {
    env: production
      ? {
          ...process.env,
          SITE_URL: origin,
          SITE_INDEXABLE: 'true',
          SHOW_DRAFTS: 'false',
        }
      : process.env,
  });
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
async function saveJson(file, data) {
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(data, null, 2) + '\n', {
    flag: 'wx',
  });
  await rename(temporary, file);
}

async function newEntry(values) {
  const kind =
    values.kind ||
    (await choose('新建什么？', [
      { label: '文章 · Markdown', value: 'note' },
      { label: '近况 · 短想法', value: 'thought' },
      { label: '收藏 · 外部链接', value: 'bookmark' },
      { label: '项目', value: 'project' },
    ]));
  if (!['note', 'thought', 'bookmark', 'project'].includes(kind))
    throw new Error('kind 必须为 note / thought / bookmark / project');
  const locale =
    values.locale ||
    (await choose('内容语言', [
      { label: 'English', value: 'en' },
      { label: '中文', value: 'zh' },
    ]));
  if (!['en', 'zh'].includes(locale)) throw new Error('locale 必须为 en 或 zh');
  const title = values.title || (await required('标题 / 项目名'));
  const slug =
    values.slug ||
    (await required('稳定标识（英文小写，用 - 分隔，例如 my-first-note）'));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error('标识只能包含英文小写、数字和分隔用的 -');
  const date =
    values.date ||
    (process.stdin.isTTY
      ? await ask('日期 YYYY-MM-DD', localDate())
      : localDate());
  if (kind === 'note') {
    const description =
      values.description ??
      (process.stdin.isTTY
        ? await ask('文章摘要（可先留空，发布前补齐）')
        : '');
    const file = await createPost({ slug, locale, title, description, date });
    console.log(
      `\n已创建草稿：${relative(projectRoot, file)}\n用你习惯的编辑器写正文，再运行 npm run blog -- server。\n完成后：npm run blog -- publish → npm run blog -- deploy`,
    );
    return;
  }
  let entry;
  if (kind === 'thought')
    entry = {
      id: slug,
      title,
      date,
      text: await required('短想法正文'),
      tag: await required('标签'),
      draft: true,
    };
  if (kind === 'bookmark')
    entry = {
      id: slug,
      title,
      date,
      url: await required('链接 URL'),
      description: await required('收藏理由'),
      category: await required('分类'),
      draft: true,
    };
  if (kind === 'project')
    entry = {
      id: slug,
      name: title,
      url: await required('项目 URL'),
      description: await required('项目介绍'),
      role: await required('能力 / 方向'),
      category: await required('分类'),
      featured: await confirm('展示到首页项目栏？'),
      draft: true,
    };
  const file = resolve(projectRoot, `site/src/content/settings/${locale}.json`);
  const content = JSON.parse(await readFile(file, 'utf8'));
  const collection = {
    thought: 'thoughts',
    bookmark: 'bookmarks',
    project: 'projects',
  }[kind];
  content[collection].push(entry);
  settingsSchema.parse(content);
  await saveJson(file, content);
  console.log(
    `\n已保存草稿：${relative(projectRoot, file)} → ${collection}[id=${slug}]\n发布前可用编辑器继续修改，或运行 npm run blog -- server 预览。`,
  );
}

async function entries() {
  const result = (await readNotes()).map((note) => ({
    ...note,
    kind: 'note',
    locale: note.data.locale,
    title: note.data.title,
    draft: note.data.draft,
    archived: note.data.archived,
  }));
  for (const locale of ['en', 'zh']) {
    const file = resolve(
      projectRoot,
      `site/src/content/settings/${locale}.json`,
    );
    const data = JSON.parse(await readFile(file, 'utf8'));
    for (const kind of ['thoughts', 'bookmarks', 'projects'])
      for (const item of data[kind])
        result.push({
          file,
          kind,
          id: item.id,
          locale,
          title: item.title || item.name,
          draft: !!item.draft,
          archived: false,
        });
  }
  return result;
}
const label = (item) =>
  `[${item.locale}] ${item.title} · ${item.kind} · ${item.draft ? '草稿' : item.archived ? '已归档' : '待发布/已发布'}`;
async function changeState(command) {
  const options = (await entries()).filter((item) =>
    command === 'publish'
      ? item.draft
      : command === 'archive'
        ? item.kind === 'note' && !item.archived && !item.draft
        : !item.draft && !item.archived,
  );
  if (!options.length) {
    console.log('没有符合条件的内容。');
    return;
  }
  const item = await choose(
    '选择要修改的内容',
    options.map((item) => ({ label: label(item), value: item })),
  );
  console.log(
    `文件：${relative(projectRoot, item.file)}${item.kind === 'note' ? '' : ` → ${item.kind}[id=${item.id}]`}`,
  );
  if (command === 'draft')
    console.log(
      '下次部署会移除它的公开页面/列表；历史 Git 内容仍保留。已发布文章建议选择 archive，以保留旧 URL。',
    );
  if (command === 'archive')
    console.log(
      '保留文章 URL 和正文；下次部署从首页、RSS、sitemap 和搜索索引中排除。',
    );
  if (!(await confirm('只修改本地状态，现在继续？'))) return;
  const original = await readFile(item.file, 'utf8');
  if (item.kind === 'note') {
    const match = original.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    const data = parse(match[1]);
    if (command === 'archive') data.archived = true;
    else data.draft = command === 'draft';
    await writeFile(
      item.file,
      `---\n${serializeFrontmatter(data)}---\n${original.slice(match[0].length)}`,
    );
  } else {
    const data = JSON.parse(original);
    data[item.kind].find((record) => record.id === item.id).draft =
      command === 'draft';
    await saveJson(item.file, data);
  }
  try {
    await validateContent();
  } catch (error) {
    await writeFile(item.file, original);
    throw new Error(`状态未改变：${error.message}`);
  }
  console.log(
    '本地状态已更新，尚未上线。运行 npm run blog -- deploy 才会提交/推送。',
  );
}

export const isContentPath = (file) =>
  !file.split('/').includes('..') &&
  (/^site\/src\/content\/(?:notes\/(?:en|zh)\/[^\0]+\.md|settings\/(?:en|zh|shared)\.json)$/.test(
    file,
  ) ||
    /^site\/public\/images\/[^\0]+\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(
      file,
    ));
export function parseChangedPaths(raw) {
  const records = raw.split('\0').filter(Boolean),
    files = [];
  for (let i = 0; i < records.length; i++) {
    const status = records[i].slice(0, 2);
    const file = records[i].slice(3);
    files.push(file);
    if (/[RC]/.test(status)) files.push(records[++i]);
  }
  return [...new Set(files)];
}
const changedPaths = () =>
  parseChangedPaths(
    run('git', ['status', '--porcelain=v1', '--untracked-files=all', '-z'], {
      capture: true,
      raw: true,
    }),
  );
async function fingerprint(files) {
  const hash = createHash('sha256').update(git('rev-parse', 'HEAD'));
  for (const file of files.sort()) {
    hash.update(file);
    try {
      hash.update(await readFile(resolve(projectRoot, file)));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      hash.update('deleted');
    }
  }
  return hash.digest('hex');
}
async function deploy(dryRun) {
  const branch = git('branch', '--show-current');
  if (!branch) throw new Error('当前处于 detached HEAD，请先切到一个分支。');
  const files = changedPaths();
  const outside = files.filter((file) => !isContentPath(file));
  if (outside.length)
    throw new Error(
      `写作发布只提交内容和图片。请先处理这些代码/其他改动，再重新发布：\n${outside.join('\n')}`,
    );
  console.log(
    `\n分支：${branch}\n${branch === 'master' ? '目标：正式博客 ' + origin : '目标：远端同名分支；不会直接覆盖正式站。'}\n内容改动：${files.length ? '\n' + files.join('\n') : '没有未提交改动'}`,
  );
  const before = await fingerprint(files);
  npm('validate');
  if (dryRun) {
    console.log('检查通过。dry-run 未提交、未推送，也未改变远端。');
    return;
  }
  interactive();
  git('fetch', 'origin');
  const upstream =
    run('git', ['rev-parse', '--verify', `refs/remotes/origin/${branch}`], {
      capture: false,
      allowFailure: true,
    }) === 0
      ? `origin/${branch}`
      : 'origin/master';
  console.log(
    `将推送的已提交改动：\n${git('log', '--oneline', `${upstream}..HEAD`) || '无'}\n${git('diff', '--stat', upstream, 'HEAD')}`,
  );
  if (
    branch === 'master' &&
    run('git', ['merge-base', '--is-ancestor', 'origin/master', 'HEAD'], {
      capture: false,
      allowFailure: true,
    }) !== 0
  )
    throw new Error(
      '远端 master 有新提交。请先 git pull --ff-only（有冲突时先解决），再重新发布。',
    );
  console.log(run('git', ['diff', '--stat'], { capture: true }));
  console.log(run('git', ['diff', '--cached', '--stat'], { capture: true }));
  const message = files.length
    ? await required('提交说明', 'Update blog content')
    : undefined;
  if (
    !(await confirm(
      branch === 'master'
        ? '检查通过，提交并推送到 master，上线这些内容？'
        : '检查通过，提交并推送当前分支？',
    ))
  ) {
    console.log('已取消，未提交或推送。');
    return;
  }
  if (
    JSON.stringify(changedPaths().sort()) !== JSON.stringify(files.sort()) ||
    (await fingerprint(files)) !== before
  )
    throw new Error('内容在检查后发生变化，未提交或推送。请重新运行 deploy。');
  if (files.length) {
    run('git', ['add', '--', ...files]);
    run('git', ['commit', '-m', message]);
  }
  run('git', ['push', '-u', 'origin', branch]);
  console.log(
    branch === 'master'
      ? `\n代码已推送。上线结果以 Actions 的 deploy 成功和真实页面为准：\n${repoUrl}/actions/workflows/pages.yml\n${origin}`
      : `\n分支已推送。创建并合并 PR 后才会上线：\n${repoUrl}/compare/master...${encodeURIComponent(branch)}?expand=1`,
  );
}

export async function main(argv = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      help: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      ...Object.fromEntries(
        ['kind', 'slug', 'locale', 'title', 'description', 'date'].map(
          (key) => [key, { type: 'string' }],
        ),
      ),
    },
  });
  if (values.help) {
    console.log(help);
    return;
  }
  let command = positionals[0];
  if (!command)
    command = await choose('Kevin Blog · 选择操作', [
      { label: '新建文章 / 近况 / 收藏 / 项目', value: 'new' },
      { label: '查看内容清单', value: 'list' },
      { label: '本地预览（包含草稿）', value: 'server' },
      { label: '将草稿准备为可发布', value: 'publish' },
      { label: '归档文章（保留旧链接）', value: 'archive' },
      { label: '改回草稿', value: 'draft' },
      { label: '检查并生成站点', value: 'check' },
      { label: '提交并推送发布', value: 'deploy' },
      { label: '仓库 / 发布状态', value: 'status' },
      { label: '帮助', value: 'help' },
      { label: '退出', value: 'exit' },
    ]);
  if (command === 'new') await newEntry(values);
  else if (['publish', 'draft', 'archive'].includes(command))
    await changeState(command);
  else if (command === 'list')
    for (const item of await entries())
      console.log(
        `${label(item)}\n  ${relative(projectRoot, item.file)}${item.kind === 'note' ? '' : ` #${item.id}`}`,
      );
  else if (command === 'generate') {
    closePrompt();
    npm('build', true);
  } else if (command === 'check') {
    closePrompt();
    npm('validate');
  } else if (command === 'deploy') await deploy(!!values['dry-run']);
  else if (command === 'server') {
    closePrompt();
    const child = spawn(
      process.execPath,
      [resolve(projectRoot, 'scripts/dev-drafts.mjs')],
      { cwd: projectRoot, stdio: 'inherit' },
    );
    child.on('error', (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    child.on('exit', (code) => {
      process.exitCode = code ?? 1;
    });
    for (const signal of ['SIGINT', 'SIGTERM'])
      process.on(signal, () => child.kill(signal));
  } else if (command === 'status') {
    console.log(
      `分支：${git('branch', '--show-current')}\n提交：${git('rev-parse', '--short', 'HEAD')}\n${git('status', '--short') || '工作区干净'}\n正式站：${origin}\n部署记录：${repoUrl}/actions/workflows/pages.yml`,
    );
  } else if (command === 'help') console.log(help);
  else if (command !== 'exit') throw new Error(`未知命令 ${command}\n${help}`);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    await main();
  } catch (error) {
    console.error(`\n${error.message}`);
    process.exitCode = 1;
  } finally {
    closePrompt();
  }
}
