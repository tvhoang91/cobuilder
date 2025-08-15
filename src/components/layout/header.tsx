'use server'

export default async function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-14 max-w-screen-2xl items-center px-6">{children}</div>
    </header>
  )
}
