import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Users table with role-based access
  await db.schema
    .createTable('User')
    .addColumn('id', 'text', (col) => 
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`)
    )
    .addColumn('name', 'text')
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('emailVerified', 'timestamptz')
    .addColumn('image', 'text')
    .addColumn('role', 'text', (col) => 
      col.notNull().defaultTo('GUEST').check(sql`role IN ('ADMIN', 'DESIGNER', 'GUEST')`)
    )
    .addColumn('createdAt', 'timestamptz', (col) => 
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn('updatedAt', 'timestamptz', (col) => 
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute()

  // Accounts table for OAuth providers
  await db.schema
    .createTable('Account')
    .addColumn('id', 'text', (col) => 
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`)
    )
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('User.id').onDelete('cascade')
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'integer')
    .addColumn('token_type', 'text')
    .addColumn('scope', 'text')
    .addColumn('id_token', 'text')
    .addColumn('session_state', 'text')
    .execute()

  // Add unique constraint for Account
  await db.schema
    .createIndex('Account_provider_providerAccountId_unique')
    .on('Account')
    .columns(['provider', 'providerAccountId'])
    .unique()
    .execute()

  // Sessions table for NextAuth.js
  await db.schema
    .createTable('Session')
    .addColumn('id', 'text', (col) => 
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`)
    )
    .addColumn('sessionToken', 'text', (col) => col.notNull().unique())
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('User.id').onDelete('cascade')
    )
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  // Verification tokens for NextAuth.js
  await db.schema
    .createTable('VerificationToken')
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .addPrimaryKeyConstraint('VerificationToken_pkey', ['identifier', 'token'])
    .execute()

  // Create indexes for performance
  await db.schema
    .createIndex('Account_userId_idx')
    .on('Account')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('Session_userId_idx')
    .on('Session')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('User_email_idx')
    .on('User')
    .column('email')
    .execute()

  // Set specific admin user role
  await db
    .insertInto('User')
    .values({
      email: 'tvhoang91@gmail.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: sql`NOW()`,
      updatedAt: sql`NOW()`,
    })
    .onConflict((oc) => 
      oc.column('email').doUpdateSet({
        role: 'ADMIN'
      })
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order due to foreign key constraints
  await db.schema.dropTable('VerificationToken').execute()
  await db.schema.dropTable('Session').execute()
  await db.schema.dropTable('Account').execute()
  await db.schema.dropTable('User').execute()
}