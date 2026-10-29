import type { APIRoute } from 'astro';
import { getPublishedNotes, notePath } from '../data/notes';
import { escapeXml, indexable, pageAlternates, pagePaths } from '../data/seo';

export const GET: APIRoute = async ({ site }) => {
  const notes = (await getPublishedNotes()).filter(
    (note) => !note.data.archived,
  );
  const entries = indexable
    ? [
        ...pagePaths.flatMap((path) =>
          pageAlternates(path).map((entry) => ({
            path: entry.path,
            modified: undefined,
          })),
        ),
        ...notes.map((note) => ({
          path: notePath(note),
          modified: note.data.updated || note.data.date,
        })),
      ]
    : [];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((entry) => `<url><loc>${escapeXml(new URL(entry.path, site).href)}</loc>${entry.modified ? `<lastmod>${entry.modified}</lastmod>` : ''}</url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
