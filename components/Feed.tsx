"use client"

import { useEffect, useState } from 'react'
import { getPosts } from '@/lib/actions'
import { Post } from '@/types/database'
import PostCard from './PostCard'
import { AnimatePresence, motion } from 'framer-motion'
// Note: Realtime subscriptions will still need the client, 
// but it won't have env vars in the browser.
// We'll focus on the initial fetch for now.

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        const data = await getPosts()
        if (data) setPosts(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
        // Realtime is temporarily disabled as it requires a browser client with credentials
        // which we are securing. 
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
