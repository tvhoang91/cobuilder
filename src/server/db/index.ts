import { Kysely, PostgresDialect } from 'kysely'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { env } from '@/env.js'
import type { UserTable, AccountTable, SessionTable, VerificationTokenTable, ProjectTable, BlockTable } from '@/schema'
import ws from 'ws'

export interface Database {
  Project: ProjectTable
  Block: BlockTable
  User: UserTable
  Account: AccountTable
  Session: SessionTable
  VerificationToken: VerificationTokenTable
}

if (env.NODE_ENV === 'production') {
  // Optimize for production serverless environments
  neonConfig.useSecureWebSocket = true
}
neonConfig.webSocketConstructor = ws

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
