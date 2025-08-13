import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { UsersTable } from './_components/users-table'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await api.user.getAllUsers()

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Administration</h1>
        <UsersTable initialUsers={users} />
      </div>
    </HydrateClient>
  )
}
