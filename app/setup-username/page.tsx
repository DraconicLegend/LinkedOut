"use client"

import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Terminal, ChevronRight } from 'lucide-react'

export default function SetupUsername() {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id)

            if (!error) {
                // Check if there's a pending post from before username setup
                const pendingPost = localStorage.getItem('pendingPost')

                if (pendingPost) {
                    // Create the pending post
                    await supabase
                        .from('posts')
                        .insert({
                            content: pendingPost,
                            author_id: user.id
                        })

                    // Clear the pending post
                    localStorage.removeItem('pendingPost')
                }

                router.push('/')
                router.refresh()
            } else {
                alert(error.message)
            }
        }
        setLoading(false)
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} className="container">
            <div className="glass" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderTop: '2px solid var(--primary)' }}>

                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Terminal size={32} />
                    </div>
                    <h2 className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        IDENTITY_VERIFICATION
                    </h2>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Cannot be changed later. Choose wisely.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            className="font-mono"
                            style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span
                                className="font-mono"
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}
                            >
                                $
                            </span>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className="font-mono"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-color)',
                                    padding: '1rem',
                                    paddingLeft: '2.5rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease'
                                }}
                                placeholder="username"
                                minLength={3}
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
                            background: 'var(--primary)',
                            color: '#000',
                            fontWeight: 700,
                            borderRadius: '0.5rem',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? 'INITIALIZING...' : (
                            <>
                                CONFIRM PROTOCOL <ChevronRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
