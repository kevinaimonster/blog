import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { site } from '../data/site';
const escape = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
export const GET: APIRoute = async ({ site: origin }) => {
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.localeCompare(a.data.date),
  );
  const items = notes
    .map((note) => {
      const url = new URL(`/notes/${note.id}/`, origin).href;
      return `<item><title>${escape(note.data.title)}</title><description>${escape(note.data.description)}</description><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${note.data.date}T00:00:00Z`).toUTCString()}</pubDate></item>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.title)}</title><link>${origin}</link><description>${escape(site.description)}</description><language>zh-cn</language>${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
};
