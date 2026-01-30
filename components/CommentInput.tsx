"use client"

import { useState, type FormEvent, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MessageSquare, Send } from 'lucide-react'

interface CommentInputProps {
    postId: string
    parentCommentId?: string
    onCommentAdded?: () => void
}

export default function CommentInput({ postId, parentCommentId, onCommentAdded }: CommentInputProps) {
    const [username, setUsername] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Load username from localStorage
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

        // Save username for future comments
        localStorage.setItem('username', username)

        // Create comment - no auth needed!
        const { error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                parent_comment_id: parentCommentId || null,
                username: username.trim(),
                content: content.trim()
            })

        if (!error) {
            setContent('') // Clear the comment input
            if (onCommentAdded) {
                onCommentAdded()
            } else {
                router.refresh() // Refresh to show new comment
            }
        } else {
            alert('Error posting comment: ' + error.message)
        }
        setLoading(false)
    }

    return (
        <div className="glass" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3
                className="font-mono"
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <MessageSquare size={14} /> {parentCommentId ? 'REPLY' : 'ADD_COMMENT'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
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
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                        placeholder="username"
                        minLength={3}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Your comment..."
                        rows={3}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            resize: 'none',
                            lineHeight: 1.6,
                            fontSize: '0.875rem',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                        className="font-mono"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="font-mono"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: loading ? 'var(--text-secondary)' : 'var(--primary)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '0.5rem',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: loading ? 'none' : '0 2px 10px var(--primary-glow)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? 'POSTING...' : (
                        <>
                            POST COMMENT <Send size={14} />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
