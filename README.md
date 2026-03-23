# 🖼️ BGRemover - AI 背景去除工具

使用 Cloudflare Pages + remove.bg API 搭建的在线背景去除工具。

## 功能

- ✅ 上传图片自动去背景
- ✅ 实时预览对比
- ✅ 支持 PNG、JPG、WebP
- ✅ 内存处理，无需存储

## 技术栈

- **前端**: HTML + CSS + JavaScript
- **后端**: Cloudflare Workers
- **API**: remove.bg

## 部署到 Cloudflare

### 1. 准备工作

1. 注册 [Cloudflare](https://cloudflare.com)
2. 申请 [remove.bg API Key](https://www.remove.bg/api)（免费额度 50张/月）

### 2. 部署命令

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages project create bg-remover
wrangler pages deploy . --project-name=bg-remover
```

### 3. 设置环境变量

在 Cloudflare 后台添加环境变量：
- `REMOVE_BG_API_KEY`: 你的 remove.bg API Key

或在 `wrangler.toml` 中设置：

```toml
[vars]
REMOVE_BG_API_KEY = "你的API Key"
```

## 本地开发

```bash
# 安装依赖
npm install

# 本地运行（需要 Cloudflare Workers 模拟环境）
wrangler pages dev .
```

## 文件结构

```
BGRemover/
├── index.html      # 前端页面
├── _worker.js      # Cloudflare Worker 后端
├── wrangler.toml   # 部署配置
└── README.md       # 说明文档
```

## 使用

1. 打开部署后的网站
2. 上传或拖拽图片
3. 点击"开始处理"
4. 下载去除背景的图片
