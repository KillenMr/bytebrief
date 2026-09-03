import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DigestView } from "@/components/digest-view";
import { getArchive, getDigestByDate } from "@/lib/news";

type Props = { params: Promise<{ date: string }> };

export async function generateStaticParams() {
  const digests = await getArchive();
  return digests.map((digest) => ({ date: digest.digest_date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const digest = await getDigestByDate(date);
  return digest
    ? { title: `${digest.title}｜ByteBrief`, description: digest.intro ?? undefined }
    : { title: "未找到简报｜ByteBrief" };
}

export default async function DigestPage({ params }: Props) {
  const { date } = await params;
  const digest = await getDigestByDate(date);
  if (!digest) notFound();
  return <main><DigestView digest={digest} /></main>;
}
