import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
  createPost,
  readNotes,
  validateContent,
  projectRoot,
} from '../scripts/content.mjs';
import {
  dateSchema,
  noteSchema,
  settingsSchema,
} from '../site/src/data/content-schema.mjs';
import { isContentPath, parseChangedPaths } from '../scripts/blog.mjs';

async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), 'kevin-content-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(
    resolve(projectRoot, 'site/src/content'),
    resolve(root, 'site/src/content'),
    { recursive: true },
  );
  await cp(
    resolve(projectRoot, 'site/public/images'),
    resolve(root, 'site/public/images'),
    { recursive: true },
  );
  return root;
}

test('new posts are drafts, preserve quoted text, and never overwrite or escape content paths', async (t) => {
  const root = await fixture(t);
  const file = await createPost(
    {
      slug: 'cli-example',
      locale: 'zh',
      title: '标题: "引号"',
      description: 'A: value\nSecond line',
      date: '2026-10-29',
    },
    root,
  );
  const note = (await readNotes(root)).find(
    (note) => note.slug === 'cli-example',
  );
  assert.equal(note.data.title, '标题: "引号"');
  assert.equal(note.data.description, 'A: value\nSecond line');
  assert.equal(note.data.draft, true);
  const original = await readFile(file, 'utf8');
  assert.match(original, /date: "2026-10-29"/);
  await assert.rejects(
    createPost(
      { slug: 'cli-example', locale: 'zh', title: 'Replacement' },
      root,
    ),
    { code: 'EEXIST' },
  );
  assert.equal(await readFile(file, 'utf8'), original);
  await assert.rejects(
    createPost({ slug: '../outside', title: 'No' }, root),
    /slug/,
  );
  await validateContent(root);
});

test('content validation stops empty publication, duplicate URLs, and missing images', async (t) => {
  const root = await fixture(t);
  const file = await createPost(
    {
      slug: 'invalid-post',
      title: 'A test',
      description: 'A summary',
      date: '2026-10-29',
    },
    root,
  );
  const original = await readFile(file, 'utf8');
  await writeFile(file, original.replace('draft: true', 'draft: false'));
  await assert.rejects(validateContent(root), /published notes need a body/);
  await createPost({ slug: 'same-url', title: 'Another draft' }, root);
  await writeFile(
    file,
    original.replace(
      'draft: true',
      'draft: false\npermalink: /notes/same-url/',
    ) + 'Body.\n',
  );
  await assert.rejects(validateContent(root), /duplicate URL/);
  await writeFile(
    file,
    original.replace(
      'draft: true',
      'draft: false\nillustration:\n  src: /images/does-not-exist.png\n  alt: Test\n  caption: Test',
    ) + 'Body.\n',
  );
  await assert.rejects(validateContent(root), /missing image/);
});

test('calendar dates, update dates, record IDs and link protocols are validated', async () => {
  assert.equal(dateSchema.safeParse('2024-02-29').success, true);
  assert.equal(dateSchema.safeParse('2026-02-29').success, false);
  assert.equal(dateSchema.safeParse('2026-13-01').success, false);
  assert.equal(
    noteSchema.safeParse({
      locale: 'en',
      title: 'Test',
      description: 'Summary',
      date: '2026-10-29',
      updated: '2026-10-28',
    }).success,
    false,
  );
  const settings = JSON.parse(
    await readFile(
      resolve(projectRoot, 'site/src/content/settings/en.json'),
      'utf8',
    ),
  );
  const bookmark = {
    id: 'test-bookmark',
    title: 'Test',
    date: '2026-10-29',
    description: 'A reference',
    category: 'Test',
    url: 'https://example.com',
  };
  settings.bookmarks = [bookmark, { ...bookmark, url: 'javascript:alert(1)' }];
  const result = settingsSchema.safeParse(settings);
  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some((issue) => issue.message.includes('Duplicate ID')),
  );
  assert.ok(result.error.issues.some((issue) => issue.path.includes('url')));
});

test('writing deployment scopes include both sides of renames and reject code or credentials', () => {
  assert.deepEqual(
    parseChangedPaths(
      ' M site/src/content/notes/en/a.md\0R  site/public/images/new.png\0site/public/images/old.png\0?? site/src/content/notes/zh/b.md\0',
    ),
    [
      'site/src/content/notes/en/a.md',
      'site/public/images/new.png',
      'site/public/images/old.png',
      'site/src/content/notes/zh/b.md',
    ],
  );
  for (const file of [
    'site/src/content/notes/en/a.md',
    'site/src/content/settings/zh.json',
    'site/public/images/photo.webp',
  ])
    assert.equal(isContentPath(file), true, file);
  for (const file of [
    '.env',
    '.github/workflows/pages.yml',
    'site/src/layouts/Base.astro',
    'site/public/images/code.html',
    'site/public/images/../../outside.png',
    'README.md',
  ])
    assert.equal(isContentPath(file), false, file);
});
