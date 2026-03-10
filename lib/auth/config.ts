import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

// 开发模式下的演示用户
const demoUser = {
  id: "demo-user-id",
  email: "demo@example.com",
  name: "Demo User",
  image: null,
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // 邮箱/密码认证（开发用）
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        // 开发模式：接受任何邮箱，返回演示用户
        if (process.env.NODE_ENV === "development") {
          return demoUser
        }
        
        // 生产模式：这里应该验证数据库
        return null
      },
    }),

    // Google OAuth（可选）
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // GitHub OAuth（可选）
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  
  session: {
    strategy: "jwt",
  },
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
  debug: process.env.NODE_ENV === "development",
})
