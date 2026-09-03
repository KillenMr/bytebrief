import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-state">
      <p className="eyebrow">404</p>
      <h1>这期简报还不存在</h1>
      <Link className="back-link" href="/">返回最新一期</Link>
    </main>
  );
}
