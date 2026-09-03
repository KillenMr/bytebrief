import type { Digest, NewsItem } from "@/lib/types";

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

function getTagLogo(label: string) {
  const value = label.toLowerCase();
  if (value.includes("apple")) return "";
  if (value.includes("github")) return "GH";
  if (value.includes("openai")) return "◎";
  if (value.includes("google")) return "G";
  if (value.includes("microsoft")) return "MS";
  if (value.includes("meta")) return "M";
  if (value.includes("anthropic")) return "A";
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

      <div className="news-list">
        {items.map((item, index) => {
          const tagLogo = item.category ? getTagLogo(item.category) : null;
          const pinned = isGitHubTrending(item);

          return (
            <section className={`news-item${pinned ? " pinned-item" : ""}`} key={item.id}>
              <div className="news-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="news-content">
                <div className="news-tags">
                  {pinned && <span className="pinned-tag">PIN</span>}
                  {item.category && (
                    <span className="category-tag">
                      {tagLogo && <b className="tag-logo" aria-hidden="true">{tagLogo}</b>}
                      {item.category}
                    </span>
                  )}
                  {item.is_rumor && <span className="rumor">传闻</span>}
                </div>
                <h2>
                  <a className="news-title-link" href={item.source_url} target="_blank" rel="noreferrer">
                    {item.title}<span className="title-arrow" aria-hidden="true"> ↗</span>
                  </a>
                </h2>
                <p>{item.summary}</p>
                <a className="source-link" href={item.source_url} target="_blank" rel="noreferrer">
                  {item.source_name} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
