import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DigestView } from "@/components/digest-view";
import { FeedSwitcher } from "@/components/feed-switcher";
import { getArchive, getDigestByDate } from "@/lib/news";

type Props = { params: Promise<{ date: string }> };

export async function generateStaticParams() {
  const [developerDigests, techDigests] = await Promise.all([
    getArchive("developer"),
    getArchive("tech"),
  ]);
  const dates = new Set([
    ...developerDigests.map((digest) => digest.digest_date),
    ...techDigests.map((digest) => digest.digest_date),
  ]);
  return [...dates].map((date) => ({ date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const digest =
    (await getDigestByDate(date, "developer")) ??
    (await getDigestByDate(date, "tech"));
  return digest
    ? { title: `${digest.title}｜ByteBrief`, description: digest.intro ?? undefined }
    : { title: "未找到简报｜ByteBrief" };
}

export default async function DigestPage({ params }: Props) {
  const { date } = await params;
  const [developerDigest, techDigest] = await Promise.all([
    getDigestByDate(date, "developer"),
    getDigestByDate(date, "tech"),
  ]);

  if (!developerDigest && !techDigest) notFound();

  const unavailable = (
    <section className="empty-state">
      <p className="eyebrow">BYTEBRIEF</p>
      <h1>这一天暂无对应简报</h1>
      <p>可以切换另一类资讯查看。</p>
    </section>
  );

  return (
    <main>
      <FeedSwitcher
        developer={developerDigest ? <DigestView digest={developerDigest} /> : unavailable}
        tech={techDigest ? <DigestView digest={techDigest} /> : unavailable}
      />
    </main>
  );
}
