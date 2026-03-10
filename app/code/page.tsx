"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code2, Copy, Play, Sparkles, Terminal } from "lucide-react"

export default function CodePage() {
  const { data: session, status } = useSession()
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [framework, setFramework] = useState("")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [explanation, setExplanation] = useState("")
  const [error, setError] = useState<string | null>(null)

  const languages = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin", "html", "css", "sql", "bash"
  ]

  const frameworks = [
    "react", "vue", "angular", "nextjs", "nuxt", "express", "nestjs", "django", "flask", "spring", "laravel", "rails", "flutter", "react-native"
  ]

  const examplePrompts = [
    "实现一个购物车的功能",
    "写一个用户登录验证的API",
    "实现一个文件上传组件",
    "写一个数据可视化的图表",
    "实现一个聊天应用的后端",
    "写一个图片轮播组件",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading || !session) return

    setIsLoading(true)
    setError(null)
    setGeneratedCode("")
    setExplanation("")

    try {
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          language,
          framework,
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "生成失败")
      }

      setGeneratedCode(data.code)
      setExplanation(data.explanation || "")
    } catch (err: any) {
      setError(err.message || "代码生成失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const handleUseExample = (example: string) => {
    setPrompt(example)
  }

  const handleClear = () => {
    setPrompt("")
    setGeneratedCode("")
    setExplanation("")
    setError(null)
  }

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
          <p className="text-muted-foreground">登录后即可使用代码生成功能</p>
          <Button asChild>
            <a href="/login">前往登录</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI代码生成</h1>
        <p className="text-muted-foreground">让AI帮你编写、调试和优化代码</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 输入区域 */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">描述您的代码需求</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="详细描述您想要生成的代码，例如：实现一个用户注册功能，包含邮箱验证和密码加密"
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                越详细的描述，生成的代码越符合您的需求
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">编程语言</label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">框架/库（可选）</label>
                <Select value={framework} onValueChange={setFramework} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择框架" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无</SelectItem>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw} value={fw}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">上下文信息（可选）</label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="提供相关上下文，如现有代码、API文档、数据库结构等"
                className="min-h-[80px] resize-none"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt.trim()}
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    生成代码
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                清空
              </Button>
            </div>
          </div>

          {/* 示例提示词 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">试试这些例子：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => handleUseExample(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* 右侧信息 */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Code2 className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">支持的语言</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, HTML, CSS, SQL, Bash
                </p>
              </div>

              <div className="p-3 rounded-lg bg-green-500/10">
                <Terminal className="h-6 w-6 text-green-500 mb-2" />
                <h3 className="font-semibold">生成高质量的代码</h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• 包含完整的错误处理</li>
                  <li>• 遵循最佳实践</li>
                  <li>• 详细的代码注释</li>
                  <li>• 可测试的代码结构</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">使用技巧</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>详细描述功能需求、输入输出、异常情况</span>
                </li>
                <li className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>指定编程语言和框架可以提高准确率</span>
                </li>
                <li className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>提供上下文信息（如现有代码）可以获得更好的集成方案</span>
                </li>
                <li className="flex items-start gap-2">
                  <Play className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>可以要求生成单元测试和文档</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* 生成的代码 */}
      {generatedCode && (
        <Card className="space-y-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">生成的代码</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  语言: {language} {framework && `· 框架: ${framework}`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                复制代码
              </Button>
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generatedCode}</code>
              </pre>
            </div>

            {explanation && (
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-semibold mb-2">代码说明</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{explanation}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
