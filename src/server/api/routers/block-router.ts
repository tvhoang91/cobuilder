import { z } from 'zod'
import { createTRPCRouter, designerProcedure } from '@/server/api/trpc'
import {
  createBlockSchema,
  promptBlockSchema,
  generateBlockTextWireframeSchema,
  generateBlockCodeWireframeSchema,
  updateBlockSchema,
  getBlockBySlugSchema,
} from '@/schema'
import { sql } from 'kysely'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'

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

  getBySlug: designerProcedure.input(getBlockBySlugSchema).query(async ({ input, ctx }) => {
    const { projectSlug, blockSlug } = input

    return ctx.db
      .selectFrom('Block')
      .innerJoin('Project', 'Block.projectId', 'Project.id')
      .selectAll()
      .where('Project.slug', '=', projectSlug)
      .where('Block.slug', '=', blockSlug)
      .executeTakeFirst()
  }),

  create: designerProcedure.input(createBlockSchema).mutation(async ({ input, ctx }) => {
    const baseSlug = generateSlug(input.title)

    const existingSlugs = await ctx.db
      .selectFrom('Block')
      .select('slug')
      .where('projectId', '=', input.projectId)
      .execute()
      .then((results) => results.map((r) => r.slug))

    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)

    return ctx.db
      .insertInto('Block')
      .values({
        projectId: input.projectId,
        title: input.title,
        slug: uniqueSlug,
        promptHistory: [],
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  update: designerProcedure.input(updateBlockSchema).mutation(async ({ input, ctx }) => {
    const { id, projectId, title } = input

    const baseSlug = generateSlug(title)

    const existingSlugs = await ctx.db
      .selectFrom('Block')
      .select('slug')
      .where('projectId', '=', projectId)
      .where('id', '!=', id)
      .execute()
      .then((results) => results.map((r) => r.slug))

    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)

    return ctx.db
      .updateTable('Block')
      .set({
        title,
        slug: uniqueSlug,
      })
      .where('id', '=', id)
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
