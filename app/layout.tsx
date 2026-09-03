import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBrief｜每日科技速览",
  description: "每天几分钟，读懂值得关注的科技变化。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const wechatQrUrl = process.env.NEXT_PUBLIC_WECHAT_QR_URL?.trim();

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
        <footer>
          <div className="footer-copy">
            <span>ByteBrief</span>
            <span>每天几分钟，读懂科技变化。</span>
          </div>
          {wechatQrUrl && (
            <div className="wechat-follow">
              <div>
                <strong>公众号</strong>
                <span>扫码关注 ByteBrief</span>
              </div>
              <img src={wechatQrUrl} alt="ByteBrief 公众号二维码" width="92" height="92" loading="lazy" />
            </div>
          )}
        </footer>
      </body>
    </html>
  );
}
