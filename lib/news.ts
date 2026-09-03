import type { Digest, NewsItem } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://sxakjynxteoplnvbpumd.supabase.co";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_gofdX5mzFQAW0wymQzxo8w_JRKGJ71i";

async function query<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function attachItems(digests: Omit<Digest, "items">[]): Promise<Digest[]> {
  if (digests.length === 0) return [];

  const ids = digests.map((digest) => digest.id).join(",");
  const items = await query<NewsItem[]>(
    `tech_news_items?select=*&digest_id=in.(${ids})&order=sort_order.asc`,
  );

  return digests.map((digest) => ({
    ...digest,
    items: items.filter((item) => item.digest_id === digest.id),
  }));
}

export async function getLatestDigest(): Promise<Digest | null> {
  const digests = await query<Omit<Digest, "items">[]>(
    "tech_daily_digests?select=id,digest_date,title,intro,status,published_at&status=eq.published&order=digest_date.desc&limit=1",
  );
  return (await attachItems(digests))[0] ?? null;
}

export async function getDigestByDate(date: string): Promise<Digest | null> {
  const digests = await query<Omit<Digest, "items">[]>(
    `tech_daily_digests?select=id,digest_date,title,intro,status,published_at&status=eq.published&digest_date=eq.${encodeURIComponent(date)}&limit=1`,
  );
  return (await attachItems(digests))[0] ?? null;
}

export async function getArchive(): Promise<Omit<Digest, "items">[]> {
  return query<Omit<Digest, "items">[]>(
    "tech_daily_digests?select=id,digest_date,title,intro,status,published_at&status=eq.published&order=digest_date.desc&limit=30",
  );
}
