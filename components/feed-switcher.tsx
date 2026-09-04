"use client";

import { useEffect, useState, type ReactNode } from "react";

export function FeedSwitcher({
  developer,
  tech,
}: {
  developer: ReactNode;
  tech: ReactNode;
}) {
  const [feed, setFeed] = useState<"developer" | "tech">("developer");

  useEffect(() => {
    if (window.location.hash === "#tech") setFeed("tech");
    if (window.location.hash === "#developer") setFeed("developer");
  }, []);

  function selectFeed(nextFeed: "developer" | "tech") {
    setFeed(nextFeed);
    const hash = nextFeed === "tech" ? "#tech" : "#developer";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
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
            onClick={() => selectFeed("developer")}
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
            onClick={() => selectFeed("tech")}
          >
            <span className="feed-option-mark" aria-hidden="true" />
            <span className="feed-option-copy">
              <strong>科技资讯</strong>
              <small>TECH · AI · INDUSTRY</small>
            </span>
          </button>
        </div>
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
