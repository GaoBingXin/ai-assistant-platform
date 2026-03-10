# 🚀 快速部署指南

## 1. GitHub仓库创建（2分钟）

1. **访问**: https://github.com/new
2. **填写**:
   - Repository name: `ai-assistant` (或自定义)
   - Description: 现代化AI助手平台
   - 选择 Public
   - **不要**勾选 README
3. **点击**: Create repository

## 2. 推送代码（1分钟）

**复制并执行以下命令：**

```bash
# 进入项目目录
cd modern-ai-platform

# 设置远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

## 3. Vercel部署（3分钟）

1. **访问**: https://vercel.com/new
2. **导入**从GitHub导入您的仓库
3. **配置环境变量**（点击"Environment Variables"）：

```
# 必需：
DATABASE_URL=postgresql://...    # 从Supabase获取
NEXTAUTH_SECRET=$(openssl rand -base64 32)  # 生成密钥
OPENAI_API_KEY=sk-...            # 从OpenAI获取

# 可选（登录功能）：
GOOGLE_CLIENT_ID=...
GITHUB_CLIENT_ID=...
```

4. **修改Build Command**:
   ```
   npx prisma generate && npm run build
   ```

5. **点击**: Deploy

## 4. 数据库设置（2分钟）

**推荐使用Supabase（免费）：**

1. 访问 https://supabase.com
2. 创建新项目
3. 获取连接URL（Settings → Database → Connection string）
4. 粘贴到Vercel的 `DATABASE_URL`

## 5. 测试应用（1分钟）

访问您的Vercel域名：
- https://your-app.vercel.app
- 测试注册、登录、AI功能

## 🔧 环境变量速查表

| 变量 | 说明 | 获取方式 |
|------|------|----------|
| `DATABASE_URL` | 数据库连接 | Supabase/PlanetScale/Neon |
| `NEXTAUTH_SECRET` | 认证密钥 | 运行 `openssl rand -base64 32` |
| `OPENAI_API_KEY` | OpenAI密钥 | platform.openai.com/api-keys |
| `GOOGLE_CLIENT_ID` | Google登录 | console.cloud.google.com |
| `GITHUB_CLIENT_ID` | GitHub登录 | github.com/settings/applications |

## 🆘 快速故障排除

1. **构建失败** → 检查Build Command包含 `npx prisma generate`
2. **数据库错误** → 确认 `DATABASE_URL` 格式正确
3. **认证错误** → 确保 `NEXTAUTH_SECRET` 已设置
4. **API错误** → 验证 `OPENAI_API_KEY` 有效

## 📱 一键部署（如果有GitHub CLI）

```bash
# 创建仓库
gh repo create ai-assistant --public --source=. --remote=origin --push

# 部署到Vercel
vercel --prod
```

## ✅ 完成检查清单

- [ ] GitHub仓库创建成功
- [ ] 代码推送完成
- [ ] Vercel项目导入
- [ ] 环境变量配置
- [ ] 数据库连接设置
- [ ] 构建成功
- [ ] 功能测试通过

**总耗时**: 约10分钟

## 💡 提示

- 首次部署后，建议在Vercel中配置自定义域名
- 定期检查OpenAI API使用量和费用
- 启用Vercel的自动部署（默认开启）

**您的AI助手平台即将上线！** 🎉
