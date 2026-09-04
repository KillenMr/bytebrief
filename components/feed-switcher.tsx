"use client";

import { useState, type ReactNode } from "react";

export function FeedSwitcher({
  developer,
  tech,
}: {
  developer: ReactNode;
  tech: ReactNode;
}) {
  const [feed, setFeed] = useState<"developer" | "tech">("developer");

  return (
    <>
      <div className="feed-switch-wrap">
        <div className="feed-switch" role="tablist" aria-label="资讯类型">
          <button
            type="button"
            role="tab"
            aria-selected={feed === "developer"}
            className={feed === "developer" ? "active" : ""}
            onClick={() => setFeed("developer")}
          >
            开发者资讯
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={feed === "tech"}
            className={feed === "tech" ? "active" : ""}
            onClick={() => setFeed("tech")}
          >
            科技资讯
          </button>
        </div>
      </div>

      <div role="tabpanel" hidden={feed !== "developer"}>
        {developer}
      </div>
      <div role="tabpanel" hidden={feed !== "tech"}>
        {tech}
      </div>
    </>
  );
}
