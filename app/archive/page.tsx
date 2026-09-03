import Link from "next/link";
import { getArchive } from "@/lib/news";

export const metadata = { title: "往期简报｜ByteBrief" };

export default async function ArchivePage() {
  const digests = await getArchive();
  return (
    <main className="archive-page">
      <header>
        <p className="eyebrow">ARCHIVE</p>
        <h1>往期简报</h1>
        <p>回看每天真正值得关注的科技变化。</p>
      </header>
      <div className="archive-list">
        {digests.map((digest) => (
          <Link href={`/news/${digest.digest_date}`} key={digest.id}>
            <time>{digest.digest_date}</time>
            <strong>{digest.title}</strong>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
