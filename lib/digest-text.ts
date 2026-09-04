import type { Digest } from "./types";

export function digestToPlainText(digest: Digest | null): string {
  if (!digest) return "";

  const items = [...digest.items]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((item, index) => [
      `${String(index + 1).padStart(2, "0")} ${item.title}`,
      item.summary,
    ]);

  return [digest.title, ...items].join("\n");
}
