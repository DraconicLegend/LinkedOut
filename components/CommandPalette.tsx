"use client"

import { useEffect, useState } from "react"
import { Command } from "cmdk"
import { Search, Plus, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    if (!open) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} onClick={() => setOpen(false)}>

            <div
                onClick={(e) => e.stopPropagation()}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '640px',
                    background: 'rgba(10, 10, 10, 0.9)',
                    boxShadow: '0 0 50px rgba(0, 229, 255, 0.1)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                }}
            >
                <Command label="Global Command Menu" style={{ background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem' }}>
                        <Search size={20} className="text-secondary" style={{ marginRight: '0.75rem' }} />
                        <Command.Input
                            placeholder="Type a command or search..."
                            style={{ flex: 1, fontSize: '1rem' }}
                            className="font-mono"
                        />
                    </div>

                    <Command.List style={{ padding: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        <Command.Empty style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Actions" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>ACTIONS</div>

                            <Item onSelect={() => runCommand(() => router.push('/submit'))}>
                                <Plus size={16} />
                                Create New Post
                            </Item>

                            <Item onSelect={() => runCommand(() => router.push('/'))}>
                                <Search size={16} />
                                Go to Feed
                            </Item>
                        </Command.Group>

                        <Command.Group heading="Account">
                            <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>ACCOUNT</div>
                            <Item onSelect={() => runCommand(() => router.push('/setup-username'))}>
                                <User size={16} />
                                Profile Settings
                            </Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    )
}

function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="command-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--foreground)',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
            }}
        >
            {children}
        </Command.Item>
    )
}
