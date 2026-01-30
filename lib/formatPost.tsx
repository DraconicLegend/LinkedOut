import React from 'react'

export interface ParsedPost {
    title: string
    content: string
}

/**
 * Parses post content to extract title (first line) and remaining content
 */
export function parsePostContent(rawContent: string): ParsedPost {
    const lines = rawContent.split('\n')
    const title = lines[0] || ''
    const content = lines.slice(1).join('\n').trim()

    return { title, content }
}

/**
 * Formats text content with bold support (**text** -> <strong>text</strong>)
 * and preserves newlines
 */
export function formatTextContent(text: string): React.ReactNode {
    if (!text) return null

    // Split by newlines first to preserve them
    const lines = text.split('\n')

    return lines.map((line, lineIndex) => {
        // Parse bold text within each line
        const parts: React.ReactNode[] = []
        let currentIndex = 0

        // Regex to match **text**
        const boldRegex = /\*\*(.+?)\*\*/g
        let match

        while ((match = boldRegex.exec(line)) !== null) {
            // Add text before the bold part
            if (match.index > currentIndex) {
                parts.push(line.substring(currentIndex, match.index))
            }

            // Add bold text
            parts.push(
                <strong key={`bold-${lineIndex}-${match.index}`}>
                    {match[1]}
                </strong>
            )

            currentIndex = match.index + match[0].length
        }

        // Add remaining text after last bold part
        if (currentIndex < line.length) {
            parts.push(line.substring(currentIndex))
        }

        // Return line with newline (except for last line)
        return (
            <React.Fragment key={`line-${lineIndex}`}>
                {parts.length > 0 ? parts : line}
                {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
        )
    })
}
