import { z } from 'zod'
import { createTRPCRouter, designerProcedure, protectedProcedure } from '@/server/api/trpc'
import {
  createBlockSchema,
  promptBlockSchema,
  generateBlockTextWireframeSchema,
  generateBlockCodeWireframeSchema,
} from '@/schema'
import { sql } from 'kysely'

export const blockRouter = createTRPCRouter({
  getByProject: designerProcedure.input(z.object({ projectId: z.string() })).query(async ({ input, ctx }) => {
    return ctx.db
      .selectFrom('Block')
      .selectAll()
      .where('projectId', '=', input.projectId)
      .orderBy('updatedAt', 'desc')
      .execute()
  }),

  getById: designerProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return ctx.db.selectFrom('Block').selectAll().where('id', '=', input.id).executeTakeFirst()
  }),

  create: designerProcedure.input(createBlockSchema).mutation(async ({ input, ctx }) => {
    return ctx.db
      .insertInto('Block')
      .values({
        projectId: input.projectId,
        title: input.title,
        promptHistory: [],
        aiModel: input.aiModel,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  prompt: designerProcedure.input(promptBlockSchema).mutation(async ({ input, ctx }) => {
    return ctx.db
      .updateTable('Block')
      .set({
        promptHistory: sql`array_append(promptHistory, ${input.prompts})`,
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  generateTextWireframe: designerProcedure.input(generateBlockTextWireframeSchema).mutation(async ({ input, ctx }) => {
    const textWireframe = 'generateTextWireframe(input)'

    return ctx.db
      .updateTable('Block')
      .set({
        textWireframe,
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  generateCodeWireframe: designerProcedure.input(generateBlockCodeWireframeSchema).mutation(async ({ input, ctx }) => {
    const codeWireframe = 'generateCodeWireframe(input)'

    return ctx.db
      .updateTable('Block')
      .set({
        codeWireframe,
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  delete: designerProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    await ctx.db.deleteFrom('Block').where('id', '=', input.id).execute()
    return { success: true }
  }),
})
