import { NextRequest, NextResponse } from "next/server"
import { handleChatRequest, ChatRequest } from "@/lib/ai/chat"
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

    const chatRequest: ChatRequest = {
      messages,
      conversationId,
      userId: user.id,
      stream,
    }

    // 流式响应
    if (stream) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await handleChatRequest(chatRequest, (chunk) => {
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

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }

    // 非流式响应
    const response = await handleChatRequest(chatRequest)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    const limit = parseInt(searchParams.get("limit") || "20")

    // 获取对话历史
    const conversations = await db.conversation.findMany({
      where: {
        userId: user.id,
        ...(conversationId ? { id: conversationId } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json(
      { error: "获取对话历史失败" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "缺少对话ID" }, { status: 400 })
    }

    // 验证对话所有权
    const conversation = await db.conversation.findFirst({
      where: { id: conversationId, userId: user.id },
    })

    if (!conversation) {
      return NextResponse.json({ error: "对话不存在或没有权限" }, { status: 404 })
    }

    // 删除对话
    await db.conversation.delete({
      where: { id: conversationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete conversation error:", error)
    return NextResponse.json(
      { error: "删除对话失败" },
      { status: 500 }
    )
  }
}
