"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Trash2, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是AI助手，有什么可以帮您的？",
      createdAt: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 聚焦输入框
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !session) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role === "user" ? "USER" : "ASSISTANT",
              content: msg.content,
            })),
            {
              role: "USER",
              content: input,
            },
          ],
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error("请求失败")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") break

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantMessage += parsed.content
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    if (lastMessage?.role === "assistant") {
                      lastMessage.content = assistantMessage
                    } else {
                      newMessages.push({
                        id: Date.now().toString(),
                        role: "assistant",
                        content: assistantMessage,
                        createdAt: new Date(),
                      })
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "抱歉，我遇到了一些问题，请稍后重试。",
          createdAt: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const handleClearChat = () => {
    if (window.confirm("确定要清空对话吗？")) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "你好！我是AI助手，有什么可以帮您的？",
          createdAt: new Date(),
        },
      ])
    }
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
          <p className="text-muted-foreground">登录后即可使用AI对话功能</p>
          <Button asChild>
            <a href="/login">前往登录</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI对话</h1>
          <p className="text-muted-foreground">与AI助手进行智能对话</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          disabled={messages.length <= 1}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          清空对话
        </Button>
      </div>

      <Card className="h-[600px] flex flex-col">
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === "user" ? "order-first" : "order-last"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {message.role === "user" ? "你" : "AI助手"} ·{" "}
                    {message.createdAt.toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-1"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  思考中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </Card>

      {/* 提示示例 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          "帮我写一封工作邮件",
          "解释一下什么是机器学习",
          "制定一个健身计划",
          "推荐几本好书",
          "如何学习编程",
          "帮我分析这个商业计划",
        ].map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 text-left"
            onClick={() => setInput(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  )
}
