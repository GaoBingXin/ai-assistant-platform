"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Image, 
  Code, 
  CreditCard, 
  History, 
  Settings,
  ArrowRight,
  Activity,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">请先登录</h2>
          <p className="text-muted-foreground">登录后即可查看控制台</p>
          <Button asChild>
            <Link href="/login">前往登录</Link>
          </Button>
        </div>
      </div>
    )
  }

  const user = session.user
  const stats = [
    { label: "剩余积分", value: "10", icon: CreditCard, color: "text-blue-500" },
    { label: "对话次数", value: "5", icon: MessageSquare, color: "text-green-500" },
    { label: "图像生成", value: "2", icon: Image, color: "text-purple-500" },
    { label: "代码生成", value: "8", icon: Code, color: "text-orange-500" },
  ]

  const quickActions = [
    { title: "开始对话", description: "与AI助手聊天", icon: MessageSquare, href: "/chat", color: "bg-blue-500" },
    { title: "生成图像", description: "用文字生成图片", icon: Image, href: "/image", color: "bg-purple-500" },
    { title: "编写代码", description: "AI辅助编程", icon: Code, href: "/code", color: "bg-orange-500" },
    { title: "历史记录", description: "查看使用历史", icon: History, href: "/dashboard/history", color: "bg-green-500" },
  ]

  const recentActivity = [
    { type: "对话", title: "如何学习React", time: "2小时前", icon: MessageSquare },
    { type: "图像", title: "山水画风格风景", time: "昨天", icon: Image },
    { type: "代码", title: "Python数据分析", time: "2天前", icon: Code },
    { type: "对话", title: "健身计划建议", time: "3天前", icon: MessageSquare },
  ]

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">欢迎回来，{user?.name || "用户"}！</h1>
        <p className="text-muted-foreground">今天想让AI帮你做什么？</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color.replace("text", "bg")}/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.label === "剩余积分" && (
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "30%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">30% 已使用</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${action.color} w-fit`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-accent">
                    <Link href={action.href}>
                      开始使用
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 最近活动 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>您最近的AI使用记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                    <div className="p-2 rounded-md bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.title}</p>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.type}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button variant="outline" className="w-full mt-6" asChild>
              <Link href="/dashboard/history">查看全部历史</Link>
            </Button>
          </CardContent>
        </Card>

        {/* 功能推荐 */}
        <Card>
          <CardHeader>
            <CardTitle>功能推荐</CardTitle>
            <CardDescription>您可能需要的功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">代码优化</p>
                  <p className="text-sm text-muted-foreground">让AI优化您的代码</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">数据分析</p>
                  <p className="text-sm text-muted-foreground">AI辅助数据分析</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">团队协作</p>
                  <p className="text-sm text-muted-foreground">邀请团队成员</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">账户设置</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    个人设置
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/billing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    订阅管理
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
