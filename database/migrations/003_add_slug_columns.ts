import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add slug column to Project table
  await db.schema
    .alterTable('Project')
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .execute()

  // Add slug column to Block table with composite unique constraint
  await db.schema
    .alterTable('Block')
    .addColumn('slug', 'text', (col) => col.notNull())
    .execute()

  // Create unique constraint for block slug within project scope
  await db.schema
    .createIndex('Block_projectId_slug_unique')
    .on('Block')
    .columns(['projectId', 'slug'])
    .unique()
    .execute()

  // Create indexes for slug lookups
  await db.schema.createIndex('Project_slug_idx').on('Project').column('slug').execute()
  await db.schema.createIndex('Block_slug_idx').on('Block').column('slug').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes first
  await db.schema.dropIndex('Block_slug_idx').execute()
  await db.schema.dropIndex('Project_slug_idx').execute()
  await db.schema.dropIndex('Block_projectId_slug_unique').execute()

  // Drop columns
  await db.schema.alterTable('Block').dropColumn('slug').execute()
  await db.schema.alterTable('Project').dropColumn('slug').execute()
}