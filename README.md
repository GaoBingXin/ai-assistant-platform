# AI助手平台

一个现代化的AI助手平台，集成了智能对话、图像生成和代码编写功能。

## 功能特性

### 🎯 核心功能
- 🤖 **智能对话** - 与先进的AI助手进行自然对话
- 🎨 **图像生成** - 根据文字描述生成精美图像
- 💻 **代码生成** - AI辅助编程，支持多种语言
- 🔐 **用户系统** - 完整的注册、登录、权限管理
- 📊 **控制面板** - 使用统计和个性化推荐

### 🛠️ 技术栈
- **前端**: Next.js 15, TypeScript, TailwindCSS
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL
- **认证**: NextAuth.js
- **AI集成**: OpenAI API, Vercel AI SDK
- **部署**: Vercel, Docker

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd modern-ai-platform
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件，填入您的配置
   ```

4. **设置数据库**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **运行开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
modern-ai-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证相关
│   │   ├── chat/         # 聊天功能
│   │   ├── image/        # 图像生成
│   │   └── code/         # 代码生成
│   ├── auth/             # 认证页面
│   ├── chat/             # 聊天页面
│   ├── image/            # 图像生成页面
│   ├── code/             # 代码生成页面
│   ├── dashboard/        # 控制台
│   └── layout.tsx        # 根布局
├── components/           # React 组件
│   ├── ui/              # 基础UI组件
│   ├── layout/          # 布局组件
│   └── providers/       # 上下文提供者
├── lib/                 # 工具函数和配置
│   ├── ai/             # AI相关功能
│   ├── auth/           # 认证逻辑
│   ├── db/             # 数据库连接
│   └── utils/          # 工具函数
├── prisma/             # 数据库模型
└── public/             # 静态资源
```

## 配置说明

### 数据库配置
项目使用 PostgreSQL 作为数据库。您可以通过以下方式配置：

1. **本地 PostgreSQL**: 安装并运行 PostgreSQL
2. **云数据库**: 使用 Supabase、Neon 或 AWS RDS
3. **Docker**: 使用提供的 docker-compose 文件

### AI服务配置
1. **OpenAI API**: 在 [OpenAI平台](https://platform.openai.com) 获取 API Key
2. **模型选择**: 支持 GPT-4, GPT-3.5, DALL-E 3 等

### 认证配置
1. **OAuth 提供商**: 配置 Google、GitHub 等 OAuth 应用
2. **邮箱认证**: 支持邮箱密码登录

## 部署

### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### Docker 部署
```bash
docker-compose up -d
```

### 手动部署
1. 构建项目: `npm run build`
2. 运行生产服务器: `npm start`

## 开发指南

### 添加新功能
1. 在 `app/` 目录下创建页面
2. 在 `app/api/` 下创建 API 路由
3. 在 `components/` 下创建组件
4. 更新数据库模型（如果需要）

### 数据库迁移
```bash
# 生成迁移文件
npx prisma migrate dev --name add-feature

# 应用迁移
npx prisma db push

# 查看数据
npx prisma studio
```

### 测试
```bash
# 运行测试
npm test

# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License - 查看 LICENSE 文件了解详情

## 支持

- 文档: [查看文档](docs/)
- 问题: [GitHub Issues](issues/)
- 讨论: [加入讨论](discussions/)

## 路线图

- [ ] 团队协作功能
- [ ] API 限流和配额管理
- [ ] 更多AI模型集成
- [ ] 移动端应用
- [ ] 插件系统
