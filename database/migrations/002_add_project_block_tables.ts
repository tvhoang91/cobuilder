import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Project table
  await db.schema
    .createTable('Project')
    .addColumn('id', 'text', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Block table with prompt history and AI model
  await db.schema
    .createTable('Block')
    .addColumn('id', 'text', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()::text`))
    .addColumn('projectId', 'text', (col) => col.notNull().references('Project.id').onDelete('cascade'))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('textWireframe', 'text')
    .addColumn('codeWireframe', 'text')
    .addColumn('promptHistory', 'jsonb', (col) => col.notNull().defaultTo('[]'))
    .addColumn('aiModel', 'text')
    .addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Create indexes for performance
  await db.schema.createIndex('Block_projectId_idx').on('Block').column('projectId').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order due to foreign key constraints
  await db.schema.dropTable('Block').execute()
  await db.schema.dropTable('Project').execute()
}
