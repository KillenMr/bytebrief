import type { Digest } from "@/lib/types";

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

export function DigestView({ digest }: { digest: Digest }) {
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
        {digest.items.map((item, index) => (
          <section className="news-item" key={item.id}>
            <div className="news-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="news-content">
              <div className="news-tags">
                {item.category && <span>{item.category}</span>}
                {item.is_rumor && <span className="rumor">传闻</span>}
              </div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <a href={item.source_url} target="_blank" rel="noreferrer">
                {item.source_name} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
