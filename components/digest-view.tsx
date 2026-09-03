import type { Digest, NewsItem } from "@/lib/types";
import { CodexResetStatus } from "@/components/codex-reset-status";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "Asia/Shanghai",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00+08:00`));
}

function isGitHubTrending(item: NewsItem) {
  const haystack = `${item.category ?? ""} ${item.source_name} ${item.title}`.toLowerCase();
  return haystack.includes("github") && /(热门|趋势|trending|repo|repository|项目|开源)/i.test(haystack);
}

function BrandIcon({ label }: { label: string }) {
  const value = label.toLowerCase();

  if (value.includes("apple")) {
    return (
      <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.9 12.5c0-2.5 2-3.7 2.1-3.8-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2-1-3.4-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2.1.8 3.4.8 1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.6-1-2.6-4zM14.2 5c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.4.7-3.2 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.5-.6 3.2-1.5z" fill="currentColor" />
      </svg>
    );
  }

  if (value.includes("github")) {
    return (
      <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.2 9.2 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5a10.1 10.1 0 0 0 6.8-9.7C22 6.6 17.5 2 12 2z" fill="currentColor" />
      </svg>
    );
  }

  if (value.includes("openai")) {
    return <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
  }

  if (value.includes("google")) {
    return <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h4.8a4.1 4.1 0 0 1-1.8 2.7v2.3h2.9c1.7-1.6 2.6-3.9 2.6-6.7zM12 21c2.4 0 4.5-.8 6-2.1L15 16.6c-.8.6-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.4A9 9 0 0 0 12 21zM7 13.8a5.4 5.4 0 0 1 0-3.6V7.8H4a9 9 0 0 0 0 8.4l3-2.4zM12 6.5c1.3 0 2.5.5 3.4 1.3L18 5.2A8.7 8.7 0 0 0 4 7.8l3 2.4c.7-2.1 2.7-3.7 5-3.7z" fill="currentColor" /></svg>;
  }

  if (value.includes("microsoft")) {
    return <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" fill="currentColor"/></svg>;
  }

  if (value.includes("meta")) {
    return <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16c1.4-5.2 3.5-8 5.6-8 2.4 0 4 4 5.2 6.4C15 16.8 16 18 17.2 18c1.6 0 2.9-2.5 3.8-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/></svg>;
  }

  if (value.includes("anthropic")) {
    return <svg className="tag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20 11.2 4h1.7L19 20h-3.1l-1.4-4H9.3l-1.4 4H5zm5.2-6.7h3.4L12 8.5l-1.8 4.8z" fill="currentColor"/></svg>;
  }

  return null;
}

export function DigestView({ digest }: { digest: Digest }) {
  const items = [...digest.items].sort((a, b) => {
    const aPinned = isGitHubTrending(a) ? 1 : 0;
    const bPinned = isGitHubTrending(b) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return a.sort_order - b.sort_order;
  });

  return (
    <article className="digest">
      <header className="digest-header">
        <div className="issue-line">
          <span className="eyebrow">DAILY TECH BRIEF</span>
          <time dateTime={digest.digest_date}>{formatDate(digest.digest_date)}</time>
        </div>
        <h1>{digest.title}</h1>
        {digest.intro && <p className="intro">{digest.intro}</p>}
        <div className="reading-meta">
          <span>{digest.items.length} 条资讯</span>
          <span>约 {Math.max(3, Math.ceil(digest.items.length * 0.35))} 分钟阅读</span>
        </div>
      </header>

      <CodexResetStatus />

      <div className="news-list">
        {items.map((item, index) => {
          const pinned = isGitHubTrending(item);

          return (
            <section
              className={`news-item${pinned ? " pinned-item" : ""}`}
              key={item.id}
            >
              <div className="news-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="news-content">
                <div className="news-heading">
                  <h2>
                    <a
                      className="news-title-link"
                      href={item.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                    <a
                      className="source-link"
                      href={item.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.source_name} <span aria-hidden="true">↗</span>
                    </a>
                  </h2>
                  <div className="news-tags">
                    {pinned && <span className="pinned-tag">置顶</span>}
                    {item.category && (
                      <span className="category-tag">
                        <BrandIcon label={item.category} />
                        <span>{item.category}</span>
                      </span>
                    )}
                    {item.is_rumor && <span className="rumor">传闻</span>}
                  </div>
                </div>
                <p>{item.summary}</p>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
