'use client'

import { api } from '@/trpc/react'
import { CodeWireframeGeneration } from './code-wireframe-generation'
import { CodeWireframeIteration } from './code-wireframe-iteration'
import type { Block } from '@/schema/block-schema'

interface BlockWireframeClientProps {
  projectSlug: string
  blockSlug: string
  initialBlock: Block
}

export function BlockWireframeClient({ projectSlug, blockSlug, initialBlock }: BlockWireframeClientProps) {
  const { data: block } = api.block.getBySlug.useQuery(
    { projectSlug, blockSlug },
    {
      initialData: initialBlock,
      refetchOnMount: false,
    },
  )

  if (!block) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Block not found</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        Block {!block.codeWireframe ? 'Generate' : 'Building'}:
        <span className="text-muted-foreground ml-2 text-xl font-medium">{block.title}</span>
      </h1>

      {!block.codeWireframe ? <CodeWireframeGeneration block={block} /> : <CodeWireframeIteration block={block} />}
    </>
  )
}
