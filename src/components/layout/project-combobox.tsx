'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { api } from '@/trpc/react'

interface ProjectComboboxProps {
  currentProjectSlug: string
}

export default function ProjectCombobox({ currentProjectSlug }: ProjectComboboxProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { data: projects = [], isLoading } = api.project.getAll.useQuery()
  const currentProject = projects.find((project) => project.slug === currentProjectSlug)

  const handleProjectSelect = (projectSlug: string) => {
    if (projectSlug !== currentProjectSlug) {
      router.push(`/builder/${projectSlug}`)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span className="truncate">{currentProject?.title || 'Select project...'}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>{isLoading ? 'Loading projects...' : 'No projects found.'}</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem key={project.id} value={project.slug} onSelect={() => handleProjectSelect(project.slug)}>
                  <Check
                    className={cn('mr-2 h-4 w-4', currentProjectSlug === project.slug ? 'opacity-100' : 'opacity-0')}
                  />
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span className="truncate">{project.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
