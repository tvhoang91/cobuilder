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
import UpdateProjectDialog from './update-project-dialog'
import { useAuth } from '@/components/hooks/use-auth'
import Link from 'next/link'

type Project = RouterOutputs['project']['getAll'][0]

interface ProjectsTableProps {
  initialProjects: Project[]
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const { isAdmin } = useAuth()

  const { data: projects = initialProjects } = api.project.getAll.useQuery(undefined, {
    initialData: initialProjects,
    refetchOnMount: false,
  })

  const utils = api.useUtils()
  const deleteMutation = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate()
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
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Button variant="link" asChild>
                    <Link href={`/builder/${project.slug}`}>{project.title}</Link>
                  </Button>
                </TableCell>
                <TableCell>{project.slug}</TableCell>
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
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDelete(project.id)}>Delete</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                      <DialogContent>
                        <UpdateProjectDialog project={project} />
                      </DialogContent>
                    </Dialog>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
