'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import type { Block } from '@/schema/block-schema'

interface CodeWireframeGenerationProps {
  block: Block
}

export function CodeWireframeGeneration({ block }: CodeWireframeGenerationProps) {
  const [textWireframe, setTextWireframe] = useState(defaultTextWireframe)
  const [prompts, setPrompts] = useState(defaultPrompts)
  const [aiModel, setAiModel] = useState<'gpt' | 'anthropic' | 'deepseek' | 'gwen'>('gwen')

  const utils = api.useUtils()
  const generateMutation = api.block.generateCodeWireframe.useMutation({
    onSuccess: () => {
      toast.success('Code wireframe generated successfully!')
      utils.block.getBySlug.invalidate()
    },
    onError: (error) => {
      toast.error(`Failed to generate: ${error.message}`)
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

  const handleGenerate = () => {
    // const validPrompts = prompts.filter((p) => p.trim() !== '')
    const validPrompts = ['Begin Generating']
    if (!textWireframe.trim() || validPrompts.length === 0) {
      toast.error('Please provide text wireframe and at least one prompt')
      return
    }

    generateMutation.mutate({
      id: block.id,
      textWireframe: textWireframe.trim(),
      prompts: validPrompts,
      aiModel,
    })
  }

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      <div className="col-span-1 space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Generation Prompts</Label>
                {/* <Button type="button" onClick={addPrompt} variant="outline" size="sm">
                  Add
                </Button> */}
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
                <Label className="text-sm">AI Model</Label>
                <Select value={aiModel} onValueChange={(value: any) => setAiModel(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="gpt">GPT</SelectItem>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="gwen">Gwen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="flex-1">
                {generateMutation.isPending ? 'Generating...' : 'Generate UI'}
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
                Describe the UI structure and components you want to generate
              </p>
              <Textarea
                id="textWireframe"
                placeholder="Describe the UI structure and components you want to generate..."
                value={textWireframe}
                onChange={(e) => setTextWireframe(e.target.value)}
                className="min-h-[400px] flex-1 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const defaultPrompts = [
  'This Promt is mean to help Designer quickly generate a Text-base UI wireframe for the block. The feature will coming soon',
]
const defaultTextWireframe = `# Login Form UI Layout

## Overall Container
- Centered card container with max width of 400px
- White background with subtle shadow
- Rounded corners for modern appearance
- Vertical padding and margin for spacing

## Header Section
- Application logo or icon (centered)
- "Sign In" or "Login" title (large, bold text)
- Optional subtitle or description text

## Form Fields
1. **Email/Username Input**
   - Label: "Email" or "Username"
   - Text input field with placeholder
   - Full width of container
   - Border with focus states

2. **Password Input**
   - Label: "Password"
   - Password input field with placeholder
   - Show/hide password toggle button
   - Full width of container

3. **Optional: Remember Me**
   - Checkbox with "Remember me" label
   - Left-aligned below password field

## Action Buttons
- **Primary Login Button**
  - Full width
  - Primary color background
  - "Sign In" or "Login" text
  - Loading state support

- **Secondary Actions**
  - "Forgot Password?" link (right-aligned)
  - "Create Account" or "Sign Up" link (centered)

## Footer (Optional)
- "Or continue with" divider
- Social login buttons (Google, GitHub, etc.)
- Terms of service and privacy policy links

## Responsive Behavior
- Mobile-friendly with touch-friendly button sizes
- Proper spacing and typography scaling
- Form validation error states`
