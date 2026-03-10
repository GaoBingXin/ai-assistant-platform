# Vercel 详细部署指南

## 第1步：创建GitHub仓库

### 1.1 登录GitHub
1. 访问 [github.com](https://github.com)
2. 登录您的账户

### 1.2 创建新仓库
1. 点击右上角 "+" 图标
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `ai-assistant-platform` (或您喜欢的名称)
   - **Description**: 现代化的AI助手平台，集智能对话、图像生成、代码编写于一体
   - 选择 **Public** (公开)
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

## 第2步：推送代码到GitHub

### 2.1 复制仓库URL
创建仓库后，复制GitHub提供的命令，类似：
```
git remote add origin https://github.com/您的用户名/ai-assistant-platform.git
```

### 2.2 在本地推送代码
```bash
# 确保在项目目录中
cd modern-ai-platform

# 添加远程仓库
git remote add origin https://github.com/您的用户名/ai-assistant-platform.git

# 重命名主分支为main（如果当前是master）
git branch -M main

# 推送所有代码
git push -u origin main
```

## 第3步：在Vercel部署

### 3.1 登录Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账户登录

### 3.2 导入项目
1. 点击 "Add New..." → "Project"
2. 从GitHub仓库列表中选择 `ai-assistant-platform`
3. 点击 "Import"

### 3.3 配置项目设置
在项目配置页面：

#### Framework Preset
- **Framework**: Next.js (自动检测)

#### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Environment Variables
点击 "Environment Variables"，添加以下变量：

**必需的环境变量：**
```
DATABASE_URL=postgresql://username:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
OPENAI_API_KEY=sk-...
```

**可选的环境变量（用于OAuth登录）：**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3.4 生成NEXTAUTH_SECRET
在终端运行以下命令生成安全密钥：
```bash
openssl rand -base64 32
```
或访问：https://generate-secret.now.sh/32

### 3.5 部署
1. 点击 "Deploy"
2. 等待构建完成（约2-3分钟）

## 第4步：设置数据库

### 选项A：使用Supabase（推荐，免费）
1. 访问 [supabase.com](https://supabase.com)
2. 注册并创建新项目
3. 获取数据库连接URL：
   - 进入项目设置 → Database → Connection string
   - 选择 **URI** 格式
4. 在Vercel环境变量中设置 `DATABASE_URL`

### 选项B：使用PlanetScale
1. 访问 [planetscale.com](https://planetscale.com)
2. 创建免费账户
3. 创建新数据库
4. 获取连接字符串

### 选项C：使用Neon
1. 访问 [neon.tech](https://neon.tech)
2. 创建免费账户
3. 创建新项目
4. 获取PostgreSQL连接字符串

## 第5步：运行数据库迁移

### 5.1 通过Vercel CLI本地迁移
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取环境变量
vercel env pull .env.local

# 运行迁移
npx prisma db push
```

### 5.2 通过Vercel部署钩子（推荐）
在项目根目录创建 `vercel.json`：
```json
{
  "buildCommand": "npx prisma generate && npm run build"
}
```

或者直接在Vercel项目设置中修改Build Command为：
```
npx prisma generate && npm run build
```

## 第6步：验证部署

### 6.1 检查部署状态
1. 在Vercel仪表板查看部署状态
2. 确保所有检查通过（绿色勾选）

### 6.2 测试应用
1. 访问您的Vercel域名：`https://your-app.vercel.app`
2. 测试功能：
   - 注册/登录
   - AI对话
   - 图像生成
   - 代码生成

## 第7步：配置自定义域名（可选）

### 7.1 添加自定义域名
1. 在Vercel项目设置 → Domains
2. 点击 "Add"
3. 输入您的域名（如：ai.yourdomain.com）
4. 按照指引配置DNS记录

## 故障排除

### 常见问题1：构建失败
**错误**: "Cannot find module '@prisma/client'"
**解决**: 确保Build Command包含 `npx prisma generate`

### 常见问题2：数据库连接失败
**错误**: "Database connection failed"
**解决**: 
1. 检查 `DATABASE_URL` 格式
2. 确保数据库允许Vercel IP访问
3. 对于Supabase：在Settings → Database → Connection Pooling中启用

### 常见问题3：NextAuth错误
**错误**: "NEXTAUTH_URL not set"
**解决**: 确保设置了 `NEXTAUTH_URL` 环境变量

### 常见问题4：OpenAI API错误
**错误**: "Invalid API key"
**解决**: 
1. 检查OpenAI API密钥是否正确
2. 确保账户有足够的额度

## 项目结构回顾

```
modern-ai-platform/
├── app/                    # 所有页面 (Next.js 15 App Router)
│   ├── api/               # API路由
│   ├── auth/              # 登录/注册
│   ├── chat/              # AI对话
│   ├── image/             # 图像生成
│   ├── code/              # 代码生成
│   └── dashboard/         # 用户控制台
├── components/            # 可复用UI组件
├── lib/                   # 工具函数和配置
├── prisma/               # 数据库模型
└── public/               # 静态资源
```

## 后续维护

### 更新代码
```bash
# 本地修改代码后
git add .
git commit -m "更新说明"
git push origin main
# Vercel会自动重新部署
```

### 查看日志
1. 在Vercel仪表板 → Logs
2. 或使用Vercel CLI：
   ```bash
   vercel logs your-app.vercel.app
   ```

### 回滚部署
在Vercel仪表板中，可以快速回滚到之前的版本。

## 技术支持

如果遇到问题：
1. 查看Vercel Logs获取详细错误信息
2. 检查环境变量是否正确
3. 确保数据库连接正常
4. 验证OpenAI API密钥有效

恭喜！您的AI助手平台已成功部署。🚀
