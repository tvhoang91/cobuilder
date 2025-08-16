import Link from 'next/link'
import { auth, signIn } from '@/server/auth'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import NavMenu from '@/components/layout/nav-menu'
import UserMenu from '@/components/layout/user-menu'
import HeaderLogo from '@/components/layout/header-logo'
import ProjectCombobox from '@/components/layout/project-combobox'

async function handleSignIn() {
  'use server'
  await signIn()
}

export default async function Home() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <HeaderLogo />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <NavMenu />
          <UserMenu />
        </div>
      </Header>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Cobuilder</h1>
          <p className="text-muted-foreground mt-4 text-lg">Collaborative design and project management platform</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {!user ? (
            <form action={handleSignIn}>
              <Button type="submit" size="lg">
                Sign In
              </Button>
            </form>
          ) : user.role === 'GUEST' ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please contact the administrator to get access to projects and design features.
              </p>
            </div>
          ) : user.role === 'DESIGNER' || user.role === 'ADMIN' ? (
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/projects">Go to Projects List</Link>
              </Button>
              or
              <ProjectCombobox />
            </div>
          ) : null}
        </div>

        {user && (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Welcome back, {user.name}!</p>
          </div>
        )}
      </div>
    </div>
  )
}
