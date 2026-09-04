import Link from "next/link";
import { getArchive } from "@/lib/news";
import type { Digest } from "@/lib/types";

export const metadata = { title: "往期简报｜ByteBrief" };

type ArchiveDigest = Omit<Digest, "items">;

type ArchiveDay = {
  date: string;
  developer?: ArchiveDigest;
  tech?: ArchiveDigest;
};

function mergeByDate(
  developerDigests: ArchiveDigest[],
  techDigests: ArchiveDigest[],
): ArchiveDay[] {
  const days = new Map<string, ArchiveDay>();

  for (const digest of developerDigests) {
    days.set(digest.digest_date, {
      ...(days.get(digest.digest_date) ?? { date: digest.digest_date }),
      developer: digest,
    });
  }

  for (const digest of techDigests) {
    days.set(digest.digest_date, {
      ...(days.get(digest.digest_date) ?? { date: digest.digest_date }),
      tech: digest,
    });
  }

  return [...days.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export default async function ArchivePage() {
  const [developerDigests, techDigests] = await Promise.all([
    getArchive("developer"),
    getArchive("tech"),
  ]);
  const days = mergeByDate(developerDigests, techDigests);

  return (
    <main className="archive-page archive-page--combined">
      <header>
        <p className="eyebrow">ARCHIVE</p>
        <h1>往期简报</h1>
        <p>已收录 {days.length} 期 · 每期同时展示开发者资讯与科技资讯。</p>
      </header>

      <div className="archive-days">
        {days.map((day, index) => (
          <section className="archive-day" key={day.date}>
            <div className="archive-day-meta">
              <span className="archive-index">#{String(index + 1).padStart(2, "0")}</span>
              <time>{day.date}</time>
            </div>

            <div className="archive-day-feeds">
              {day.developer && (
                <Link
                  className="archive-feed-card archive-feed-card--developer"
                  href={`/news/${day.date}#developer`}
                >
                  <span className="archive-feed-label">开发者资讯</span>
                  <strong>{day.developer.title}</strong>
                  <span className="archive-arrow" aria-hidden="true">→</span>
                </Link>
              )}

              {day.tech && (
                <Link
                  className="archive-feed-card archive-feed-card--tech"
                  href={`/news/${day.date}#tech`}
                >
                  <span className="archive-feed-label">科技资讯</span>
                  <strong>{day.tech.title}</strong>
                  <span className="archive-arrow" aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
