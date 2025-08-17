'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
          <CardContent className="h-full">
            <div className="flex h-full flex-col">
              <Label htmlFor="textWireframe" className="mb-2">
                Wireframe
              </Label>
              <p className="text-muted-foreground mb-2 text-sm">
                Here should show a Code tab in text and a Preview tab with UI
              </p>
              <Textarea
                id="textWireframe"
                placeholder="Describe the UI structure and components you want to generate..."
                className="min-h-[400px] flex-1 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
