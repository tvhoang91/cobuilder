import Header from '@/components/layout/header'
import NavMenu from '@/components/layout/nav-menu'
import UserMenu from '@/components/layout/user-menu'

export default function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <NavMenu />
          <UserMenu />
        </div>
      </Header>
      <div>
        {/* <ManagementSidebar /> */}
        {children}
      </div>
    </div>
  )
}
