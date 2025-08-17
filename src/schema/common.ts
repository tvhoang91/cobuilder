import type { ColumnType } from 'kysely'
import { z } from 'zod'

export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

export type Generated<T> = ColumnType<T, never, never>
export type Timestamp = ColumnType<Date, Date | string, Date | string>
export type Json<T> = ColumnType<T, string, string>
