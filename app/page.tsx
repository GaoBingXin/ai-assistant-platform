import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, Image, Code, Shield, Zap, Users, Star } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "智能对话",
      description: "与先进的AI助手进行自然对话，解答各种问题，提供个性化建议",
    },
    {
      icon: <Image className="h-8 w-8" />,
      title: "图像生成",
      description: "将文字描述转化为精美图像，支持多种风格和分辨率",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "代码生成",
      description: "快速生成、调试和优化代码，支持多种编程语言和框架",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "安全可靠",
      description: "端到端加密，数据隐私保护，企业级安全标准",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "快速响应",
      description: "毫秒级响应时间，支持流式输出，体验流畅自然",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "团队协作",
      description: "多人协作功能，共享对话记录，提升团队效率",
    },
  ]

  const testimonials = [
    {
      name: "张明",
      role: "前端开发工程师",
      content: "这个平台的代码生成功能真是太棒了！帮我节省了大量开发时间。",
      avatar: "ZM",
    },
    {
      name: "李华",
      role: "设计师",
      content: "图像生成的质量超乎想象，我的设计工作变得更高效了。",
      avatar: "LH",
    },
    {
      name: "王强",
      role: "产品经理",
      content: "AI对话功能帮助我快速验证产品想法，团队成员都非常喜欢。",
      avatar: "WQ",
    },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            下一代
            <span className="gradient-text"> AI助手平台</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            一站式AI服务平台，集智能对话、图像生成、代码编写于一体，助力您的工作与创作
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">
              免费开始使用
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/chat">立即体验</Link>
          </Button>
        </div>
        <div className="relative h-[400px] rounded-xl overflow-hidden border shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI正在思考中...</span>
              </div>
              <h3 className="text-2xl font-semibold">您想让我帮您做什么？</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">强大功能</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我们提供全方位的AI服务，满足您的各种需求
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow animate-up">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">用户评价</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            听听我们的用户怎么说
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-12 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">立即开始您的AI之旅</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            加入数千名用户，体验AI带来的无限可能
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">
              免费注册
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">查看定价</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          免费试用包含10次对话、5张图像生成、无限代码生成
        </p>
      </section>
    </div>
  )
}
