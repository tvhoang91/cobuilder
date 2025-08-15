import { z } from 'zod'
import { Generated, slugSchema } from './common'
import type { Selectable } from 'kysely'

const aiModelSchema = z.enum(['gpt', 'anthropic', 'deepseek', 'gwen'])
export type AiModel = z.infer<typeof aiModelSchema>
export interface BlockTable {
  id: Generated<string>
  projectId: string
  title: string
  slug: string
  textWireframe: string | null
  codeWireframe: string | null
  promptHistory: string[]
  aiModel: AiModel | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export type Block = Selectable<BlockTable>

export const createBlockSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3).max(300),
})
export const updateBlockSchema = z.object({ id: z.string(), ...createBlockSchema.shape })
export const getBlockBySlugSchema = z.object({
  projectSlug: slugSchema,
  blockSlug: slugSchema,
})
export const promptBlockSchema = z.object({
  id: z.string(),
  prompts: z.array(z.string()),
  aiModel: aiModelSchema.optional(),
})
export const generateBlockTextWireframeSchema = z.object({
  id: z.string(),
  prompts: z.array(z.string()),
  aiModel: aiModelSchema.optional(),
})
export const generateBlockCodeWireframeSchema = z.object({
  id: z.string(),
  prompts: z.array(z.string()),
  aiModel: aiModelSchema.optional(),
})
export type CreateBlock = z.infer<typeof createBlockSchema>
export type UpdateBlock = z.infer<typeof updateBlockSchema>
export type GetBlockBySlug = z.infer<typeof getBlockBySlugSchema>
export type PromptBlock = z.infer<typeof promptBlockSchema>
export type GenerateBlockTextWireframe = z.infer<typeof generateBlockTextWireframeSchema>
export type GenerateBlockCodeWireframe = z.infer<typeof generateBlockCodeWireframeSchema>
