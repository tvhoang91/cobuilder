'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import type { Block } from '@/schema/block-schema'

interface CodeWireframeIterationProps {
  block: Block
}

export function CodeWireframeIteration({ block }: CodeWireframeIterationProps) {
  const [prompts, setPrompts] = useState([''])

  const utils = api.useUtils()
  const iterateMutation = api.block.iterateCodeWireframe.useMutation({
    onSuccess: () => {
      toast.success('Code wireframe updated successfully!')
      utils.block.getBySlug.invalidate()
      setPrompts([''])
    },
    onError: (error) => {
      toast.error(`Failed to iterate: ${error.message}`)
    },
  })

  const addPrompt = () => {
    setPrompts([...prompts, ''])
  }

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  const removePrompt = (index: number) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter((_, i) => i !== index))
    }
  }

  const handleIterate = () => {
    toast.info('Updating code coming soon...')
    return

    const validPrompts = prompts.filter((p) => p.trim() !== '')
    if (validPrompts.length === 0) {
      toast.error('Please provide at least one iteration prompt')
      return
    }

    iterateMutation.mutate({
      id: block.id,
      prompts: validPrompts,
    })
  }

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      <div className="col-span-1 space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Builder Prompts</Label>
              </div>
              <div className="space-y-3">
                {prompts.map((prompt, index) => (
                  <div key={index} className="space-y-2">
                    <Textarea
                      placeholder={`Prompt ${index + 1}...`}
                      value={prompt}
                      onChange={(e) => updatePrompt(index, e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    {prompts.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePrompt(index)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label className="text-sm">AI Model: {block.aiModel}</Label>
              </div>
              <Button onClick={handleIterate} disabled={iterateMutation.isPending} className="flex-1">
                {iterateMutation.isPending ? 'Generating...' : 'Update UI'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2">
        <Card className="h-full">
          <CardContent className="h-full p-4">
            <Tabs defaultValue="code" className="flex h-full flex-col">
              <TabsList className="w-fit">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-4 flex-1">
                <div className="flex h-full flex-col">
                  <pre className="flex-1 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
                    <code>{block.codeWireframe || '// No code generated yet'}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4 flex-1">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="mb-2 text-gray-500">Preview Coming Soon</p>
                    <p className="text-sm text-gray-400">
                      Live preview of the generated component will be available here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
