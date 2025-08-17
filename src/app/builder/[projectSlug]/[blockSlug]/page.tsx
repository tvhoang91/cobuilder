import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { BlockWireframeClient } from './_components/block-wireframe-client'

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
        <BlockWireframeClient projectSlug={projectSlug} blockSlug={blockSlug} initialBlock={block} />
      </div>
    </HydrateClient>
  )
}
