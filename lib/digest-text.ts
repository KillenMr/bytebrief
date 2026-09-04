import type { Digest } from "./types";

export function digestToPlainText(digest: Digest | null): string {
  if (!digest) return "";

  const items = [...digest.items]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => `${item.title}\n${item.summary}`);

  return [digest.title, ...items].join("\n\n");
}
