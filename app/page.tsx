import { DigestView } from "@/components/digest-view";
import { FeedSwitcher } from "@/components/feed-switcher";
import { digestToPlainText } from "@/lib/digest-text";
import { getLatestDigest } from "@/lib/news";

function EmptyState({ type }: { type: string }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">BYTEBRIEF</p>
      <h1>今天的{type}正在路上</h1>
      <p>新一期发布后会自动出现在这里。</p>
    </section>
  );
}

export default async function HomePage() {
  const [developerDigest, techDigest] = await Promise.all([
    getLatestDigest("developer"),
    getLatestDigest("tech"),
  ]);

  return (
    <main>
      <FeedSwitcher
        developerCopyText={digestToPlainText(developerDigest)}
        techCopyText={digestToPlainText(techDigest)}
        developer={
          developerDigest ? (
            <DigestView digest={developerDigest} />
          ) : (
            <EmptyState type="开发者资讯" />
          )
        }
        tech={
          techDigest ? (
            <DigestView digest={techDigest} />
          ) : (
            <EmptyState type="科技资讯" />
          )
        }
      />
    </main>
  );
}
