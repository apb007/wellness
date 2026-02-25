import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, classLevel } = await req.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email,
        name,
        role,
        class_level: classLevel,
        organization_id: process.env.NEXT_PUBLIC_ORG_ID || 'd8c6a2f5-6e3b-4a9e-9b7c-3f5d8e9a2b1c',
        auth_id: authData.user?.id
      })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Signup successful', user: authData.user },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}
