import { z } from 'zod'
import { createTRPCRouter, designerProcedure } from '@/server/api/trpc'
import { createBlockSchema, generateBlockCodeWireframeSchema, updateBlockSchema, getBlockBySlugSchema } from '@/schema'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'
import { iterateBlockCodeWireframeSchema } from '@/schema/block-schema'
import { generateCodeWireframe, iterateCodeWireframe } from '../codegen'

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
      .selectAll('Block')
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
        promptHistory: '[]',
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

  generateCodeWireframe: designerProcedure.input(generateBlockCodeWireframeSchema).mutation(async ({ input, ctx }) => {
    const { id, prompts, textWireframe, aiModel } = input
    const block = await ctx.db.selectFrom('Block').selectAll().where('id', '=', id).executeTakeFirstOrThrow()

    const codeWireframe = generateCodeWireframe(block, textWireframe, prompts, aiModel)

    return ctx.db
      .updateTable('Block')
      .set({
        promptHistory: JSON.stringify(prompts),
        textWireframe,
        codeWireframe,
        aiModel,
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }),

  iterateCodeWireframe: designerProcedure.input(iterateBlockCodeWireframeSchema).mutation(async ({ input, ctx }) => {
    const { id, prompts } = input
    const block = await ctx.db.selectFrom('Block').selectAll().where('id', '=', id).executeTakeFirstOrThrow()
    const fullPromts = [...block.promptHistory, ...prompts]

    const codeWireframe = iterateCodeWireframe(block, fullPromts)

    return ctx.db
      .updateTable('Block')
      .set({
        promptHistory: JSON.stringify(fullPromts),
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
