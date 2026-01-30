"use client"

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CreatePostButton() {
    return (
        <div style={{ position: 'fixed', bottom: '2.5rem', right: '2.5rem', zIndex: 9999 }}>
            <Link href="/submit">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '16px', // Matches card radius logic
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px var(--primary-glow)',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <Plus size={24} strokeWidth={2.5} />
                    <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Create Post</span>
                </motion.div>
            </Link>
        </div>
    )
}
