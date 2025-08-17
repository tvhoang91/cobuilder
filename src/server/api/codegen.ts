import { InferenceClient } from '@huggingface/inference'
import { env } from '@/env'
import type { AiModel, Block } from '@/schema'

export async function generateCodeWireframe(
  block: Block,
  textWireframe: string,
  prompts: string[],
  aiModel: AiModel,
): Promise<string> {
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(textWireframe, prompts)

  try {
    const client = new InferenceClient(env.HUGGINGFACE_API_TOKEN)
    const chatCompletion = await client.chatCompletion({
      model: getModelName(aiModel),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    })

    const generatedCode = chatCompletion.choices[0]?.message?.content || ''
    return extractCodeFromResponse(generatedCode)
  } catch (error) {
    console.error('HuggingFace API error:', error)
    throw new Error('Failed to generate code wireframe')
  }
}

export async function iterateCodeWireframe(block: Block, prompts: string[]): Promise<string> {
  if (!block.codeWireframe) {
    throw new Error('No existing code wireframe to iterate on')
  }

  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildIterationPrompt(block.codeWireframe, prompts)

  try {
    const client = new InferenceClient(env.HUGGINGFACE_API_TOKEN)
    const chatCompletion = await client.chatCompletion({
      model: getModelName(block.aiModel || 'gwen'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    })

    const updatedCode = chatCompletion.choices[0]?.message?.content || ''
    return extractCodeFromResponse(updatedCode)
  } catch (error) {
    console.error('HuggingFace API error:', error)
    throw new Error('Failed to iterate code wireframe')
  }
}

function getModelName(aiModel: AiModel): string {
  switch (aiModel) {
    case 'anthropic':
      return 'meta-llama/Llama-3.1-8B-Instruct'
    case 'gpt':
      return 'microsoft/DialoGPT-large'
    case 'deepseek':
      return 'deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct'
    case 'gwen':
      return 'Qwen/Qwen2.5-Coder-7B-Instruct'
    default:
      return 'meta-llama/Llama-3.1-8B-Instruct'
  }
}

function buildSystemPrompt(): string {
  return `You are a Senior React and Shadcn UI developer. Your task is to write React component code based on the provided UX specifications and user requirements.
  
  IMPORTANT GUIDELINES:
  - Write the code in ONE FILE only
  - Do NOT add any state, effects, or event handling
  - This code is for UI DESIGN ONLY - no functionality
  - Use Shadcn UI components and their variants
  - Use HTML tags when appropriate
  - Use Tailwind CSS classes for styling
  - Make the design RESPONSIVE
  - Follow React best practices and modern patterns
  - Use TypeScript for type safety
  - Import Shadcn components from "@/components/ui/[component-name]"
  
  Return ONLY the React component code without any markdown formatting or explanations.`
}

function buildUserPrompt(textWireframe: string, prompts: string[]): string {
  return `Generate a React TypeScript component based on this wireframe:

${textWireframe}

Additional requirements:
${prompts.join('\n')}

Component requirements:
- Use TypeScript interfaces for props
- Use Tailwind CSS classes
- Make it responsive
- Use semantic HTML elements

Generate the complete component code:`
}

function buildIterationPrompt(currentCode: string, prompts: string[]): string {
  return `You are improving an existing React component. Maintain the existing structure while implementing the requested changes.

Current component:
${currentCode}

Please implement these changes:
${prompts.join('\n')}

Return the complete updated component code:`
}

function extractCodeFromResponse(content: string): string {
  if (!content) return ''

  const codeBlockRegex = /```(?:tsx?|javascript|jsx?)?\n?([\s\S]*?)```/g
  const match = codeBlockRegex.exec(content)

  if (match && match[1]) {
    return match[1].trim()
  }

  return content.trim()
}
