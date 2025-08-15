import { auth, signIn, signOut } from '@/server/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'

async function handleSignOut() {
  'use server'
  await signOut()
}

async function handleSignIn() {
  'use server'
  await signIn()
}

export default async function UserMenu() {
  const session = await auth()
  const isAuthenticated = !!session?.user
  const user = session?.user

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.name && <p className="font-medium">{user.name}</p>}
                {user?.email && <p className="text-muted-foreground w-[200px] truncate text-sm">{user.email}</p>}
                {user?.role && <p className="text-muted-foreground text-xs">Role: {user.role}</p>}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={handleSignOut}>
                <button type="submit" className="flex w-full items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <form action={handleSignIn}>
          <Button type="submit">Sign In</Button>
        </form>
      )}
    </>
  )
}
