import { getCodexResetStatus } from "@/lib/codex-reset";

const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
});

const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
});

export async function CodexResetStatus() {
  const status = await getCodexResetStatus();

  return (
    <aside className={`reset-status reset-status--${status.state}`} aria-labelledby="reset-status-title">
      <header className="reset-status-header">
        <div>
          <span className="reset-status-eyebrow">CODEX RESET WATCH</span>
          <h2 id="reset-status-title">
            <a href={status.sourcePageUrl} target="_blank" rel="noreferrer">
              Codex 今天是否有重置？ <span aria-hidden="true">↗</span>
            </a>
          </h2>
        </div>
        <p className="reset-status-verdict">
          <span className="reset-status-dot" aria-hidden="true" />
          {status.headline}
        </p>
      </header>

      <div className="reset-status-body">
        <div className="reset-status-summary">
          <span>当前状态</span>
          <p className="reset-status-detail">{status.detail}</p>
        </div>

        {status.post && (
          <a className="reset-post" href={status.post.url} target="_blank" rel="noreferrer">
            <span className="reset-post-label">最近相关动态</span>
            <blockquote>{status.post.text}</blockquote>
            <span className="reset-post-meta">
              {status.post.author} · {dateTimeFormatter.format(new Date(status.post.announcedAt))}
              <b aria-hidden="true">查看原文 ↗</b>
            </span>
          </a>
        )}
      </div>

      <div className="reset-status-footer">
        <span>数据来源：CodexRunway</span>
        {status.updatedAt && (
          <time dateTime={status.updatedAt}>更新于 {timeFormatter.format(new Date(status.updatedAt))}</time>
        )}
      </div>
    </aside>
  );
}
