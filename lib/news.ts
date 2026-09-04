import type { Digest, NewsFeed, NewsItem } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  "https://sxakjynxteoplnvbpumd.supabase.co";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  "sb_publishable_gofdX5mzFQAW0wymQzxo8w_JRKGJ71i";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const projectIds: Record<NewsFeed, string> = {
  developer:
    process.env.NEXT_PUBLIC_DEVELOPER_NEWS_PROJECT_ID?.trim() ||
    "d01a3368-85e9-4cb4-991c-35c921264cf0",
  tech:
    process.env.NEXT_PUBLIC_TECH_NEWS_PROJECT_ID?.trim() ||
    "e061ca5e-851a-4a1d-915b-6b5e46b76af4",
};

function getProjectId(feed: NewsFeed) {
  return projectIds[feed];
}

async function query<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    ...(isGitHubPages ? {} : { next: { revalidate: 300 } }),
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function attachItems(
  digests: Omit<Digest, "items">[],
  feed: NewsFeed,
): Promise<Digest[]> {
  if (digests.length === 0) return [];

  const ids = digests.map((digest) => digest.id).join(",");
  const projectId = getProjectId(feed);
  const items = await query<NewsItem[]>(
    `tech_news_items?select=*&project_id=eq.${projectId}&digest_id=in.(${ids})&order=sort_order.asc`,
  );

  return digests.map((digest) => ({
    ...digest,
    items: items.filter((item) => item.digest_id === digest.id),
  }));
}

export async function getLatestDigest(
  feed: NewsFeed = "developer",
): Promise<Digest | null> {
  const projectId = getProjectId(feed);
  const digests = await query<Omit<Digest, "items">[]>(
    `tech_daily_digests?select=id,project_id,digest_date,title,intro,status,published_at&project_id=eq.${projectId}&status=eq.published&order=digest_date.desc&limit=1`,
  );
  return (await attachItems(digests, feed))[0] ?? null;
}

export async function getDigestByDate(
  date: string,
  feed: NewsFeed = "developer",
): Promise<Digest | null> {
  const projectId = getProjectId(feed);
  const digests = await query<Omit<Digest, "items">[]>(
    `tech_daily_digests?select=id,project_id,digest_date,title,intro,status,published_at&project_id=eq.${projectId}&status=eq.published&digest_date=eq.${encodeURIComponent(date)}&limit=1`,
  );
  return (await attachItems(digests, feed))[0] ?? null;
}

export async function getArchive(
  feed: NewsFeed = "developer",
): Promise<Omit<Digest, "items">[]> {
  const projectId = getProjectId(feed);
  return query<Omit<Digest, "items">[]>(
    `tech_daily_digests?select=id,project_id,digest_date,title,intro,status,published_at&project_id=eq.${projectId}&status=eq.published&order=digest_date.desc&limit=30`,
  );
}

export async function getPublishedDigestCount(
  feed: NewsFeed = "developer",
): Promise<number> {
  const projectId = getProjectId(feed);
  const response = await fetch(
    `${baseUrl}/rest/v1/tech_daily_digests?select=id&project_id=eq.${projectId}&status=eq.published`,
    {
      method: "HEAD",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
        Prefer: "count=exact",
      },
      ...(isGitHubPages ? {} : { next: { revalidate: 300 } }),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase count request failed: ${response.status}`);
  }

  const contentRange = response.headers.get("content-range");
  const total = contentRange?.split("/").at(-1);
  return total && total !== "*" ? Number(total) : 0;
}
