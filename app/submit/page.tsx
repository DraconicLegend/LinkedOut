"use client"

import { useState, type FormEvent, useEffect } from 'react'
import { submitPost } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Send, Sparkles } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Submit() {
    const [content, setContent] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Load username from localStorage on mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('username')
        if (savedUsername) {
            setUsername(savedUsername)
        }
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !username.trim()) return

        setLoading(true)

        // Save username for future posts
        localStorage.setItem('username', username)

        try {
            await submitPost('', content.trim(), username.trim()) // Using empty string for title as it's not in the form
            router.push('/')
            router.refresh()
        } catch (error: any) {
            alert('Error creating post: ' + error.message)
        }
        setLoading(false)
    }

    return (
        <div className="container" style={{ maxWidth: '600px', paddingTop: '4rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    <ChevronLeft size={16} /> BACK_TO_FEED
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Logo size={42} />
                    {/* Removed text since logo includes "LinkedOut" */}
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles size={24} color="var(--primary)" /> NEW_TRANSMISSION
                </h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                            className="font-mono"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-color)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                            placeholder="your_username"
                            minLength={3}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                            Message Content
                        </label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Broadcast your thought..."
                            rows={6}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-color)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                resize: 'none',
                                lineHeight: 1.6
                            }}
                            className="font-mono focus:border-primary"
                        />
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
                        {loading ? 'TRANSMITTING...' : (
                            <>
                                INITIATE BROADCAST <Send size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
