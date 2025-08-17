import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { CodeWireframeGeneration } from './_components/code-wireframe-generation'
import { CodeWireframeIteration } from './_components/code-wireframe-iteration'

interface BlockPageProps {
  params: Promise<{ projectSlug: string; blockSlug: string }>
}

export default async function BlockPage({ params }: BlockPageProps) {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  const { projectSlug, blockSlug } = await params
  const block = await api.block.getBySlug({ projectSlug, blockSlug })

  if (!block) {
    redirect(`/builder/${projectSlug}`)
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Block {!block.codeWireframe ? 'Generate' : 'Building'}:
          <span className="text-muted-foreground ml-2 text-xl font-medium">{block.title}</span>
        </h1>

        {!block.codeWireframe ? <CodeWireframeGeneration block={block} /> : <CodeWireframeIteration block={block} />}
      </div>
    </HydrateClient>
  )
}
