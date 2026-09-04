export type NewsFeed = "developer" | "tech";

export type NewsItem = {
  id: string;
  project_id: string;
  digest_id: string;
  sort_order: number;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  original_source_url: string | null;
  source_published_at: string | null;
  category: string | null;
  importance: number | null;
  is_rumor: boolean;
  item_type: "news" | "github_project";
};

export type Digest = {
  id: string;
  project_id: string;
  digest_date: string;
  title: string;
  intro: string | null;
  status: "draft" | "published";
  published_at: string | null;
  items: NewsItem[];
};
