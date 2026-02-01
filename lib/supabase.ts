import { createBrowserClient } from '@supabase/ssr'

// NOTE: These will be undefined in the browser now that we've removed NEXT_PUBLIC_
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // This is expected in the browser. Client components should be refactored to use Server Actions.
  console.warn('Supabase environment variables are missing. This is expected in the browser after security hardening.')
}

export const supabase = createBrowserClient(supabaseUrl || '', supabaseAnonKey || '')
