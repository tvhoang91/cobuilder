'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, FolderOpen } from 'lucide-react'
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
import { UserRole } from '@/schema'

export default function ManagementSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="projects">
                <SidebarMenuButton asChild isActive={pathname === '/projects'}>
                  <Link href="/projects">
                    <FolderOpen />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="users" hidden={userRole !== 'ADMIN'}>
                <SidebarMenuButton asChild isActive={pathname === '/users'}>
                  <Link href="/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
