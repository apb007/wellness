import { createClient } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface AuthUser {
  id: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  classLevel?: string
  organizationId: string
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'teacher' | 'admin',
  classLevel?: string
) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user returned from signup')

    // Create user profile in public table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        class_level: classLevel,
        organization_id: process.env.NEXT_PUBLIC_ORG_ID || 'd8c6a2f5-6e3b-4a9e-9b7c-3f5d8e9a2b1c', // Global org
        auth_id: authData.user.id
      })

    if (profileError) throw profileError

    return { success: true, user: authData.user }
  } catch (error) {
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    if (!data.user) throw new Error('No user returned from signin')

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('email', email)

    return { success: true, user: data.user, session: data.session }
  } catch (error) {
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    throw error
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (error) throw error

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      classLevel: profile.class_level,
      organizationId: profile.organization_id
    }
  } catch (error) {
    return null
  }
}
