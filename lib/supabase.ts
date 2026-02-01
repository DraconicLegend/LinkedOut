import { createBrowserClient } from '@supabase/ssr'

// NOTE: These will be undefined in the browser now that we've removed NEXT_PUBLIC_
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Export the client only if keys are present to avoid direct initialization errors in the browser
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : {} as any
