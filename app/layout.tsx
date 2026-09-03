import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedDigestCount } from "@/lib/news";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBrief｜每日科技速览",
  description: "每天几分钟，读懂值得关注的科技变化。",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const basePath = isGitHubPages ? "/bytebrief" : "";
  const localQr = `${basePath}/assets/images/qrcode_for_gh_b6ee187cb83c_258.jpg`;
  const wechatQrUrl = process.env.NEXT_PUBLIC_WECHAT_QR_URL?.trim() || localQr;
  const wechatAccountUrl = process.env.NEXT_PUBLIC_WECHAT_ACCOUNT_URL?.trim();
  const digestCount = await getPublishedDigestCount();

  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="ByteBrief 首页">
            <span className="brand-mark">B</span>
            <span>ByteBrief</span>
          </Link>
          <nav aria-label="主导航">
            <Link href="/archive">往期 <span>{digestCount}</span></Link>
          </nav>
        </header>
        {children}

        <a
          className="wechat-float"
          href={wechatAccountUrl || wechatQrUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="关注公众号科技日讯"
        >
          <img src={wechatQrUrl} alt="科技日讯公众号二维码" loading="lazy" />
          <span><small>公众号</small><strong>科技日讯</strong></span>
        </a>

        <footer>
          <div className="footer-copy">
            <span>ByteBrief</span>
            <span>每天几分钟，读懂科技变化。</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
