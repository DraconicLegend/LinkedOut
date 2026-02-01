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

export async function signInAnonymously() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    return data
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function updateProfile(username: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not logged in')

    const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id)

    if (error) throw error
}

export async function updateVote(itemId: string, type: 'post' | 'comment', value: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in to vote')

    if (value === 0) {
        await supabase.from('votes').delete().match({
            user_id: user.id,
            [type === 'post' ? 'post_id' : 'comment_id']: itemId
        })
    } else {
        await supabase.from('votes').upsert({
            user_id: user.id,
            post_id: type === 'post' ? itemId : null,
            comment_id: type === 'comment' ? itemId : null,
            value
        }, { onConflict: type === 'post' ? 'user_id, post_id' : 'user_id, comment_id' })
    }
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
