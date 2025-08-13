import { createTRPCRouter, protectedProcedure, adminProcedure, designerProcedure } from '@/server/api/trpc'
import { updateUserRoleSchema } from '@/schema'

export const userRouter = createTRPCRouter({
  // Get current user profile (any authenticated user)
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user
  }),

  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.selectFrom('User').select(['id', 'name', 'email', 'image', 'role']).execute()
    return users
  }),

  // Update user role (Admin only)
  updateRole: adminProcedure.input(updateUserRoleSchema).mutation(async ({ ctx, input }) => {
    // Prevent admin from changing their own role
    if (input.id === ctx.session.user.id) {
      throw new Error('Cannot change your own role')
    }

    const updatedUser = await ctx.db
      .updateTable('User')
      .set({ role: input.role })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirst()

    return updatedUser
  }),

  // Get users for design collaboration (Designer and Admin can see other users)
  getCollaborators: designerProcedure.query(async ({ ctx }) => {
    const users = await ctx.db
      .selectFrom('User')
      .select(['id', 'name', 'email', 'image', 'role'])
      .where('role', 'in', ['ADMIN', 'DESIGNER'])
      .execute()

    return users
  }),
})
