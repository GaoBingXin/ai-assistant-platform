"use client"

import { useState } from "react"
import { Brain, Code, ImageIcon, MessageSquare, Users, Zap, ArrowUpRight, TrendingUp, Calendar, Clock, BarChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "对话次数",
      value: "1,248",
      change: "+12.5%",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "代码生成",
      value: "543",
      change: "+8.2%",
      icon: <Code className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "图像创作",
      value: "89",
      change: "+23.1%",
      icon: <ImageIcon className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "活跃天数",
      value: "28",
      change: "+5.6%",
      icon: <Calendar className="h-5 w-5" />,
      color: "from-orange-500 to-red-500",
    },
  ]

  const recentActivities = [
    { id: 1, type: "对话", content: "关于React性能优化", time: "10分钟前", icon: <MessageSquare className="h-4 w-4" /> },
    { id: 2, type: "代码", content: "生成了Python数据分析脚本", time: "1小时前", icon: <Code className="h-4 w-4" /> },
    { id: 3, type: "图像", content: "创作了数字艺术图像", time: "3小时前", icon: <ImageIcon className="h-4 w-4" /> },
    { id: 4, type: "对话", content: "学习了机器学习基础", time: "5小时前", icon: <MessageSquare className="h-4 w-4" /> },
    { id: 5, type: "代码", content: "生成了前端组件", time: "昨天", icon: <Code className="h-4 w-4" /> },
  ]

  const quickActions = [
    { title: "开始新对话", icon: <MessageSquare className="h-5 w-5" />, color: "blue", link: "/chat" },
    { title: "生成代码", icon: <Code className="h-5 w-5" />, color: "green", link: "/code" },
    { title: "创作图像", icon: <ImageIcon className="h-5 w-5" />, color: "purple", link: "/image" },
    { title: "查看统计", icon: <BarChart className="h-5 w-5" />, color: "orange", link: "#" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">欢迎回来！这是你的AI助手使用概览</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                升级计划
              </Button>
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            {["overview", "analytics", "usage", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {tab === "overview" && "概览"}
                {tab === "analytics" && "分析"}
                {tab === "usage" && "使用情况"}
                {tab === "settings" && "设置"}
              </button>
            ))}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover-lift"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：快速操作 */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">快速操作</CardTitle>
                <CardDescription>开始你的AI创作之旅</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.link}
                      className="group p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover-lift hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-${action.color}-500/10`}>
                          <div className={`text-${action.color}-600 dark:text-${action.color}-400`}>
                            {action.icon}
                          </div>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        立即开始使用AI助手
                      </p>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 最近活动 */}
            <Card className="mt-8 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">最近活动</CardTitle>
                <CardDescription>你的AI助手使用记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-700/50">
                          {activity.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.content}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：功能推荐 */}
          <div>
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-8">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">功能推荐</CardTitle>
                <CardDescription>你可能感兴趣的功能</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400">高级对话</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      使用更强大的模型进行深度对话和复杂问题解答
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      立即体验
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400">批量处理</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      一次性处理多个任务，大幅提升工作效率
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      了解更多
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-600 dark:text-green-400">团队协作</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      邀请团队成员，共享AI助手，提升团队生产力
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      开始协作
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 使用提示 */}
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">使用提示</CardTitle>
                <CardDescription>提升AI助手使用效率</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">使用具体的描述可以获得更准确的回复</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">尝试使用不同的指令格式，如"请解释..."、"如何实现..."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">对于复杂任务，可以分解为多个简单问题</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">定期清理历史对话可以提升响应速度</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
