#!/bin/bash

if [ -z "$VERCEL_TOKEN" ]; then
  echo "错误：请设置VERCEL_TOKEN环境变量"
  echo "例如：VERCEL_TOKEN=vercel_xxx ./deploy.sh"
  exit 1
fi

echo "开始部署到Vercel..."

# 设置环境变量
export VERCEL_ORG_ID=""
export VERCEL_PROJECT_ID=""

# 尝试部署
echo "1. 登录Vercel..."
vercel --token "$VERCEL_TOKEN" 2>/dev/null || true

echo "2. 部署项目..."
vercel --prod --token "$VERCEL_TOKEN" --yes 2>&1 | tee deployment.log

echo ""
echo "部署完成！"
echo "如果部署失败，请查看deployment.log文件"
