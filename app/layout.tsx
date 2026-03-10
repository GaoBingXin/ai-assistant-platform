import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI助手平台 - 智能对话、图像生成、代码编写",
  description: "一站式AI助手平台，提供智能对话、图像生成、代码编写等多项AI服务",
  keywords: ["AI", "人工智能", "聊天机器人", "图像生成", "代码生成"],
  authors: [{ name: "AI助手团队" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://ai-assistant.com",
    title: "AI助手平台",
    description: "一站式AI助手平台，提供智能对话、图像生成、代码编写等多项AI服务",
    siteName: "AI助手平台",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
