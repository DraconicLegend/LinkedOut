import { createClient } from "@/lib/supabase-server"
import PostCard from "@/components/PostCard"
import CommentThread from "@/components/CommentThread"
import CommentInput from "@/components/CommentInput"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Logo from "@/components/Logo"

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    // Fetch Post (support both username and profiles)
    const { data: post } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .eq('id', params.id)
        .single()

    if (!post) return notFound()

    // Fetch Comments (support both username and profiles)
    const { data: comments } = await supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('post_id', params.id)
        .order('created_at', { ascending: true })

    // Build Tree
    const commentTree = (comments || []).reduce((acc: any[], comment: any) => {
        comment.replies = []
        if (!comment.parent_comment_id) {
            acc.push(comment)
        } else {
            const parent = (comments || []).find((c: any) => c.id === comment.parent_comment_id)
            if (parent) {
                parent.replies = parent.replies || []
                parent.replies.push(comment)
            } else {
                // Orphaned comment or parent missing
                acc.push(comment)
            }
        }
        return acc
    }, [])

    return (
        <div className="min-h-screen pb-20">
            <div className="container" style={{ maxWidth: '680px', paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            transition: 'color 0.2s ease'
                        }}
                        className="font-mono"
                    >
                        <ChevronLeft size={16} /> BACK_TO_FEED
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Logo size={42} />
                        {/* Removed text since logo includes "LinkedOut" */}
                    </div>
                </div>

                <PostCard post={post as any} />

                <div style={{ marginTop: '3rem' }}>
                    <h3
                        className="font-mono"
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        COMMENTS ({comments?.length || 0})
                    </h3>

                    {/* Comment Input Form */}
                    <CommentInput postId={params.id} />

                    {/* Existing Comments */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                        {commentTree.map((comment: any) => (
                            <CommentThread key={comment.id} comment={comment} />
                        ))}
                        {(!comments || comments.length === 0) && (
                            <p className="text-secondary font-mono" style={{ fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
