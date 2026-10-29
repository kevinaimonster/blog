import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const output = path.resolve('dist');
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? filesIn(path.join(directory, entry.name))
          : path.join(directory, entry.name),
      ),
    )
  ).flat();
}
const pages = (await filesIn(output)).filter((file) => file.endsWith('.html'));

test('all generated pages have a title, description, language, and main landmark', async () => {
  assert.ok(pages.length >= 13, 'Expected English and Chinese routes plus 404');
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    for (const expected of [
      /<title>[^<]+<\/title>/,
      /name="description" content="[^"]+"/,
      file.includes(`${path.sep}zh${path.sep}`) ? /lang="zh-CN"/ : /lang="en"/,
      /data-theme="dark"/,
      /<main\s[^>]*id="main"/,
    ]) {
      assert.match(html, expected, file);
    }
  }
});

test('internal links and local assets resolve to built output', async () => {
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const pathname = decodeURIComponent(match[1]);
      if (pathname.startsWith('//')) continue;
      const candidate = path.join(output, pathname);
      try {
        const entry = await stat(candidate);
        if (entry.isDirectory()) await stat(path.join(candidate, 'index.html'));
      } catch {
        assert.fail(
          `${path.relative(output, file)} links to missing ${pathname}`,
        );
      }
    }
  }
});

test('RSS items use the deployment domain and point to generated notes', async () => {
  for (const locale of ['en', 'zh']) {
    const xml = await readFile(
      path.join(output, locale === 'zh' ? 'zh/rss.xml' : 'rss.xml'),
      'utf8',
    );
    assert.match(
      xml,
      new RegExp(`<language>${locale === 'zh' ? 'zh-cn' : 'en'}</language>`),
    );
    assert.match(xml, /<rss version="2.0">/);
    const expectedOrigin = process.env.SITE_URL || 'https://kevin1988.fun';
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    assert.ok(items.length > 0, 'Expected the starter note in RSS');
    for (const [, body] of items) {
      const link = body.match(/<link>([^<]+)<\/link>/)?.[1];
      const url = new URL(link);
      assert.equal(url.pathname.startsWith('/zh/'), locale === 'zh');
      assert.equal(url.origin, new URL(expectedOrigin).origin);
      await stat(path.join(output, url.pathname, 'index.html'));
      const date = body.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];
      assert.ok(
        Number.isFinite(Date.parse(date)),
        'Publication date must be valid',
      );
    }
  }
});

test('both languages include translated content and same-page switching', async () => {
  for (const [route, english, chinese] of [
    [
      '',
      'AI products · macOS tools · Custom AI',
      'AI 产品 · macOS 工具 · 企业 AI 定制',
    ],
    ['about/', 'Hi, I’m Kevin', '你好，我是 Kevin'],
    ['projects/', 'Ideas, made real.', '让想法，有所着落。'],
    ['bookmarks/', 'Worth another look.', '值得，再看一次。'],
    ['notes/', 'Notes along the way.', '把过程，写下来。'],
    [
      'notes/a-new-garden/',
      'A place for ideas to grow',
      '给想法留一块生长的地方',
    ],
  ]) {
    const en = await readFile(path.join(output, route, 'index.html'), 'utf8');
    const zh = await readFile(
      path.join(output, 'zh', route, 'index.html'),
      'utf8',
    );
    assert.ok(en.includes(english), `English content missing: ${route}`);
    assert.ok(zh.includes(chinese), `Chinese content missing: ${route}`);
    assert.ok(en.includes(`href="/zh/${route}"`));
    assert.ok(zh.includes(`href="/${route}"`));
    assert.match(en, /data-language-toggle="zh"/);
    assert.match(zh, /data-language-toggle="en"/);
    const main = en.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.doesNotMatch(
      main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''),
      /[\u4e00-\u9fff]/,
      `Untranslated English content: ${route}`,
    );
  }
});

test('first paint defaults to dark English and respects saved preferences', async () => {
  const html = await readFile(path.join(output, 'index.html'), 'utf8');
  const bootstrap = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .find((script) => script.includes("getItem('garden-theme')"));
  assert.ok(bootstrap, 'Expected the preference script before first paint');
  for (const scenario of [
    { stored: {}, pathname: '/', theme: 'dark' },
    { stored: { 'garden-theme': 'light' }, pathname: '/', theme: 'light' },
    {
      stored: { 'garden-theme': 'dark', 'garden-language': 'zh' },
      pathname: '/',
      theme: 'dark',
      redirect: '/zh/?from=test#notes',
    },
    { stored: { 'garden-language': 'en' }, pathname: '/', theme: 'dark' },
    { stored: { 'garden-language': 'zh' }, pathname: '/notes/', theme: 'dark' },
    { stored: {}, pathname: '/zh/', theme: 'dark' },
    { stored: {}, pathname: '/', theme: 'dark', blockedStorage: true },
  ]) {
    let redirected;
    const document = { documentElement: { dataset: { theme: 'dark' } } };
    vm.runInNewContext(bootstrap, {
      document,
      localStorage: {
        getItem(key) {
          if (scenario.blockedStorage) throw new Error('Storage disabled');
          return scenario.stored[key] ?? null;
        },
      },
      location: {
        pathname: scenario.pathname,
        search: '?from=test',
        hash: '#notes',
        replace(value) {
          redirected = value;
        },
      },
    });
    assert.equal(document.documentElement.dataset.theme, scenario.theme);
    assert.equal(redirected, scenario.redirect);
  }
});
