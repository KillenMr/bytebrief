# ByteBrief

一个使用 Next.js 和 Supabase 构建的每日科技简报网站。

## 本地运行

1. 复制 `.env.example` 为 `.env.local` 并填写 Supabase 项目 URL 和 publishable key。
2. 安装依赖：`npm install`
3. 启动开发环境：`npm run dev`

## 部署到 Vercel

在 Vercel 导入仓库，并配置：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

随后使用默认 Next.js 构建配置部署。
