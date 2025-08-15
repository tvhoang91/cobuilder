import Header from '@/components/layout/header'
import NavMenu from '@/components/layout/nav-menu'
import UserMenu from '@/components/layout/user-menu'
import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ projectSlug: string }>
}>) {
  const session = await auth()
  const { projectSlug } = await params

  if (!session?.user || !['ADMIN', 'DESIGNER'].includes(session.user.role)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        {/* <ProjectCombobox projectSlug={projectSlug} /> */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <NavMenu />
          <UserMenu />
        </div>
      </Header>
      <div>
        {/* <ProjectSidebar /> */}
        {children}
      </div>
    </div>
  )
}
