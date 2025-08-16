import { api, HydrateClient } from '@/trpc/server'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

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

  const { title, ...otherData } = block

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Block:
          <span className="text-muted-foreground ml-2 text-xl font-medium">{title}</span>
        </h1>
        <pre className="overflow-auto rounded-lg bg-gray-100 p-4">
          <code>{JSON.stringify(otherData, null, 2)}</code>
        </pre>
      </div>
    </HydrateClient>
  )
}
