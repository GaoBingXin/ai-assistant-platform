"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Copy, Check, Sparkles, Trash2, ThumbsUp, ThumbsDown, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const examplePrompts = [
  "帮我写一个React组件，实现一个漂亮的卡片效果",
  "解释一下量子计算的基本原理和应用场景",
  "给我讲一个关于太空探索的科幻故事",
  "如何系统性地学习Python和数据科学？",
  "写一首关于数字时代的现代诗",
  "帮我规划一个为期三天的东京旅游行程",
  "设计一个智能家居系统的架构方案",
  "解释区块链技术如何改变金融行业",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是你的AI助手，基于DeepSeek最新模型。我可以帮你解答问题、生成代码、创作内容、分析数据等。有什么我可以帮助你的吗？",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "USER", content: input }],
          stream: false,
        }),
      })

      if (!response.ok) throw new Error("请求失败")

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("发送消息失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      toast.success("已复制到剪贴板")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error("复制失败")
    }
  }

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "你好！我是你的AI助手，可以帮你解答问题、生成代码、创作内容等。有什么我可以帮助你的吗？",
        timestamp: new Date(),
      },
    ])
    toast.success("对话已清空")
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    toast.success(`感谢你的${type === 'like' ? '点赞' : '反馈'}！`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-xl">
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-3xl blur-xl"></div>
            <Sparkles className="h-10 w-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            智能对话助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            与先进的AI模型进行自然流畅的对话，获取知识和创意灵感
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 快捷提示卡片 */}
            <Card className="p-6 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">快捷提示</h3>
              </div>
              <div className="space-y-3">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(prompt)}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all hover:scale-[1.02] active:scale-95 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{prompt}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* 统计卡片 */}
            <Card className="p-6 bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <div className="text-xs font-bold text-white">
                    {messages.length}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">对话统计</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">你的消息</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {messages.filter(m => m.role === "user").length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI回复</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {messages.filter(m => m.role === "assistant").length}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                    onClick={handleClear}
                    disabled={messages.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    清空对话
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 聊天主区域 */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] flex flex-col bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      } fade-in`}
                    >
                      {/* 头像 */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur"></div>
                        <div
                          className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-purple-500 to-purple-600"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-6 w-6 text-white" />
                          ) : (
                            <Bot className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </div>

                      {/* 消息内容 */}
                      <div
                        className={`max-w-[75%] rounded-2xl p-5 shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-br-none"
                            : "bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-bl-none"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {message.role === "user" ? "你" : "AI助手"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded"
                              title="复制"
                            >
                              {copiedId === message.id ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                            {message.role === "assistant" && (
                              <>
                                <button
                                  onClick={() => handleFeedback(message.id, 'like')}
                                  className="p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded"
                                  title="点赞"
                                >
                                  <ThumbsUp className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(message.id, 'dislike')}
                                  className="p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded"
                                  title="反馈"
                                >
                                  <ThumbsDown className="h-4 w-4 text-gray-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {message.timestamp.toLocaleTimeString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {message.role === "assistant" && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400">
                                AI生成
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full blur"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl rounded-bl-none p-5 max-w-[75%]">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* 输入区域 */}
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-6">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="输入你的问题或想法..."
                      className="min-h-[70px] flex-1 resize-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      Shift + Enter 换行
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    基于DeepSeek AI模型，回答可能有延迟
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={handleClear}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      清空
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      分享
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
