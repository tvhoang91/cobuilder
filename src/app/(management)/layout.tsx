import Header from '@/components/layout/header'
import NavMenu from '@/components/layout/nav-menu'
import UserMenu from '@/components/layout/user-menu'
import ManagementSidebar from '@/components/layout/management-sidebar'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

export default async function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <ManagementSidebar userRole={session.user.role} />
      <SidebarInset>
        <Header>
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none" />
            <NavMenu />
            <UserMenu />
          </div>
        </Header>

        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
