'use client'

import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Block, updateBlockSchema } from '@/schema'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { useMemo } from 'react'

const formValuesSchema = updateBlockSchema.omit({ id: true })
type FormValues = z.infer<typeof formValuesSchema>

export default function UpdateBlockDialog({ block }: { block: Block }) {
  const defaultValues = useMemo(() => {
    return { projectId: block.projectId, title: block.title }
  }, [block])
  const form = useForm<FormValues>({
    resolver: zodResolver(formValuesSchema),
    defaultValues,
  })

  const utils = api.useUtils()
  const updateBlockMutation = api.block.update.useMutation()
  async function onSubmit(data: FormValues) {
    if (updateBlockMutation.isPending) return
    await updateBlockMutation.mutateAsync({ id: block.id, ...data })
    toast('Block updated successfully')
    utils.block.getByProject.invalidate({ projectId: block.projectId })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Block</DialogTitle>
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
            <Button type="submit">{updateBlockMutation.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
