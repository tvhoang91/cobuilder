'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Project, updateProjectSchema } from '@/schema'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'

const formValuesSchema = updateProjectSchema.omit({ id: true })
type FormValues = z.infer<typeof formValuesSchema>

export default function UpdateProjectDialog({ project, children }: { project: Project; children: React.ReactNode }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formValuesSchema),
    defaultValues: async () => ({
      title: project.title,
      description: project.description,
    }),
  })

  const utils = api.useUtils()
  const updateProjectMutation = api.project.update.useMutation()
  async function onSubmit(data: FormValues) {
    if (updateProjectMutation.isPending) return
    await updateProjectMutation.mutateAsync({ id: project.id, ...data })
    form.reset()
    toast('Project updated successfully')
    utils.project.getAll.invalidate()
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
                      <Input placeholder="Project Description" {...field} />
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
      </DialogContent>
    </Dialog>
  )
}
