"use client"

import { useState, type FormEvent, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { UserPlus, Sparkles } from 'lucide-react'

function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()

    // ANONYMOUS LOGIN - No email required!
    const handleAnonymousLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { data, error } = await supabase.auth.signInAnonymously()

        if (error) {
            setMessage(error.message)
            setLoading(false)
        } else {
            // Successfully logged in anonymously
            router.push('/setup-username')
            router.refresh()
        }
    }

    /* COMMENTED OUT: Magic Link Email Authentication
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email for the login link!')
        }
        setLoading(false)
    }
    */

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                        <Sparkles size={24} color="var(--primary)" /> SIDECHAT_ACCESS
                    </h2>
                    <p className="text-secondary font-mono" style={{ fontSize: '0.875rem' }}>
                        Anonymous access - no email required
                    </p>
                </div>

                {message && (
                    <div className="p-4 rounded-lg text-sm font-mono mb-6 bg-red-900/20 text-red-400 border border-red-900/50" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleAnonymousLogin}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="font-mono"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: loading ? 'var(--text-secondary)' : 'var(--primary)',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '0.75rem',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: loading ? 'none' : '0 4px 20px var(--primary-glow)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? 'CONNECTING...' : (
                            <>
                                ENTER ANONYMOUSLY <UserPlus size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* COMMENTED OUT: Email input field
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-secondary" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-color)',
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '0.75rem',
                                    color: 'var(--foreground)'
                                }}
                                className="font-mono focus:border-primary transition-colors outline-none"
                                placeholder="name@domain.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="font-mono"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: loading ? 'var(--text-secondary)' : 'var(--primary)',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '0.75rem',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: loading ? 'none' : '0 4px 20px var(--primary-glow)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : (
                            <>
                                REQUEST ACCESS <Send size={16} />
                            </>
                        )}
                    </button>
                </form>
                */}
            </div>
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
