"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon, Download, RefreshCw, Sparkles } from "lucide-react"
import Image from "next/image"

export default function ImagePage() {
  const { data: session, status } = useSession()
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState("1024x1024")
  const [quality, setQuality] = useState("standard")
  const [style, setStyle] = useState("vivid")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; revisedPrompt: string }>>([])
  const [error, setError] = useState<string | null>(null)

  const examplePrompts = [
    "一只可爱的卡通猫在星空下弹吉他",
    "未来城市中的赛博朋克风格街道",
    "山水画风格的日出风景",
    "简约风格的现代办公室设计",
    "奇幻森林中的发光蘑菇",
    "复古科幻风格的太空飞船",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading || !session) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size,
          quality,
          style,
          n: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "生成失败")
      }

      setGeneratedImages(prev => [...data.images, ...prev])
      setPrompt("") // 清空输入框
    } catch (err: any) {
      setError(err.message || "生成失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `ai-image-${Date.now()}-${index}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error("下载失败:", err)
    }
  }

  const handleUseExample = (example: string) => {
    setPrompt(example)
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
          <p className="text-muted-foreground">登录后即可使用图像生成功能</p>
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
        <h1 className="text-3xl font-bold">AI图像生成</h1>
        <p className="text-muted-foreground">用文字描述生成精美图像</p>
      </div>

      <Card className="p-6 space-y-6">
        {/* 输入区域 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">描述您想要的图像</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="详细描述您想要生成的图像，例如：一只可爱的卡通猫在星空下弹吉他，风格为卡通插画，色彩鲜艳"
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              越详细的描述，生成的图像越符合您的预期
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">图像尺寸</label>
              <Select value={size} onValueChange={setSize} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">正方形 (1024×1024)</SelectItem>
                  <SelectItem value="1792x1024">宽屏 (1792×1024)</SelectItem>
                  <SelectItem value="1024x1792">竖屏 (1024×1792)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">图像质量</label>
              <Select value={quality} onValueChange={setQuality} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">标准</SelectItem>
                  <SelectItem value="hd">高清</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">艺术风格</label>
              <Select value={style} onValueChange={setStyle} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivid">生动</SelectItem>
                  <SelectItem value="natural">自然</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
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
                生成图像
              </>
            )}
          </Button>
        </div>

        {/* 示例提示词 */}
        <div className="space-y-3">
          <p className="text-sm font-medium">试试这些例子：</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
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

      {/* 生成的图像 */}
      {generatedImages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">生成的图像</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratedImages([])}
              disabled={generatedImages.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              清空
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((image, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={image.url}
                    alt={image.revisedPrompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(image.url, index)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.revisedPrompt}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">使用技巧</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>详细描述主体、背景、风格、色彩等元素</span>
            </li>
            <li className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>可以指定艺术风格，如"油画风格"、"卡通插画"、"赛博朋克"等</span>
            </li>
            <li className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>高清质量需要更多积分，但图像细节更丰富</span>
            </li>
            <li className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>避免使用涉及暴力、色情、侵权等内容的描述</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
