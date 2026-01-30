"use client"

import { Lightbulb, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SuggestPromptWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 100,
                maxWidth: '280px'
            }}
        >
            <a
                href="https://forms.gle/QMED9KGGHB3YeFyC6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.125rem',
                    textDecoration: 'none',
                    color: 'var(--foreground)',
                    transition: 'all 0.2s ease'
                }}
                className="glass glass-hover"
            >
                <Lightbulb
                    size={18}
                    style={{
                        color: 'var(--primary)',
                        flexShrink: 0
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div
                        className="font-mono"
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.125rem'
                        }}
                    >
                        Got Ideas?
                    </div>
                    <div style={{
                        fontSize: '0.8125rem',
                        lineHeight: 1.3,
                        color: 'var(--foreground)'
                    }}>
                        Suggest a prompt
                    </div>
                </div>
                <ExternalLink
                    size={14}
                    style={{
                        color: 'var(--text-secondary)',
                        flexShrink: 0
                    }}
                />
            </a>
        </motion.div>
    )
}
