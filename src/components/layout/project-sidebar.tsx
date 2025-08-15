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

  // Get project blocks
  const { data: project } = api.project.getBySlug.useQuery({ slug: projectSlug })
  const { data: blocks = [] } = api.block.getByProject.useQuery(
    { projectId: project?.id || '' },
    { enabled: !!project?.id },
  )

  const navigationItems = [
    {
      title: 'Back to Projects',
      url: '/(management)/projects',
      icon: ArrowLeft,
    },
    {
      title: 'Project Overview',
      url: `/builder/${projectSlug}`,
      icon: FolderOpen,
    },
    {
      title: 'Project Settings',
      url: `/builder/${projectSlug}/settings`,
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Blocks */}
        <SidebarGroup>
          <SidebarGroupLabel>Blocks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/builder/${projectSlug}/new-block`}>
                    <Plus />
                    <span>Create Block</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {blocks.map((block) => (
                <SidebarMenuItem key={block.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/builder/${projectSlug}/${block.slug}`}>
                    <Link href={`/builder/${projectSlug}/${block.slug}`}>
                      <Blocks />
                      <span>{block.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
