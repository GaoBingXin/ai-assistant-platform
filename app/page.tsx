import Link from "next/link"
import { ArrowRight, Brain, Code, ImageIcon, MessageSquare, Sparkles, Zap, Shield, Globe, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "智能对话",
      description: "基于DeepSeek的最新模型，提供自然流畅的对话体验",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "代码生成",
      description: "支持多种编程语言和框架，快速生成高质量代码",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <ImageIcon className="h-6 w-6" />,
      title: "图像创作",
      description: "文字描述生成精美图像，释放你的创意潜能",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "安全可靠",
      description: "企业级安全防护，确保你的数据隐私和安全",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "多语言支持",
      description: "支持中文、英文等多种语言，全球用户友好",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "快速响应",
      description: "毫秒级响应速度，实时交互体验",
      gradient: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* 导航栏 */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
              <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI助手平台
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                登录
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                <span className="relative z-10">开始使用</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity"></div>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800/50 dark:to-gray-800/50 mb-8">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              基于DeepSeek AI的下一代助手平台
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-gray-900 dark:text-white">创造、协作、</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              智能化未来
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            集聊天对话、代码生成、图像创作于一体的智能AI助手平台，为你的工作和创作提供无限可能。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all">
                免费开始使用
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="px-8 h-14 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                立即体验
              </Button>
            </Link>
          </div>

          {/* 预览图 */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl h-32"></div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl h-32"></div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            一站式AI助手服务
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            我们提供全方位的AI助手服务，满足你的各种需求
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover-lift hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  <span>了解更多</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA区域 */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">限时免费</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                准备好开启AI之旅了吗？
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                立即加入数千名创作者和开发者的行列，体验最先进的AI助手服务。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="px-8 h-12 text-lg bg-white text-blue-600 hover:bg-gray-100">
                    免费注册
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="px-8 h-12 text-lg border-white text-white hover:bg-white/10">
                    直接体验
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-white/60 mt-6">
                无需信用卡，立即开始使用
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AI助手平台</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              服务条款
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              联系我们
            </a>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 AI助手平台. 保留所有权利.
          </div>
        </div>
      </footer>
    </div>
  )
}
