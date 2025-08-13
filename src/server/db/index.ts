import { Kysely, PostgresDialect } from 'kysely'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { env } from '@/env.js'
import type { UserTable, AccountTable, SessionTable, VerificationTokenTable } from '@/schema'

export interface Database {
  User: UserTable
  Account: AccountTable
  Session: SessionTable
  VerificationToken: VerificationTokenTable
}

// Configure Neon for different environments
if (env.NODE_ENV === 'production') {
  // Optimize for production serverless environments
  neonConfig.fetchConnectionCache = true
  neonConfig.useSecureWebSocket = true
} else {
  // Development settings - simpler configuration
  neonConfig.fetchConnectionCache = false
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
