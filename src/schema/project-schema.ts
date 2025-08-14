import { z } from 'zod'
import { Generated } from './common'
import type { Selectable } from 'kysely'

export interface ProjectTable {
  id: Generated<string>
  title: string
  description: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export type Project = Selectable<ProjectTable>

export const createProjectSchema = z.object({
  title: z.string().min(3).max(300),
  description: z.string().min(3).max(1000),
})
export const updateProjectSchema = z.object({
  id: z.string(),
  ...createProjectSchema.shape,
})
export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
