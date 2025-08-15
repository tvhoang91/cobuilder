'use client'

import { usePathname } from 'next/navigation'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

export default function NavLink({
  path,
  exact,
  children,
}: {
  path: string
  exact?: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = exact ? pathname === path : pathname.startsWith(path)

  return (
    <NavigationMenuLink asChild active={active}>
      {children}
    </NavigationMenuLink>
  )
}
