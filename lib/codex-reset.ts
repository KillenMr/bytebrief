const STATUS_URL = "https://www.codexrunway.com/api/status.json";
const STATUS_PAGE_URL = "https://www.codexrunway.com/zh.html";
const TIME_ZONE = "Asia/Shanghai";

type ResetEvent = {
  kind: "reset_completed" | "reset_scheduled" | string;
  resetType?: string;
  announcedAt: string;
  effectiveAt?: string | null;
  source?: {
    handle?: string;
    url?: string;
  };
  scope?: {
    plans?: string[];
    windows?: string[];
  };
  confidence?: number;
  text?: string;
};

type StatusFeed = {
  generatedAt: string;
  monitor?: { status?: string };
  events?: ResetEvent[];
};

export type CodexResetStatus = {
  state: "completed" | "scheduled" | "none" | "unavailable";
  headline: string;
  detail: string;
  updatedAt?: string;
  sourcePageUrl: string;
  post?: {
    text: string;
    author: string;
    url: string;
    announcedAt: string;
  };
};

function dateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function eventDate(event: ResetEvent) {
  return event.effectiveAt || event.announcedAt;
}

function formatResetType(value?: string) {
  return value === "global" ? "全局重置" : "额度重置";
}

function toPost(event?: ResetEvent): CodexResetStatus["post"] {
  if (!event?.text || !event.source?.url) return undefined;
  return {
    text: event.text,
    author: event.source.handle ? `@${event.source.handle}` : "CodexRunway",
    url: event.source.url,
    announcedAt: event.announcedAt,
  };
}

export async function getCodexResetStatus(): Promise<CodexResetStatus> {
  try {
    const response = await fetch(STATUS_URL, {
      ...(process.env.GITHUB_PAGES === "true"
        ? {}
        : { next: { revalidate: 300 } }),
    });

    if (!response.ok) throw new Error(`CodexRunway request failed: ${response.status}`);

    const feed = (await response.json()) as StatusFeed;
    if (feed.monitor?.status && feed.monitor.status !== "ok") {
      throw new Error("CodexRunway monitor is unavailable");
    }

    const events = [...(feed.events ?? [])].sort(
      (a, b) => Date.parse(eventDate(b)) - Date.parse(eventDate(a)),
    );
    const today = dateKey(new Date().toISOString());
    const completedToday = events.find(
      (event) => event.kind === "reset_completed" && dateKey(eventDate(event)) === today,
    );
    const scheduledToday = events.find(
      (event) => event.kind === "reset_scheduled" && dateKey(eventDate(event)) === today,
    );
    const latestCompleted = events.find((event) => event.kind === "reset_completed");

    if (completedToday) {
      return {
        state: "completed",
        headline: "今日已重置",
        detail: formatResetType(completedToday.resetType),
        updatedAt: feed.generatedAt,
        sourcePageUrl: STATUS_PAGE_URL,
        post: toPost(completedToday),
      };
    }

    if (scheduledToday) {
      return {
        state: "scheduled",
        headline: "今日预计重置",
        detail: `${formatResetType(scheduledToday.resetType)} · ${Math.round((scheduledToday.confidence ?? 0) * 100)}% 可信度`,
        updatedAt: feed.generatedAt,
        sourcePageUrl: STATUS_PAGE_URL,
        post: toPost(scheduledToday),
      };
    }

    const daysSince = latestCompleted
      ? Math.max(0, Math.floor((Date.now() - Date.parse(eventDate(latestCompleted))) / 86_400_000))
      : null;

    return {
      state: "none",
      headline: "今日暂无重置",
      detail: daysSince === null ? "暂无最近重置记录" : `距上次${formatResetType(latestCompleted?.resetType)} ${daysSince} 天`,
      updatedAt: feed.generatedAt,
      sourcePageUrl: STATUS_PAGE_URL,
      post: toPost(latestCompleted),
    };
  } catch {
    return {
      state: "unavailable",
      headline: "状态暂不可用",
      detail: "数据源暂时无法访问，请稍后重试",
      sourcePageUrl: STATUS_PAGE_URL,
    };
  }
}
