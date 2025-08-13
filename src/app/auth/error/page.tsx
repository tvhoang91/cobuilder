'use client'

import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mb-6 text-gray-600">{errorMessages[error] || errorMessages.Default}</p>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
