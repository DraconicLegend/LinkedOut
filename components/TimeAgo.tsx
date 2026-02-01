'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface TimeAgoProps {
    date: Date | string | number
}

export default function TimeAgo({ date }: TimeAgoProps) {
    const [mounted, setMounted] = useState(false)
    const [timeAgo, setTimeAgo] = useState('')

    useEffect(() => {
        setMounted(true)
        const updateTime = () => {
            const d = new Date(date)
            if (!isNaN(d.getTime())) {
                setTimeAgo(formatDistanceToNow(d, { addSuffix: true }))
            } else {
                setTimeAgo('unknown')
            }
        }
        updateTime()
        // Optional: update every minute
        const interval = setInterval(updateTime, 60000)
        return () => clearInterval(interval)
    }, [date])

    if (!mounted) {
        // Initial render on server and client: consistent static output
        return <span>...</span>
    }

    return <span>{timeAgo}</span>
}
