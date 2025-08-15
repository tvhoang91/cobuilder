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
import { createProjectSchema } from '@/schema/project-schema'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValues = z.infer<typeof createProjectSchema>

export default function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const utils = api.useUtils()
  const createProjectMutation = api.project.create.useMutation()
  async function onSubmit(data: FormValues) {
    if (createProjectMutation.isPending) return
    await createProjectMutation.mutateAsync(data)
    form.reset()
    toast('Project created successfully')
    utils.project.getAll.invalidate()
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
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
              <Button type="submit">{createProjectMutation.isPending ? 'Creating...' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
