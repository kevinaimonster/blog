import { useMemo, useState } from 'react';
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  FileText,
  Bookmark,
  MessageSquare,
  X,
} from 'lucide-react';

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
  { key: 'thought', label: '近况' },
  { key: 'note', label: '笔记' },
  { key: 'bookmark', label: '收藏' },
];
const labels = { thought: '近况', note: '笔记', bookmark: '收藏' };
const icons = { thought: MessageSquare, note: FileText, bookmark: Bookmark };

export default function GardenFeed({ items }: { items: FeedItem[] }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === 'all' || item.kind === category) &&
          [item.title, item.text, item.tag, item.domain]
            .join(' ')
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
      ),
    [items, category, query],
  );
  const reset = () => {
    setQuery('');
    setCategory('all');
  };
  return (
    <div className="garden-feed">
      <div className="feed-controls">
        <div className="feed-tabs" role="group" aria-label="按内容类型筛选">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="search-control">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            aria-label="搜索花园内容"
            placeholder="搜索内容"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            <Search size={24} aria-hidden="true" />
            <h3>暂时没有找到</h3>
            <p>试试别的关键词，或看看全部内容。</p>
            <button className="text-link" onClick={reset}>
              查看全部内容 <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = icons[item.kind];
            return (
              <article
                className={`feed-item item-${item.kind}`}
                key={`${item.kind}:${item.id}`}
              >
                <div className="feed-date">
                  <time dateTime={item.date}>
                    {item.date.slice(5).replace('-', '.')}
                  </time>
                  <span>{item.date.slice(0, 4)}</span>
                </div>
                <div className="feed-content">
                  <div className="feed-meta">
                    <Icon size={13} aria-hidden="true" />
                    <span>{labels[item.kind]}</span>
                    {item.tag && (
                      <>
                        <span className="meta-dot">·</span>
                        <span>{item.tag}</span>
                      </>
                    )}
                  </div>
                  {item.title && (
                    <h3>
                      {item.url ? (
                        <a
                          href={item.url}
                          target={
                            item.kind === 'bookmark' ? '_blank' : undefined
                          }
                          rel={
                            item.kind === 'bookmark'
                              ? 'noopener noreferrer'
                              : undefined
                          }
                        >
                          {item.title}
                          {item.kind === 'bookmark' && (
                            <ArrowUpRight size={16} />
                          )}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                  )}
                  <p>{item.text}</p>
                  {item.kind === 'note' && (
                    <a className="text-link read-link" href={item.url}>
                      继续阅读 <ArrowRight size={14} />
                    </a>
                  )}
                  {item.domain && (
                    <span className="bookmark-domain">{item.domain}</span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
      <div className="feed-end">
        <span></span>
        <p>慢慢记录，持续生长。</p>
        <span></span>
      </div>
    </div>
  );
}
