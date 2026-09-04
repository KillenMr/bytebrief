import Link from "next/link";
import { FeedSwitcher } from "@/components/feed-switcher";
import { getArchive } from "@/lib/news";
import type { Digest } from "@/lib/types";

export const metadata = { title: "往期简报｜ByteBrief" };

function ArchiveList({ digests }: { digests: Omit<Digest, "items">[] }) {
  return (
    <div className="archive-list">
      {digests.map((digest, index) => (
        <Link href={`/news/${digest.digest_date}`} key={digest.id}>
          <span className="archive-index">#{String(index + 1).padStart(2, "0")}</span>
          <time>{digest.digest_date}</time>
          <strong>{digest.title}</strong>
          <span className="archive-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

function ArchiveSection({
  digests,
  label,
}: {
  digests: Omit<Digest, "items">[];
  label: string;
}) {
  return (
    <section className="archive-page">
      <header>
        <p className="eyebrow">ARCHIVE</p>
        <h1>往期简报</h1>
        <p>已收录 {digests.length} 期 {label} · 回看每天真正值得关注的科技变化。</p>
      </header>
      <ArchiveList digests={digests} />
    </section>
  );
}

export default async function ArchivePage() {
  const [developerDigests, techDigests] = await Promise.all([
    getArchive("developer"),
    getArchive("tech"),
  ]);

  return (
    <main>
      <FeedSwitcher
        developer={<ArchiveSection digests={developerDigests} label="开发者资讯" />}
        tech={<ArchiveSection digests={techDigests} label="科技资讯" />}
      />
    </main>
  );
}
