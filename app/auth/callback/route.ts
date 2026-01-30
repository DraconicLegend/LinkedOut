import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.user) {
            const user = data.user
            // Check if user has a username
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            if (!profile?.username) {
                return NextResponse.redirect(`${origin}/setup-username`)
            }

            return NextResponse.redirect(`${origin}${next}`)
        }

        if (error) {
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
        }
    }

    // return the user to login page with error
    return NextResponse.redirect(`${origin}/login?error=Invalid or expired login link`)
}
