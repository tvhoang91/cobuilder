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

// Configure Neon for serverless environments
// neonConfig.webSocketConstructor = ws
// if (env.NODE_ENV === 'production') {
//   neonConfig.useSecureWebSocket = true
//   neonConfig.pipelineConnect = false
// }

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
    // max: 1, // Limit connections for serverless
    // idleTimeoutMillis: 0, // Disable idle timeout
    // connectionTimeoutMillis: 5000, // 5 second timeout
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
