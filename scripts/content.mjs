import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parse, stringify } from 'yaml';
import {
  noteSchema,
  settingsSchema,
  sharedSchema,
  dateSchema,
} from '../site/src/data/content-schema.mjs';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
// Astro's Markdown parser recognizes unquoted YYYY-MM-DD as a YAML timestamp.
// Quote string values so its parser and the CLI agree on frontmatter types.
export const serializeFrontmatter = (data) =>
  stringify(data, {
    defaultStringType: 'QUOTE_DOUBLE',
    defaultKeyType: 'PLAIN',
  });
export async function readNotes(root = projectRoot) {
  const base = resolve(root, 'site/src/content/notes');
  async function walk(directory) {
    return (
      await Promise.all(
        (await readdir(directory, { withFileTypes: true })).map(
          async (entry) => {
            const file = resolve(directory, entry.name);
            if (entry.isDirectory()) return walk(file);
            if (!file.endsWith('.md')) return [];
            const source = await readFile(file, 'utf8');
            const match = source.match(
              /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
            );
            if (!match)
              throw new Error(
                `${relative(root, file)}: missing YAML frontmatter`,
              );
            let data;
            try {
              data = noteSchema.parse(parse(match[1]));
            } catch (error) {
              throw new Error(`${relative(root, file)}: ${error.message}`);
            }
            const id = relative(base, file)
              .replaceAll('\\', '/')
              .replace(/\.md$/, '');
            const slug = id.replace(/^(en|zh)\//, '');
            return [
              {
                file,
                id,
                slug,
                data,
                body: source.slice(match[0].length),
                path:
                  data.permalink ||
                  `${data.locale === 'zh' ? '/zh' : ''}/notes/${slug}/`,
              },
            ];
          },
        ),
      )
    ).flat();
  }
  return walk(base);
}

export async function validateContent(root = projectRoot) {
  const errors = [];
  const notes = await readNotes(root);
  const routes = new Map();
  const reserved = new Set(
    [
      '/',
      '/about/',
      '/projects/',
      '/bookmarks/',
      '/notes/',
      '/404/',
      '/rss.xml/',
      '/atom.xml/',
      '/robots.txt/',
      '/sitemap.xml/',
    ].flatMap((p) => [p, `/zh${p}`]),
  );
  const checkAsset = async (path, label) => {
    try {
      if (!(await stat(resolve(root, 'site/public', path.slice(1)))).isFile())
        throw new Error();
    } catch {
      errors.push(`${label}: missing image ${path}`);
    }
  };
  for (const note of notes) {
    const label = relative(root, note.file);
    if (!note.id.startsWith(`${note.data.locale}/`))
      errors.push(`${label}: locale must match its folder`);
    if (note.path.startsWith('/zh/') !== (note.data.locale === 'zh'))
      errors.push(`${label}: permalink must stay within its language`);
    if (
      reserved.has(note.path) ||
      /^\/(?:zh\/)?(?:archives|images|_astro)\//.test(note.path)
    )
      errors.push(`${label}: permalink collides with a reserved route`);
    if (routes.has(note.path))
      errors.push(
        `${label}: duplicate URL ${note.path} (${routes.get(note.path)})`,
      );
    routes.set(note.path, label);
    if (!note.data.draft && !note.body.replace(/<!--[\s\S]*?-->/g, '').trim())
      errors.push(`${label}: published notes need a body`);
    if (note.data.illustration)
      await checkAsset(note.data.illustration.src, label);
  }
  const settings = {};
  for (const locale of ['en', 'zh']) {
    const file = `site/src/content/settings/${locale}.json`;
    try {
      settings[locale] = settingsSchema.parse(
        JSON.parse(await readFile(resolve(root, file), 'utf8')),
      );
    } catch (error) {
      errors.push(`${file}: ${error.message}`);
    }
  }
  try {
    const shared = sharedSchema.parse(
      JSON.parse(
        await readFile(
          resolve(root, 'site/src/content/settings/shared.json'),
          'utf8',
        ),
      ),
    );
    await checkAsset(shared.avatar, 'shared.json');
  } catch (error) {
    errors.push(`shared.json: ${error.message}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { notes, settings };
}

export async function createPost(options, root = projectRoot) {
  const {
    slug,
    locale = 'en',
    title,
    description = '',
    date = new Date().toLocaleDateString('en-CA'),
  } = options;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || ''))
    throw new Error('--slug must use lowercase words joined with hyphens');
  if (!['en', 'zh'].includes(locale))
    throw new Error('--locale must be en or zh');
  if (!title?.trim()) throw new Error('--title is required');
  dateSchema.parse(date);
  const file = resolve(root, `site/src/content/notes/${locale}/${slug}.md`);
  const data = {
    locale,
    title: title.trim(),
    description,
    date,
    tags: [],
    draft: true,
  };
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `---\n${serializeFrontmatter(data)}---\n\n`, {
    flag: 'wx',
  });
  return file;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const command = process.argv[2];
    if (command === 'check') {
      const { notes, settings } = await validateContent();
      console.log(
        `Content valid: ${notes.filter((n) => !n.data.draft).length} published/archived notes, ${notes.filter((n) => n.data.draft).length} drafts; en/zh settings validated.`,
      );
      for (const locale of ['en', 'zh'])
        console.log(
          `${locale}: ${settings[locale].thoughts.length} updates, ${settings[locale].bookmarks.length} bookmarks, ${settings[locale].projects.length} projects.`,
        );
    } else if (command === 'new') {
      const { values } = parseArgs({
        args: process.argv.slice(3),
        options: Object.fromEntries(
          ['slug', 'locale', 'title', 'description', 'date'].map((key) => [
            key,
            { type: 'string' },
          ]),
        ),
      });
      const file = await createPost(values);
      console.log(
        `Draft created: ${relative(projectRoot, file)}\nPreview: npm run dev:drafts\nPublish after editing: set draft: false, run npm run validate, then submit a PR.`,
      );
    } else
      throw new Error(
        'Use npm run content:check or npm run post:new -- --slug my-note --locale en --title "My note"',
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
