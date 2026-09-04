"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

const wrapStyle: CSSProperties = {
  width: "min(900px, calc(100% - 24px))",
  margin: "10px auto -6px",
  display: "flex",
  justifyContent: "flex-end",
};

const groupStyle: CSSProperties = {
  display: "inline-flex",
  gap: 4,
  padding: 3,
  border: "1px solid var(--line)",
  background: "var(--panel)",
};

function buttonStyle(active: boolean): CSSProperties {
  return {
    appearance: "none",
    border: active ? "1px solid var(--accent)" : "1px solid transparent",
    background: active ? "var(--soft-accent)" : "transparent",
    color: active ? "var(--accent)" : "var(--muted)",
    padding: "4px 9px",
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: ".64rem",
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
  };
}

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
      <div style={wrapStyle}>
        <div style={groupStyle} role="tablist" aria-label="资讯类型">
          <button
            type="button"
            role="tab"
            aria-selected={feed === "developer"}
            style={buttonStyle(feed === "developer")}
            onClick={() => setFeed("developer")}
          >
            开发者资讯
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={feed === "tech"}
            style={buttonStyle(feed === "tech")}
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
