'use server'

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { auth } from '@/server/auth'
import NavLink from './nav-link'
import Link from 'next/link'

export default async function NavMenu() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink path="/" exact>
            <Link href="/">Home</Link>
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink path="/projects">
            <Link href="/projects">Projects</Link>
          </NavLink>
        </NavigationMenuItem>
        {isAdmin && (
          <NavigationMenuItem>
            <NavLink path="/users">
              <Link href="/users">Users</Link>
            </NavLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
