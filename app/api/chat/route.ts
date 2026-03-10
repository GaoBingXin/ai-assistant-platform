import { NextRequest, NextResponse } from "next/server"
import { handleChatRequest } from "@/lib/ai/chat"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { messages, conversationId, stream = false } = body

    // 验证请求数据
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "无效的请求数据" }, { status: 400 })
    }

    // 验证消息格式
    for (const msg of messages) {
      if (!msg.role || !msg.content || !["USER", "ASSISTANT", "SYSTEM"].includes(msg.role)) {
        return NextResponse.json({ error: "无效的消息格式" }, { status: 400 })
      }
    }

    // 如果提供了conversationId，验证权限
    if (conversationId) {
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      })
      if (conversation && conversation.userId !== user.id) {
        return NextResponse.json({ error: "没有权限访问此对话" }, { status: 403 })
      }
    }

    // 流式响应
    if (stream) {
      const encoder = new TextEncoder()
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            await handleChatRequest({
              messages,
              conversationId,
              userId: user.id!,
              stream: true,
            }, (chunk) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
            })

            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          } catch (error) {
            console.error("Stream error:", error)
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "生成失败" })}\n\n`)
            )
            controller.close()
          }
        },
      })

      return new Response(streamResponse, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }

    // 非流式响应
    const response = await handleChatRequest({
      messages,
      conversationId,
      userId: user.id!,
      stream: false,
    })
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    )
  }
}
