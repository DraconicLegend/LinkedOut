"use client"

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import VoteControl from './VoteControl'
import { Post } from '@/types/database'
import { parsePostContent, formatTextContent } from '@/lib/formatPost'

export default function PostCard({ post }: { post: Post }) {
    const createdDate = new Date(post.created_at)
    const timeAgo = isNaN(createdDate.getTime()) ? 'Just now' : formatDistanceToNow(createdDate, { addSuffix: true })

    const { title, content } = parsePostContent(post.content)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(255,255,255,0.03)" }}
            className="glass glass-hover"
            style={{ overflow: 'hidden', display: 'flex', marginBottom: '1rem' }}
        >
            {/* Vote Sidebar */}
            <VoteControl score={post.score} itemId={post.id} type="post" />

            {/* Content Area */}
            <Link href={`/post/${post.id}`} style={{ flex: 1, padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.75rem' }} className="text-secondary font-mono">
                    <span style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {post.profiles?.username || 'anonymous'}.sys
                    </span>
                    <span>//</span>
                    <span>{timeAgo}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                    {formatTextContent(title)}
                </h3>

                {/* Content Preview */}
                {content && (
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {formatTextContent(content)}
                    </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                        <MessageSquare size={14} />
                        <span style={{ fontSize: '0.75rem' }}>COMM_LOGS</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
