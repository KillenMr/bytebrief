"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Feed = "developer" | "tech";

type CopyState = {
  feed: Feed | null;
  count: number;
};

export function FeedSwitcher({
  developer,
  tech,
  developerCopyText = "",
  techCopyText = "",
}: {
  developer: ReactNode;
  tech: ReactNode;
  developerCopyText?: string;
  techCopyText?: string;
}) {
  const [feed, setFeed] = useState<Feed>("developer");
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const copyState = useRef<CopyState>({ feed: null, count: 0 });
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.location.hash === "#tech") setFeed("tech");
    if (window.location.hash === "#developer") setFeed("developer");

    return () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  function selectFeed(nextFeed: Feed) {
    setFeed(nextFeed);
    const hash = nextFeed === "tech" ? "#tech" : "#developer";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  }

  async function handleFeedClick(nextFeed: Feed) {
    selectFeed(nextFeed);

    const nextCount = copyState.current.feed === nextFeed ? copyState.current.count + 1 : 1;
    copyState.current = { feed: nextFeed, count: nextCount };

    if (nextCount < 6) return;

    copyState.current = { feed: null, count: 0 };
    const text = nextFeed === "developer" ? developerCopyText : techCopyText;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice(nextFeed === "developer" ? "开发者资讯已复制" : "科技资讯已复制");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopyNotice(nextFeed === "developer" ? "开发者资讯已复制" : "科技资讯已复制");
    }

    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setCopyNotice(null), 1600);
  }

  return (
    <>
      <div className="feed-switch-wrap">
        <div className="feed-switch-heading">
          <span>NEWS FEED</span>
          <small>选择你想看的资讯流</small>
        </div>
        <div className="feed-switch" role="tablist" aria-label="资讯类型">
          <button
            type="button"
            role="tab"
            aria-selected={feed === "developer"}
            className={`feed-option feed-option--developer${feed === "developer" ? " active" : ""}`}
            onClick={() => void handleFeedClick("developer")}
          >
            <span className="feed-option-mark" aria-hidden="true" />
            <span className="feed-option-copy">
              <strong>开发者资讯</strong>
              <small>DEV · CODE · TOOLS</small>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={feed === "tech"}
            className={`feed-option feed-option--tech${feed === "tech" ? " active" : ""}`}
            onClick={() => void handleFeedClick("tech")}
          >
            <span className="feed-option-mark" aria-hidden="true" />
            <span className="feed-option-copy">
              <strong>科技资讯</strong>
              <small>TECH · AI · INDUSTRY</small>
            </span>
          </button>
        </div>
        {copyNotice && <span className="feed-copy-notice" role="status">{copyNotice}</span>}
      </div>

      <div
        className="feed-panel feed-panel--developer"
        role="tabpanel"
        hidden={feed !== "developer"}
      >
        {developer}
      </div>
      <div
        className="feed-panel feed-panel--tech"
        role="tabpanel"
        hidden={feed !== "tech"}
      >
        {tech}
      </div>
    </>
  );
}
