import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { env } from '@/env.js'
import type { UserTable, AccountTable, SessionTable, VerificationTokenTable } from '@/schema'

export interface Database {
  User: UserTable
  Account: AccountTable
  Session: SessionTable
  VerificationToken: VerificationTokenTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
