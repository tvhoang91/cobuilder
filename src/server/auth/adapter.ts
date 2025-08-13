import { type Adapter } from 'next-auth/adapters'
import { db } from '@/server/db'

export function KyselyAdapter(): Adapter {
  const { adapter } = db.getExecutor()
  const { supportsReturning } = adapter

  return {
    async createUser(data) {
      const user = { ...data }
      await db
        .insertInto('User')
        .values({ ...user, role: user.email === 'tvhoang91@gmail.com' ? 'ADMIN' : 'GUEST' })
        .executeTakeFirstOrThrow()

      return user
    },
    async getUser(id) {
      const result = await db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirst()
      if (!result) return null
      return result
    },
    async getUserByEmail(email) {
      const result = await db.selectFrom('User').selectAll().where('email', '=', email).executeTakeFirst()
      if (!result) return null
      return result
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom('User')
        .innerJoin('Account', 'User.id', 'Account.userId')
        .selectAll('User')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirst()
      if (!result) return null
      return result
    },
    async updateUser(user) {
      const { id, createdAt, updatedAt, ...userData } = user
      const query = db.updateTable('User').set(userData).where('id', '=', id)
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() => db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirstOrThrow())
      return await result
    },
    async deleteUser(userId) {
      await db.deleteFrom('User').where('User.id', '=', userId).executeTakeFirst()
    },
    async linkAccount(account) {
      await db.insertInto('Account').values(account).executeTakeFirstOrThrow()
      return account
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom('Account')
        .where('providerAccountId', '=', providerAccountId)
        .where('provider', '=', provider)
        .executeTakeFirstOrThrow()
    },
    async createSession(session) {
      await db.insertInto('Session').values(session).execute()
      return session
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom('Session')
        .innerJoin('User', 'User.id', 'Session.userId')
        .selectAll('User')
        .select(['Session.expires', 'Session.userId'])
        .where('sessionToken', '=', sessionToken)
        .executeTakeFirst()
      if (!result) return null
      const { userId, expires, ...user } = result
      const session = { sessionToken, userId, expires }

      return { user, session }
    },
    async updateSession(session) {
      const sessionData = session
      const query = db.updateTable('Session').set(sessionData).where('sessionToken', '=', session.sessionToken)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom('Session')
              .selectAll()
              .where('Session.sessionToken', '=', sessionData.sessionToken)
              .executeTakeFirstOrThrow()
          })

      return result
    },
    async deleteSession(sessionToken) {
      await db.deleteFrom('Session').where('sessionToken', '=', sessionToken).executeTakeFirstOrThrow()
    },
    async createVerificationToken(data) {
      await db.insertInto('VerificationToken').values(data).execute()
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const query = db.deleteFrom('VerificationToken').where('token', '=', token).where('identifier', '=', identifier)

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom('VerificationToken')
            .selectAll()
            .where('token', '=', token)
            .where('identifier', '=', identifier)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst()
              return res
            })
      if (!result) return null
      return result
    },
  }
}
