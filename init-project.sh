#!/bin/bash

echo "========================================"
echo "AI平台项目初始化脚本"
echo "========================================"

# 安装依赖
echo "1. 安装依赖..."
npm install

# 生成Prisma客户端
echo "2. 生成Prisma客户端..."
npx prisma generate

# 初始化数据库
echo "3. 初始化数据库..."
npx prisma db push

# 创建环境文件
if [ ! -f .env ]; then
  echo "4. 创建环境文件..."
  cp .env.example .env
  echo "✅ 已创建 .env 文件"
  echo "⚠️  请编辑 .env 文件："
  echo "   - 设置 VOLCANO_API_KEY（你的火山引擎API key）"
  echo "   - 设置 NEXTAUTH_SECRET（运行: openssl rand -base64 32）"
else
  echo "✅ .env 文件已存在"
fi

# 生成认证密钥
echo "5. 生成认证密钥..."
if command -v openssl &> /dev/null; then
  secret=$(openssl rand -base64 32)
  echo "生成的NEXTAUTH_SECRET: $secret"
  echo "请将此值复制到 .env 文件的 NEXTAUTH_SECRET"
else
  echo "⚠️  找不到 openssl，请手动生成密钥"
  echo "   运行: openssl rand -base64 32"
fi

echo ""
echo "✅ 初始化完成！"
echo ""
echo "启动开发服务器:"
echo "  npm run dev"
echo ""
echo "构建生产版本:"
echo "  npm run build"
echo "========================================"
