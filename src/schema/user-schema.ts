import { z } from 'zod'
import { Generated, Timestamp } from './common'
import type { Selectable } from 'kysely'

export interface UserTable {
  id: Generated<string>
  name: string | null
  email: string
  emailVerified: Timestamp | null
  image: string | null
  role: 'ADMIN' | 'DESIGNER' | 'GUEST'
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface AccountTable {
  id: Generated<string>
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}

export interface SessionTable {
  id: Generated<string>
  sessionToken: string
  userId: string
  expires: Timestamp
}

export interface VerificationTokenTable {
  identifier: string
  token: string
  expires: Timestamp
}

export type User = Selectable<UserTable>
export type UserRole = User['role']

export const updateUserRoleSchema = z.object({
  id: z.string(),
  role: z.enum(['DESIGNER', 'GUEST']),
})
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>
