'use client'

import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Project, updateProjectSchema } from '@/schema'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { useMemo } from 'react'

const formValuesSchema = updateProjectSchema.omit({ id: true })
type FormValues = z.infer<typeof formValuesSchema>

export default function UpdateProjectDialog({ project }: { project: Project }) {
  const defaultValues = useMemo(() => {
    return { title: project.title, description: project.description }
  }, [project])
  const form = useForm<FormValues>({
    resolver: zodResolver(formValuesSchema),
    defaultValues,
  })

  const utils = api.useUtils()
  const updateProjectMutation = api.project.update.useMutation()
  async function onSubmit(data: FormValues) {
    if (updateProjectMutation.isPending) return
    await updateProjectMutation.mutateAsync({ id: project.id, ...data })
    toast('Project updated successfully')
    utils.project.getAll.invalidate()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Project</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{updateProjectMutation.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
