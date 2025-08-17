import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { BlockList } from './_components/block-list'
import NewBlockDialog from './_components/new-block-dialog'
import { Button } from '@/components/ui/button'

interface ProjectPageProps {
  params: Promise<{ projectSlug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  const { projectSlug } = await params
  const project = await api.project.getBySlug({ slug: projectSlug })

  if (!project) {
    redirect('/projects')
  }

  const blocks = await api.block.getByProject({ projectId: project.id })

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            UI Blocks:
            <span className="text-muted-foreground ml-2 text-xl font-medium">{project.title}</span>
          </h1>
          <NewBlockDialog projectId={project.id}>
            <Button>New Block</Button>
          </NewBlockDialog>
        </div>
        <BlockList initialBlocks={blocks} projectId={project.id} />
      </div>
    </HydrateClient>
  )
}
