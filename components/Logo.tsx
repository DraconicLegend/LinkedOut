"use client"

import React from 'react'

export default function Logo({ size = 40 }: { size?: number }) {
    // Scaling factor based on base size of 40px
    const scale = size / 40

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${2 * scale}px`,
            fontFamily: 'var(--font-sans)', // Using Inter or system font for that LinkedIn look
            fontWeight: 700,
            lineHeight: 1,
            userSelect: 'none'
        }}>
            {/* "Linked" text */}
            <span style={{
                color: '#fff',
                fontSize: `${22 * scale}px`,
                letterSpacing: '-0.02em',
                position: 'relative',
                top: '-1px' // Visually align with the box
            }}>
                Linked
            </span>

            {/* "Out" box */}
            <div style={{
                background: '#0077b5', // LinkedIn Blue (or tweaked to var(--primary) if preferred)
                color: '#fff',
                borderRadius: `${4 * scale}px`,
                padding: `${0 * scale}px ${4 * scale}px ${3 * scale}px ${4 * scale}px`, // Adjust padding for visual optical alignment
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${28 * scale}px`,
                minWidth: `${28 * scale}px`
            }}>
                <span style={{
                    fontSize: `${22 * scale}px`,
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                }}>
                    out
                </span>
            </div>
        </div>
    )
}
