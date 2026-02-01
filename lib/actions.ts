'use server'

import { createClient } from '@/lib/supabase-server'
import { Post } from '@/types/database'

export async function getPosts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (username),
            comments (count)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    return data as unknown as Post[]
}

export async function votePost(postId: string, voteType: 'up' | 'down') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Must be logged in to vote')

    // Logic for voting would go here, potentially using a stored procedure or transaction
    // For now, this is a placeholder to show the pattern
    console.log(`User ${user.id} voted ${voteType} on post ${postId}`)
}

export async function createComment(postId: string, username: string, content: string, parentCommentId?: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            parent_comment_id: parentCommentId || null,
            username: username.trim(),
            content: content.trim()
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function submitPost(title: string, content: string, username: string) {
    const supabase = await createClient()

    // First ensure profile exists or get it
    let { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (!profile) {
        throw new Error('Failed to create or find user profile')
    }

    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: title || content.slice(0, 50),
            content,
            profile_id: profile.id
        })
        .select()
        .single()

    if (error) throw error
    return data
}
