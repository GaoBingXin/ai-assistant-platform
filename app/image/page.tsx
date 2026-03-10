"use client"

import { useState } from "react"
import { Download, ImageIcon, Sparkles, Wand2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const examplePrompts = [
  "一个宇航员在太空中骑自行车，数字艺术风格",
  "宁静的日本花园，樱花盛开，水彩画风格",
  "未来城市夜景，霓虹灯光，赛博朋克风格",
  "可爱的小猫坐在窗台上看雨，插画风格",
  "抽象几何图案，渐变色彩，现代艺术风格",
]

const styles = [
  { value: "realistic", label: "写实风格" },
  { value: "cartoon", label: "卡通风格" },
  { value: "watercolor", label: "水彩画风格" },
  { value: "cyberpunk", label: "赛博朋克风格" },
  { value: "minimalist", label: "极简风格" },
  { value: "abstract", label: "抽象风格" },
]

const sizes = [
  { value: "1024x1024", label: "方形 (1024x1024)" },
  { value: "1792x1024", label: "宽屏 (1792x1024)" },
  { value: "1024x1792", label: "竖屏 (1024x1792)" },
]

export default function ImagePage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [size, setSize] = useState("1024x1024")
  const [generatedImage, setGeneratedImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("请输入图像描述")
      return
    }

    setIsGenerating(true)
    setGeneratedImage("")

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}，${styles.find(s => s.value === style)?.label}`,
          size,
        }),
      })

      if (!response.ok) throw new Error("生成失败")

      const data = await response.json()
      setGeneratedImage(data.url)
      toast.success("图像生成成功！")
    } catch (error) {
      console.error("Image generation error:", error)
      toast.error("图像生成失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `ai-generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("图像已开始下载")
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        setCopied(true)
        toast.success("提示词已复制")
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => toast.error("复制失败"))
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 mb-6 shadow-xl">
            <div className="absolute -inset-2 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-3xl blur-xl"></div>
            <ImageIcon className="h-10 w-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            图像创作助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            通过文字描述生成精美图像，释放你的创意潜能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">图像生成</CardTitle>
                <CardDescription>描述你想要创建的图像</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        图像描述
                      </label>
                      <button
                        onClick={handleCopyPrompt}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            复制提示词
                          </>
                        )}
                      </button>
                    </div>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="例如：一只可爱的熊猫在竹林里吃竹子，卡通风格"
                      className="min-h-[120px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        艺术风格
                      </label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      >
                        {styles.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        图像尺寸
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      >
                        {sizes.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-2" />
                        生成图像
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 生成的图像 */}
            {generatedImage && (
              <Card className="mt-8 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 dark:text-white">生成的图像</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="bg-white/50 dark:bg-gray-800/50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载图像
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
                        AI生成
                      </span>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <img
                        src={generatedImage}
                        alt="AI生成的图像"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/${size.replace('x', '/')}/cccccc/000000?text=${encodeURIComponent(prompt.substring(0, 20))}`
                        }}
                      />
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">提示词：</span>
                        {prompt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>尺寸：{size}</span>
                        <span>风格：{styles.find(s => s.value === style)?.label}</span>
                      </div>
                    </div>
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
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <CardTitle className="text-gray-900 dark:text-white">示例提示</CardTitle>
                </div>
                <CardDescription>点击使用示例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examplePrompts.map((example, index) => (
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

            {/* 创作技巧 */}
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">创作技巧</CardTitle>
                <CardDescription>提升图像生成质量</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      描述具体场景、物体、颜色和氛围
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      指定艺术风格可以获得更一致的效果
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      使用形容词丰富画面感，如"梦幻的"、"神秘的"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      尝试不同的尺寸比例，适应不同的用途
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 注意事项 */}
            <Card className="bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">注意事项</CardTitle>
                <CardDescription>请遵守使用规范</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• 请勿生成暴力、色情等不当内容</li>
                  <li>• 尊重他人隐私和肖像权</li>
                  <li>• 生成图像可用于个人创作和商业用途</li>
                  <li>• 建议标注图像为AI生成</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
