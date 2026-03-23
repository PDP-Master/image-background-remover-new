# 🖼️ Image Background Remover

使用 Next.js + Tailwind CSS + remove.bg API 搭建的 AI 背景去除工具。

## 功能

- ✅ 上传图片自动去背景（点击/拖拽）
- ✅ 实时预览对比
- ✅ 支持 PNG、JPG、WebP
- ✅ 一键下载结果

## 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **API**: remove.bg
- **部署**: Vercel / Cloudflare

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/PDP-Master/image-background-remover-new.git
cd image-background-remover-new/frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的 remove.bg API Key
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

或推送 GitHub 后在 Vercel 后台导入项目。

## remove.bg API

- 免费额度：50次/月
- 申请地址：https://www.remove.bg/api

## 项目结构

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/remove-bg/route.ts  # API 路由
│   │   ├── page.tsx                # 主页面
│   │   └── layout.tsx              # 布局
│   └── globals.css                 # 全局样式
├── .env.example                    # 环境变量示例
├── package.json
└── tailwind.config.ts
```
