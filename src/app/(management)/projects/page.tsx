import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { ProjectsTable } from './_components/projects-table'
import NewProjectDialog from './_components/new-project-dialog'
import { Button } from '@/components/ui/button'

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  const projects = await api.project.getAll()

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <NewProjectDialog>
            <Button>New Project</Button>
          </NewProjectDialog>
        </div>
        <ProjectsTable initialProjects={projects} />
      </div>
    </HydrateClient>
  )
}
