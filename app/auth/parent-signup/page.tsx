'use client'

import { SignupForm } from '@/components/signup-form'
import Link from 'next/link'

export default function ParentSignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up as a parent to monitor your child's wellness progress
          </p>
        </div>

        <div className="mt-8">
          <SignupForm defaultRole="parent" />
        </div>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
