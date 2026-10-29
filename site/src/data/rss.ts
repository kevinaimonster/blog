import { getNotes, notePath } from './notes';
import type { APIRoute } from 'astro';
import { getContent, localizedPath, type Locale } from './i18n';
import { escapeXml as escape } from './seo';
export const createFeed =
  (locale: Locale): APIRoute =>
  async ({ site: origin }) => {
    const { site } = getContent(locale);
    const notes = await getNotes(locale);
    const items = notes
      .map((note) => {
        const url = new URL(notePath(note), origin).href;
        return `<item><title>${escape(note.data.title)}</title><description>${escape(note.data.description)}</description><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${note.data.date}T00:00:00Z`).toUTCString()}</pubDate></item>`;
      })
      .join('');
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.title)}</title><link>${new URL(localizedPath('/', locale), origin).href}</link><description>${escape(site.description)}</description><language>${locale === 'zh' ? 'zh-cn' : 'en'}</language>${items}</channel></rss>`,
      { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
    );
  };
