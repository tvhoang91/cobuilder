import { z } from 'zod'
import { createTRPCRouter, designerProcedure, adminProcedure, protectedProcedure } from '@/server/api/trpc'
import { createProjectSchema, updateProjectSchema, getProjectBySlugSchema } from '@/schema'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'

export const projectRouter = createTRPCRouter({
  getAll: designerProcedure.query(async ({ ctx }) => {
    return ctx.db.selectFrom('Project').selectAll().orderBy('updatedAt', 'desc').execute()
  }),

  getById: designerProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return ctx.db.selectFrom('Project').selectAll().where('id', '=', input.id).executeTakeFirst()
  }),

  getBySlug: designerProcedure.input(getProjectBySlugSchema).query(async ({ input, ctx }) => {
    const { slug } = input

    return ctx.db.selectFrom('Project').selectAll().where('slug', '=', slug).executeTakeFirst()
  }),

  create: designerProcedure.input(createProjectSchema).mutation(async ({ input, ctx }) => {
    const baseSlug = generateSlug(input.title)

    const existingSlugs = await ctx.db
      .selectFrom('Project')
      .select('slug')
      .execute()
      .then((results) => results.map((r) => r.slug))

    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)

    return ctx.db
      .insertInto('Project')
      .values({
        title: input.title,
        description: input.description,
        slug: uniqueSlug,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  update: designerProcedure.input(updateProjectSchema).mutation(async ({ input, ctx }) => {
    const { id, title, ...updateData } = input

    // If title is being updated, regenerate slug
    let slugUpdate = {}
    if (title) {
      const baseSlug = generateSlug(title)

      // Get existing slugs excluding current project
      const existingSlugs = await ctx.db
        .selectFrom('Project')
        .select('slug')
        .where('id', '!=', id)
        .execute()
        .then((results) => results.map((r) => r.slug))

      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)
      slugUpdate = { slug: uniqueSlug }
    }

    return ctx.db
      .updateTable('Project')
      .set({
        ...updateData,
        ...(title && { title }),
        ...slugUpdate,
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    await ctx.db.deleteFrom('Project').where('id', '=', input.id).execute()
    return { success: true }
  }),
})
