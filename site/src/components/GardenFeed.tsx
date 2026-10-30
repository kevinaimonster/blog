import { useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon as Search,
  CaretRightIcon as ChevronRight,
  ArrowUpRightIcon as ArrowUpRight,
  XIcon as X,
} from '@phosphor-icons/react';
import { translator, type Locale } from '../data/locales';
export interface FeedItem {
  id: string;
  kind: 'thought' | 'note' | 'bookmark';
  date: string;
  title?: string;
  text: string;
  tag?: string;
  url?: string;
  domain?: string;
}
export default function GardenFeed({
  items,
  locale,
}: {
  items: FeedItem[];
  locale: Locale;
}) {
  const t = translator(locale);
  const categories = [
    { key: 'all', label: t('全部', 'All') },
    { key: 'note', label: t('笔记', 'Notes') },
    { key: 'thought', label: t('近况', 'Updates') },
    { key: 'bookmark', label: t('收藏', 'Bookmarks') },
  ];
  const labels = {
    thought: t('近况', 'Update'),
    note: t('笔记', 'Note'),
    bookmark: t('收藏', 'Bookmark'),
  };
  const displayDate = (date: string) =>
    new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(date + 'T00:00:00Z'));
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === 'all' || category === item.kind) &&
          [item.title, item.text, item.tag, item.domain]
            .join(' ')
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
      ),
    [items, category, query],
  );
  const reset = () => {
    setCategory('all');
    setQuery('');
  };
  return (
    <div className="garden-feed">
      <div className="feed-controls">
        <div
          className="feed-tabs"
          role="group"
          aria-label={t('按内容类型筛选', 'Filter by content type')}
        >
          {categories.map((item) => (
            <button
              type="button"
              key={item.key}
              aria-pressed={category === item.key}
              onClick={() => setCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="search-control">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('搜索博客内容', 'Search the journal')}
            placeholder={t('搜索', 'Search')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label={t('清空搜索', 'Clear search')}
              onClick={() => setQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="feed-items" aria-live="polite" aria-atomic="false">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={24} />
            <h3>{t('暂时没有找到', 'Nothing found yet')}</h3>
            <p>
              {t(
                '试试别的关键词，或看看全部内容。',
                'Try another keyword, or browse everything.',
              )}
            </p>
            <button className="text-link" onClick={reset}>
              {t('查看全部内容', 'Show everything')} <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <article
              className={`feed-item item-${item.kind}`}
              key={`${item.kind}:${item.id}`}
            >
              <div className="feed-date">
                <time dateTime={item.date}>{displayDate(item.date)}</time>
                <span>{labels[item.kind]}</span>
              </div>
              <h2>
                {item.url ? (
                  <a
                    href={item.url}
                    target={item.kind === 'bookmark' ? '_blank' : undefined}
                    rel={
                      item.kind === 'bookmark'
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h2>
              <p>{item.text}</p>
              {item.kind === 'note' && (
                <a className="text-link" href={item.url}>
                  {t('继续阅读', 'Read more')} <ChevronRight size={15} />
                </a>
              )}
              {item.kind === 'bookmark' && (
                <a
                  className="text-link"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.domain} <ArrowUpRight size={15} />
                </a>
              )}
              {item.kind === 'thought' && (
                <span className="thought-tag">{item.tag}</span>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
