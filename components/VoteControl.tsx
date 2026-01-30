"use client"

import { useState } from 'react'
import { ArrowBigUp, ArrowBigDown, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

interface VoteControlProps {
    score: number
    itemId: string
    type: 'post' | 'comment'
    initialUserVote?: number // 1, -1, or 0
}

export default function VoteControl({ score: initialScore, itemId, type, initialUserVote = 0 }: VoteControlProps) {
    const [score, setScore] = useState(initialScore)
    const [userVote, setUserVote] = useState(initialUserVote)

    const handleVote = async (value: number) => {
        let newScore = score
        let newUserVote = userVote

        if (userVote === value) {
            newScore -= value
            newUserVote = 0
        } else {
            newScore += value - userVote
            newUserVote = value
        }

        setScore(newScore)
        setUserVote(newUserVote)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (newUserVote === 0) {
            await supabase.from('votes').delete().match({
                user_id: user.id,
                [type === 'post' ? 'post_id' : 'comment_id']: itemId
            })
        } else {
            await supabase.from('votes').upsert({
                user_id: user.id,
                post_id: type === 'post' ? itemId : null,
                comment_id: type === 'comment' ? itemId : null,
                value: newUserVote
            }, { onConflict: type === 'post' ? 'user_id, post_id' : 'user_id, comment_id' })
        }
    }

    const isPost = type === 'post'

    return (
        <div style={{
            display: 'flex',
            flexDirection: isPost ? 'column' : 'row',
            alignItems: 'center',
            padding: '0.75rem',
            background: isPost ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderRight: isPost ? '1px solid var(--border-color)' : 'none',
            gap: '0.25rem'
        }}>
            <button
                onClick={(e) => { e.stopPropagation(); handleVote(1); }}
                style={{ color: userVote === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.3)' }}
            >
                <ChevronUp size={24} />
            </button>

            <div style={{ position: 'relative', height: '1.5em', minWidth: '1.5em', textAlign: 'center', overflow: 'hidden' }}>
                <AnimatePresence mode='wait' initial={false}>
                    <motion.span
                        key={score}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ display: 'block', fontWeight: 700, fontSize: isPost ? '0.875rem' : '0.75rem', color: userVote !== 0 ? (userVote === 1 ? 'var(--primary)' : '#ef4444') : 'inherit' }}
                        className="font-mono"
                    >
                        {score}
                    </motion.span>
                </AnimatePresence>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
                style={{ color: userVote === -1 ? '#ef4444' : 'rgba(255,255,255,0.3)' }}
            >
                <ChevronDown size={24} />
            </button>
        </div>
    )
}
