# 🍼 牛牛的成长记录

一个用于记录并展示牛牛成长记录的网站，支持文字+图片记录，按时间倒序展示。

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **后端服务**: Supabase (PostgreSQL + 文件存储)
- **部署**: GitHub Pages

## 快速开始

### 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com)，点击 "Start your project"
2. 用 GitHub 登录，创建新项目
3. 在 **SQL Editor** 中运行 `sql/init.sql` 脚本
4. 在 **Settings > API** 中复制 `Project URL` 和 `anon public key`
5. 在 **Storage** 中确认 `images` bucket 已创建并设为 public

### 2. 配置环境变量

在项目根目录创建 `.env` 文件:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 本地开发

```bash
npm install
npm run dev
```

### 4. 部署到 GitHub Pages

1. 在仓库 **Settings > Pages** 中，Source 选 **GitHub Actions**
2. 在 **Settings > Secrets and variables > Actions** 中添加:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 推送代码到 `main` 分支，自动触发部署

## 使用说明

- **添加记录**: 点击首页「➕ 添加记录」按钮，弹出表单填写标题、描述、图片、记录人和时间，输入密码 `0711` 保存
- **编辑记录**: 进入详情页点击「✏️ 编辑」，修改后输入密码保存
- **删除记录**: 进入详情页点击「🗑️ 删除」，输入密码确认
- **年度筛选**: 使用 ◀ ▶ 箭头或下拉框切换年份，默认显示当年
- **查看图片**: 点击图片可放大查看
