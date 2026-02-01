"use client"

import { Comment } from "@/types/database"
import VoteControl from "./VoteControl"
import TimeAgo from "./TimeAgo"
import { useState } from "react"
import { MessageSquare, Minus, Plus } from "lucide-react"

// Update type definition to handle both username field and profiles relation
interface CommentNodeProps {
    comment: Comment & {
        replies?: Comment[],
        profiles?: { username: string | null },
        username?: string, // Direct username field (no auth)
        score?: number
    }
    level?: number
}

export default function CommentThread({ comment, level = 0 }: CommentNodeProps) {
    const [collapsed, setCollapsed] = useState(false)
    const isNested = level > 0

    // Get username from either the direct field or the profiles relation
    const displayUsername = comment.username || comment.profiles?.username || 'anonymous'

    return (
        <div
            className="glass"
            style={{
                marginLeft: isNested ? '2rem' : '0',
                padding: '1rem',
                borderLeft: isNested ? '2px solid var(--primary)' : 'none'
            }}
        >
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ paddingTop: '0.25rem' }}>
                    <div
                        style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            background: 'var(--primary-glow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            border: '1px solid var(--primary)'
                        }}
                        className="font-mono"
                    >
                        {displayUsername[0]?.toUpperCase() || '?'}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span
                            className="font-mono"
                            style={{
                                fontWeight: 700,
                                color: 'var(--foreground)',
                                fontSize: '0.875rem'
                            }}
                        >
                            {displayUsername}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>•</span>
                        <span
                            className="font-mono text-secondary"
                            style={{ fontSize: '0.75rem' }}
                        >
                            <TimeAgo date={comment.created_at} />
                        </span>

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                marginLeft: 'auto',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                transition: 'all 0.2s ease'
                            }}
                            className="font-mono"
                        >
                            {collapsed ? <Plus size={14} /> : <Minus size={14} />}
                        </button>
                    </div>

                    {!collapsed && (
                        <>
                            <div
                                style={{
                                    color: 'var(--foreground)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    marginBottom: '0.75rem'
                                }}
                            >
                                {comment.content}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <VoteControl score={comment.score || 0} itemId={comment.id} type="comment" />

                                {/* Reply button removed for now - can add back with CommentInput if needed */}
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    {comment.replies.map(reply => (
                                        <CommentThread key={reply.id} comment={reply} level={level + 1} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
