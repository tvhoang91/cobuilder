'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, FolderOpen, Blocks, Settings, Plus } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { api } from '@/trpc/react'

interface ProjectSidebarProps {
  projectSlug: string
}

export default function ProjectSidebar({ projectSlug }: ProjectSidebarProps) {
  const pathname = usePathname()

  const { data: project } = api.project.getBySlug.useQuery({ slug: projectSlug })
  const { data: blocks } = api.block.getByProject.useQuery({ projectId: project?.id || '' }, { enabled: !!project?.id })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/projects">
                    <ArrowLeft />
                    <span>Back to Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Blocks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {blocks?.map((block) => (
                <SidebarMenuItem key={block.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/builder/${projectSlug}/${block.slug}`}>
                    <Link href={`/builder/${projectSlug}/${block.slug}`}>
                      <Blocks />
                      <span>{block.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Blocks />
                  <span>More menu here</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
