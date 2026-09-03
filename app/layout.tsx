import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBrief｜每日科技速览",
  description: "每天几分钟，读懂值得关注的科技变化。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const basePath = isGitHubPages ? "/bytebrief" : "";
  const localQr = `${basePath}/assets/images/qrcode_for_gh_b6ee187cb83c_258.jpg`;
  const localBadge = `${basePath}/assets/images/gongzhonghao.png`;
  const wechatQrUrl = process.env.NEXT_PUBLIC_WECHAT_QR_URL?.trim() || localQr;
  const wechatBadgeUrl = process.env.NEXT_PUBLIC_WECHAT_BADGE_URL?.trim() || localBadge;
  const wechatAccountUrl = process.env.NEXT_PUBLIC_WECHAT_ACCOUNT_URL?.trim();

  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="ByteBrief 首页">
            <span className="brand-mark">B</span>
            <span>ByteBrief</span>
          </Link>
          <nav aria-label="主导航">
            <Link href="/archive">往期</Link>
          </nav>
        </header>
        {children}

        <a
          className="wechat-float"
          href={wechatAccountUrl || wechatQrUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="关注 ByteBrief 公众号"
        >
          <img className="wechat-badge" src={wechatBadgeUrl} alt="公众号" />
          <span className="wechat-qr-popover">
            <img src={wechatQrUrl} alt="ByteBrief 公众号二维码" loading="lazy" />
            <small>微信扫码关注</small>
          </span>
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
