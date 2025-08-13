'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SignInButton() {
  return (
    <form
      action={async () => {
        await signIn()
      }}
    >
      <Button type="submit">Sign In</Button>
    </form>
  )
}
