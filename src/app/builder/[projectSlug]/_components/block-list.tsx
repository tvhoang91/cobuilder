'use client'

import { api } from '@/trpc/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import type { RouterOutputs } from '@/trpc/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import UpdateBlockDialog from './update-block-dialog'
import { useAuth } from '@/components/hooks/use-auth'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Block = RouterOutputs['block']['getByProject'][0]

interface BlockListProps {
  initialBlocks: Block[]
  projectId: string
}

export function BlockList({ initialBlocks, projectId }: BlockListProps) {
  const { isAdmin } = useAuth()
  const params = useParams()
  const projectSlug = params.projectSlug as string

  const { data: blocks = initialBlocks } = api.block.getByProject.useQuery(
    { projectId },
    {
      initialData: initialBlocks,
      refetchOnMount: false,
    },
  )

  const utils = api.useUtils()
  const deleteMutation = api.block.delete.useMutation({
    onSuccess: async () => {
      await utils.block.getByProject.invalidate({ projectId })
    },
  })

  const handleDelete = (id: string) => {
    if (deleteMutation.isPending) return
    deleteMutation.mutate({ id })
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((block) => (
              <TableRow key={block.id}>
                <TableCell>
                  <Button variant="link" asChild>
                    <Link href={`/builder/${projectSlug}/${block.slug}`}>{block.title}</Link>
                  </Button>
                </TableCell>
                <TableCell>{block.slug}</TableCell>
                <TableCell className="w-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <Dialog>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DialogTrigger asChild>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DialogTrigger>
                        {isAdmin && <DropdownMenuItem onClick={() => handleDelete(block.id)}>Delete</DropdownMenuItem>}
                      </DropdownMenuContent>
                      <DialogContent>
                        <UpdateBlockDialog block={block} />
                      </DialogContent>
                    </Dialog>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {blocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No blocks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
