# 数据库设置说明

由于Supabase需要交互式授权，我无法完全自动化创建。以下是为你准备的方案：

## 方案1：你手动创建Supabase（2分钟）
1. 访问 https://supabase.com
2. GitHub登录
3. 创建新项目：
   - 名称: ai-assistant-platform
   - 密码: 设置强密码
   - 地区: Singapore（亚太地区快）
4. 等待创建完成（约2分钟）
5. 获取数据库URL：
   - Settings → Database → Connection string → URI格式
6. 告诉我URL，我帮你配置

## 方案2：使用免费数据库服务
如果你不想操作，我可以为你申请：
- **Neon.tech** (Serverless PostgreSQL，免费)
- 需要你的邮箱授权

## 方案3：临时解决方案
先部署，使用模拟数据库，后续再迁移

## 建议
选择方案1（Supabase），这是最稳定和免费的。

## 数据库URL格式示例
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

我等你选择，然后继续！
