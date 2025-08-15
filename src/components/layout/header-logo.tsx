'use server'

import Link from 'next/link'

export default async function HeaderLogo() {
  return (
    <>
      {/* Logo/Title */}
      <div className="mr-4 hidden md:flex">
        <Link href="/" className="bg-accent text-accent-foreground mr-6 flex items-center space-x-2 rounded-sm p-1">
          <span className="hidden text-xl font-bold sm:inline-block">CO</span>
        </Link>
      </div>

      {/* Mobile Logo */}
      <div className="mr-4 flex md:hidden">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-lg font-bold">Cobuilder</span>
        </Link>
      </div>
    </>
  )
}
