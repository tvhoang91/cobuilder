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
import { createBlockSchema } from '@/schema/block-schema'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { useState } from 'react'

type FormValues = z.infer<typeof createBlockSchema>

interface NewBlockDialogProps {
  children: React.ReactNode
  projectId: string
}

export default function NewBlockDialog({ children, projectId }: NewBlockDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(createBlockSchema),
    defaultValues: {
      projectId,
      title: '',
    },
  })

  function onOpenChange(open: boolean) {
    form.reset({ projectId, title: '' })
    setOpen(open)
  }

  const utils = api.useUtils()
  const createBlockMutation = api.block.create.useMutation()
  async function onSubmit(data: FormValues) {
    if (createBlockMutation.isPending) return
    await createBlockMutation.mutateAsync(data)
    form.reset({ projectId, title: '' })
    toast('Block created successfully')
    utils.block.getByProject.invalidate({ projectId })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Block</DialogTitle>
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
                      <Input placeholder="Block Title" {...field} />
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
              <Button type="submit">{createBlockMutation.isPending ? 'Creating...' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
