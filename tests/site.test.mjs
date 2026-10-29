import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

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
  assert.ok(pages.length >= 7, 'Expected all main routes and a note detail');
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    for (const expected of [
      /<title>[^<]+<\/title>/,
      /name="description" content="[^"]+"/,
      /lang="zh-CN"/,
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
  const xml = await readFile(path.join(output, 'rss.xml'), 'utf8');
  assert.match(xml, /<rss version="2.0">/);
  const expectedOrigin =
    process.env.SITE_URL ||
    'https://kevin-digital-garden.kevinmonster.chatgpt.site';
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  assert.ok(items.length > 0, 'Expected the starter note in RSS');
  for (const [, body] of items) {
    const link = body.match(/<link>([^<]+)<\/link>/)?.[1];
    const url = new URL(link);
    assert.equal(url.origin, new URL(expectedOrigin).origin);
    await stat(path.join(output, url.pathname, 'index.html'));
    const date = body.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];
    assert.ok(
      Number.isFinite(Date.parse(date)),
      'Publication date must be valid',
    );
  }
});
