export type NewsItem = {
  id: string;
  digest_id: string;
  sort_order: number;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  source_published_at: string | null;
  category: string | null;
  importance: number | null;
  is_rumor: boolean;
};

export type Digest = {
  id: string;
  digest_date: string;
  title: string;
  intro: string | null;
  status: "draft" | "published";
  published_at: string | null;
  items: NewsItem[];
};
