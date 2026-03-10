"use client"

import { useState } from "react"
import { Copy, Check, Code, Terminal, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { toast } from "sonner"

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
]

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "nextjs", label: "Next.js" },
  { value: "express", label: "Express.js" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "spring", label: "Spring Boot" },
  { value: "laravel", label: "Laravel" },
  { value: "fastapi", label: "FastAPI" },
]

const examples = [
  "写一个计算斐波那契数列的函数",
  "创建一个用户登录表单组件",
  "实现一个RESTful API端点",
  "写一个数据爬虫脚本",
  "实现一个简单的Todo应用",
]

export default function CodePage() {
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [framework, setFramework] = useState("react")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("请输入代码描述")
      return
    }

    setIsGenerating(true)
    setGeneratedCode("")

    try {
      const response = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language,
          framework,
        }),
      })

      if (!response.ok) throw new Error("生成失败")

      const data = await response.json()
      setGeneratedCode(data.code)
      toast.success("代码生成成功！")
    } catch (error) {
      console.error("Code generation error:", error)
      toast.error("代码生成失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      toast.success("代码已复制到剪贴板")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("复制失败")
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
            <div className="absolute -inset-2 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-3xl blur-xl"></div>
            <Code className="h-10 w-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            代码生成助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            智能生成高质量代码，支持多种编程语言和框架
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">代码生成</CardTitle>
                <CardDescription>描述你想要实现的代码功能</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      代码描述
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="例如：写一个React组件，实现一个可搜索的下拉菜单"
                      className="min-h-[120px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        编程语言
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        框架/库
                      </label>
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      >
                        {frameworks.map((fw) => (
                          <option key={fw.value} value={fw.value}>
                            {fw.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        生成代码
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 生成的代码 */}
            {generatedCode && (
              <Card className="mt-8 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 dark:text-white">生成的代码</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="bg-white/50 dark:bg-gray-800/50"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          复制代码
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">代码预览</span>
                    </div>
                    <pre className="p-6 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto mt-8">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：示例和提示 */}
          <div className="space-y-6">
            {/* 示例提示 */}
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-gray-900 dark:text-white">示例提示</CardTitle>
                </div>
                <CardDescription>点击使用示例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">{example}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 使用技巧 */}
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">使用技巧</CardTitle>
                <CardDescription>提升代码生成质量</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      提供具体的功能描述和需求
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      指定语言和框架可以获得更准确的代码
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      对于复杂功能，可以分解为多个简单请求
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      生成的代码可能需要根据具体需求进行调整
                    </span>
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
