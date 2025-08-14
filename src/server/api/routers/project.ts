import { z } from 'zod'
import { createTRPCRouter, designerProcedure, protectedProcedure } from '@/server/api/trpc'
import { createProjectSchema, updateProjectSchema } from '@/schema'

export const projectRouter = createTRPCRouter({
  getAll: designerProcedure.query(async ({ ctx }) => {
    return ctx.db.selectFrom('Project').selectAll().orderBy('updatedAt', 'desc').execute()
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return ctx.db.selectFrom('Project').selectAll().where('id', '=', input.id).executeTakeFirst()
  }),

  create: designerProcedure.input(createProjectSchema).mutation(async ({ input, ctx }) => {
    return ctx.db
      .insertInto('Project')
      .values({
        title: input.title,
        description: input.description,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  update: designerProcedure.input(updateProjectSchema).mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    return ctx.db.updateTable('Project').set(updateData).where('id', '=', id).returningAll().executeTakeFirstOrThrow()
  }),

  delete: designerProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    await ctx.db.deleteFrom('Project').where('id', '=', input.id).execute()
    return { success: true }
  }),
})
