import type { NextAuthConfig, DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { env } from '@/env.js'
import type { User as UserType } from '@/schema'
import { KyselyAdapter } from './adapter'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: UserType
  }
  interface User extends UserType {}
}

export const authConfig: NextAuthConfig = {
  adapter: KyselyAdapter(),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === 'google') {
        // Allow all Google users to sign in, they'll get GUEST role by default
        return true
      }
      return false
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'database' },
}
