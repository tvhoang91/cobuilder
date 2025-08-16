import * as path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { Migrator, FileMigrationProvider } from 'kysely'
import { db } from '../src/server/db/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrateToLatest() {
  console.log('🔄 Running database migrations...')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✅ Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`❌ Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('❌ Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  console.log('✅ All migrations completed successfully')
  await db.destroy()
}

async function migrateDown() {
  console.log('🔄 Rolling back last migration...')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  })

  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✅ Migration "${it.migrationName}" was rolled back successfully`)
    } else if (it.status === 'Error') {
      console.error(`❌ Failed to roll back migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('❌ Failed to roll back migration')
    console.error(error)
    process.exit(1)
  }

  console.log('✅ Migration rolled back successfully')
  await db.destroy()
}

// Check command line arguments
const command = process.argv[2]

if (command === 'down') {
  migrateDown()
} else {
  migrateToLatest()
}
