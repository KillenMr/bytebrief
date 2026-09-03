import { DigestView } from "@/components/digest-view";
import { getLatestDigest } from "@/lib/news";

export default async function HomePage() {
  const digest = await getLatestDigest();

  return (
    <main>
      {digest ? (
        <DigestView digest={digest} />
      ) : (
        <section className="empty-state">
          <p className="eyebrow">BYTEBRIEF</p>
          <h1>今天的科技简报正在路上</h1>
          <p>新一期发布后会自动出现在这里。</p>
        </section>
      )}
    </main>
  );
}
