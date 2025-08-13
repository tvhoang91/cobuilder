import type { ColumnType } from 'kysely'

export type Generated<T> = ColumnType<T, never, never>
export type Timestamp = ColumnType<Date, Date | string, Date | string>
