import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Projects</h1>
        {/* <ProjectsTable initialProjects={projects} /> */}
      </div>
    </HydrateClient>
  )
}
