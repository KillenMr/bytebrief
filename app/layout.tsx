import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBrief｜每日科技速览",
  description: "每天几分钟，读懂值得关注的科技变化。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <span>ByteBrief</span>
          <span>每天几分钟，读懂科技变化。</span>
        </footer>
      </body>
    </html>
  );
}
