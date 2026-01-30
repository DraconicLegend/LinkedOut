export type Profile = {
    id: string
    username: string | null
    created_at: string
}

export type Post = {
    id: string
    author_id: string
    content: string
    score: number
    created_at: string
    // Joins
    profiles?: Profile
    user_has_voted?: number // for UI state
}

export type Comment = {
    id: string
    post_id: string
    author_id: string
    content: string
    parent_comment_id: string | null
    created_at: string
    // Joins
    profiles?: Profile
}

export type Vote = {
    id: string
    user_id: string
    post_id: string | null
    comment_id: string | null
    value: number
}
