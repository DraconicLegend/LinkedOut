"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types/database'
import PostCard from './PostCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        const { data } = await supabase
            .from('posts')
            .select(`
        *,
        profiles (username),
        comments (count)
      `)
            .order('created_at', { ascending: false })

        if (data) setPosts(data as unknown as Post[])
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()

        const channel = supabase
            .channel('realtime_posts')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                (payload: any) => {
                    // Fetching full post to get relation data like profile username
                    // In production, you might join data manually or optimistically update
                    fetchPosts()
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'posts' },
                (payload: any) => {
                    setPosts(current => current.map(p => p.id === payload.new.id ? { ...p, ...payload.new } as Post : p))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="glass skeleton" style={{ height: '160px', borderRadius: '12px' }} />
                ))}
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <AnimatePresence initial={false}>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </AnimatePresence>
        </div>
    )
}
