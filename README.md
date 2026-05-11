# 🍼 牛牛的成长记录

一个用于记录并展示牛牛成长记录的网站，支持文字+图片记录，按时间倒序展示。

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **后端服务**: Supabase (PostgreSQL + 文件存储 + 认证)
- **部署**: GitHub Pages

## 项目结构

```
src/
├── lib/supabase.ts          # Supabase 客户端
├── types/index.ts           # TypeScript 类型
├── hooks/
│   ├── useAuth.tsx          # 认证 Hook
│   └── useRecords.ts        # 记录 CRUD Hook
├── components/
│   ├── Header.tsx           # 顶部导航栏
│   ├── RecordCard.tsx       # 记录卡片
│   ├── RecordForm.tsx       # 记录表单
│   ├── FilterBar.tsx        # 筛选栏（按添加人）
│   └── ProtectedRoute.tsx   # 路由守卫
├── pages/
│   ├── HomePage.tsx         # 首页时间线
│   ├── AddRecordPage.tsx    # 添加记录
│   ├── RecordDetailPage.tsx # 记录详情
│   └── LoginPage.tsx        # 登录/注册
├── App.tsx
└── main.tsx
```

## 快速开始

### 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com)，点击 "Start your project"
2. 用 GitHub 登录，创建新项目
3. 记下 Project URL 和 anon/public key（在 Settings > API 中）

### 2. 初始化数据库

在 Supabase Dashboard 中打开 **SQL Editor**，运行 `sql/init.sql` 中的所有 SQL 语句。

### 3. 配置环境变量

将 `.env.example` 重命名为 `.env`，填入你的 Supabase 信息:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 本地开发

```bash
npm install
npm run dev
```

### 5. 部署到 GitHub Pages

1. 在 GitHub 仓库设置中启用 GitHub Pages（Settings > Pages > Source: GitHub Actions）
2. 在 GitHub 仓库中设置 Secrets（Settings > Secrets and variables > Actions）:
   - `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥
3. 推送代码到 `main` 分支，GitHub Actions 将自动构建并部署

## 使用说明

- **浏览记录**: 无需登录，访问首页即可查看所有成长记录
- **按人筛选**: 点击筛选按钮可按「全部/爸爸/妈妈/牛牛」筛选
- **添加记录**: 需要注册/登录账号，填写标题、描述、上传图片、选择成长时间和添加人
- **查看详情**: 点击记录卡片查看大图和完整内容
