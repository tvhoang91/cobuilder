import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'ADMIN' | 'DESIGNER' | 'GUEST'
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: 'ADMIN' | 'DESIGNER' | 'GUEST'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
