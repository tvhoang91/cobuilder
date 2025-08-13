import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'

export const userRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(posts).values({
      name: input.name,
      createdById: ctx.session.user.id,
    })
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })

    return post ?? null
  }),
})
