'use client'

import { api } from '@/trpc/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import type { RouterOutputs } from '@/trpc/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Project = RouterOutputs['project']['getAll'][0]

interface ProjectsTableProps {
  initialProjects: Project[]
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const { data: projects = initialProjects } = api.project.getAll.useQuery(undefined, {
    initialData: initialProjects,
    refetchOnMount: false,
  })

  const utils = api.useUtils()
  const updateMutation = api.project.update.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate()
    },
  })
  const deleteMutation = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate()
    },
  })

  const handleUpdate = (id: string, title: string, description: string) => {
    if (updateMutation.isPending) return
    updateMutation.mutate({ id, title, description })
  }

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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="flex items-center gap-2 font-medium">{project.title}</TableCell>
                <TableCell>{project.slug}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update</DropdownMenuLabel>
                      <DropdownMenuLabel>Delete</DropdownMenuLabel>
                    </DropdownMenuContent>
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
