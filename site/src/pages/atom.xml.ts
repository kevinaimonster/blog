import type { APIRoute } from 'astro';
import { getNotes, notePath } from '../data/notes';
import { getContent } from '../data/i18n';
import { escapeXml } from '../data/seo';

// Keep the original Hexo subscription address working.
export const GET: APIRoute = async ({ site: origin }) => {
  const notes = await getNotes('en');
  const { site } = getContent('en');
  const timestamp = (date: string) => `${date}T00:00:00Z`;
  const updated =
    notes
      .map((note) => note.data.updated || note.data.date)
      .sort()
      .at(-1) || '2026-10-29';
  const items = notes
    .map((note) => {
      const url = escapeXml(new URL(notePath(note), origin).href);
      return `<entry><id>${url}</id><title>${escapeXml(note.data.title)}</title><link href="${url}"/><published>${timestamp(note.data.date)}</published><updated>${timestamp(note.data.updated || note.data.date)}</updated><summary>${escapeXml(note.data.description)}</summary></entry>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en"><id>${origin}</id><title>${escapeXml(site.title)}</title><link href="${origin}"/><link rel="self" href="${new URL('/atom.xml', origin)}"/><updated>${timestamp(updated)}</updated><author><name>Kevin</name></author>${items}</feed>`,
    {
      headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
    },
  );
};
