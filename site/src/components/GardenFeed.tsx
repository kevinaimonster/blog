import { useMemo, useState } from 'react';
import { Search, ChevronRight, ArrowUpRight, X } from 'lucide-react';
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
const categories = [
  { key: 'all', label: '全部' },
  { key: 'note', label: '笔记' },
  { key: 'thought', label: '近况' },
  { key: 'bookmark', label: '收藏' },
];
const labels = { thought: '近况', note: '笔记', bookmark: '收藏' };
const displayDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
};
export default function GardenFeed({ items }: { items: FeedItem[] }) {
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
        <div className="feed-tabs" role="group" aria-label="按内容类型筛选">
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
            aria-label="搜索花园内容"
            placeholder="搜索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="清空搜索"
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
            <h3>暂时没有找到</h3>
            <p>试试别的关键词，或看看全部内容。</p>
            <button className="text-link" onClick={reset}>
              查看全部内容 <ChevronRight size={16} />
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
                  继续阅读 <ChevronRight size={15} />
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
