import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const origin = new URL(process.env.SITE_URL || 'https://kevin1988.fun').origin;
const indexable = process.env.SITE_INDEXABLE === 'true';
const read = (file) => readFile(path.join(root, file), 'utf8');
const routeFile = (route) =>
  route.endsWith('/') ? `${route}index.html` : route;
const metadata = (html, name) =>
  html.match(
    new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`),
  )?.[1];
const canonical = (html) =>
  html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const alternates = (html) => [
  ...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g),
];
const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
async function htmlFiles(dir = root) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) => {
        const file = path.join(dir, entry.name);
        return entry.isDirectory()
          ? htmlFiles(file)
          : file.endsWith('.html')
            ? [file]
            : [];
      }),
    )
  ).flat();
}

test('canonical, social URLs, and reciprocal language alternatives match actual output', async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    const url = new URL(canonical(html));
    assert.equal(url.origin, origin, file);
    assert.equal(metadata(html, 'og:url'), url.href, file);
    assert.equal(new URL(metadata(html, 'og:image')).origin, origin, file);
    await read(new URL(metadata(html, 'og:image')).pathname);
    assert.equal(metadata(html, 'twitter:image'), metadata(html, 'og:image'));
    const actualPath =
      '/' + path.relative(root, file).replace(/index\.html$/, '');
    if (!actualPath.startsWith('/archives/'))
      assert.equal(url.pathname, actualPath, file);
    for (const [, language, link] of alternates(html)) {
      const alternate = new URL(link);
      assert.equal(alternate.origin, origin);
      const target = await read(routeFile(alternate.pathname));
      assert.ok(
        alternates(target).some((item) => item[2] === url.href),
        `Missing return alternate from ${link} to ${url.href}`,
      );
      if (language !== 'x-default')
        assert.match(target, new RegExp(`<html lang="${language}"`));
    }
  }
});

test('BlogPosting describes the visible article and actual publication date', async () => {
  for (const [route, title, date, language] of [
    ['/notes/a-new-garden/', 'A place for ideas to grow', '2026-10-29', 'en'],
    [
      '/zh/notes/a-new-garden/',
      '给想法留一块生长的地方',
      '2026-10-29',
      'zh-CN',
    ],
    ['/First-Post/', 'First Post', '2024-06-19', 'en'],
    ['/2024/06/19/hello-world/', 'Hello World', '2024-06-19', 'en'],
  ]) {
    const html = await read(routeFile(route));
    const json = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1];
    assert.ok(json, route);
    const data = JSON.parse(json);
    assert.equal(data['@type'], 'BlogPosting');
    assert.equal(data.headline, title);
    assert.equal(data.description, decode(metadata(html, 'description')));
    assert.equal(data.datePublished, date);
    assert.equal(data.author.name, 'Kevin');
    assert.equal(data.inLanguage, language);
    assert.equal(data.url, `${origin}${route}`);
    assert.equal(data.mainEntityOfPage, canonical(html));
    assert.equal(data.image[0], metadata(html, 'og:image'));
    assert.equal(metadata(html, 'og:type'), 'article');
    assert.match(html, new RegExp(`<time datetime="${date}"`));
    assert.ok(html.includes(`<h1>${title}</h1>`));
    await read(routeFile(new URL(data.author.url).pathname));
  }
});

test('sitemap contains exactly indexable pages and robots exposes the production sitemap', async () => {
  const sitemap = await read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (item) => item[1],
  );
  assert.equal(new Set(urls).size, urls.length);
  const expected = [];
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    if (metadata(html, 'robots').startsWith('index,'))
      expected.push(canonical(html));
  }
  assert.deepEqual(urls.sort(), expected.sort());
  assert.ok(indexable ? urls.length >= 12 : urls.length === 0);
  const robots = await read('robots.txt');
  if (indexable) {
    assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
    assert.ok(robots.includes('Allow: /'));
    assert.ok(!robots.includes('Disallow: /'));
  } else assert.ok(robots.includes('Disallow: /'));
  for (const route of [
    '/404.html',
    '/First-Post/',
    '/2024/06/19/hello-world/',
    '/archives/',
    '/archives/2024/',
    '/archives/2024/06/',
  ]) {
    const html = await read(routeFile(route));
    assert.equal(metadata(html, 'robots'), 'noindex, follow');
    assert.ok(!urls.includes(`${origin}${route}`));
  }
});

test('old URLs, subscription address, and anchors survive the migration', async () => {
  const hello = await read('2024/06/19/hello-world/index.html');
  for (const anchor of [
    'Quick-Start',
    'Create-a-new-post',
    'Run-server',
    'Generate-static-files',
    'Deploy-to-remote-sites',
  ]) {
    assert.ok(hello.includes(`id="${anchor}"`));
  }
  assert.match(await read('First-Post/index.html'), /without a body/);
  for (const feedPath of ['rss.xml', 'zh/rss.xml', 'atom.xml']) {
    const xml = await read(feedPath);
    assert.ok(xml.includes(`${origin}/`));
    assert.ok(xml.includes('a-new-garden/'));
    assert.ok(!xml.includes('/First-Post/') && !xml.includes('/hello-world/'));
  }
  assert.match(
    await read('atom.xml'),
    /xmlns="http:\/\/www.w3.org\/2005\/Atom"/,
  );
  assert.equal((await read('CNAME')).trim(), 'kevin1988.fun');
});
