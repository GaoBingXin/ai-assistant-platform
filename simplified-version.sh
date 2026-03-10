#!/bin/bash

echo "创建简化版本（无数据库）..."

# 1. 创建简化的auth配置
cat > lib/auth/index.ts << 'AUTH_EOF'
// 简化版认证（无数据库）
export async function getCurrentUser() {
  // 开发模式：返回模拟用户
  return {
    id: "demo-user-id",
    email: "demo@example.com",
    name: "Demo User",
    credits: 100,
  }
}
AUTH_EOF

# 2. 创建简化的数据库模拟
cat > lib/db/index.ts << 'DB_EOF'
// 内存数据库模拟
export const db = {
  user: {
    findUnique: async () => ({
      id: "demo-user-id",
      credits: 100,
    }),
    update: async () => ({}),
  },
  conversation: {
    findUnique: async () => null,
    create: async () => ({ id: "conv-001" }),
  },
  message: {
    create: async () => ({ id: "msg-001" }),
  },
  generatedImage: {
    create: async () => ({ id: "img-001" }),
  },
}

export async function initDatabase() {
  console.log("✅ 使用内存数据库")
  return true
}
DB_EOF

# 3. 更新环境变量模板
cat > .env.example << 'ENV_EOF'
# 简化版配置
NEXTAUTH_SECRET="development-secret-change-in-production"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="development"

# 数据库配置（使用内存）
# 无需DATABASE_URL
ENV_EOF

echo "✅ 简化版本已创建"
echo ""
echo "环境变量配置（Vercel中）："
echo "NEXTAUTH_SECRET=\"你的密钥\""
echo "OPENAI_API_KEY=\"你的OpenAI密钥\""
echo ""
echo "构建命令：npm run build"
