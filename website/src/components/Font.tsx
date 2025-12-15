/**
 * Typography via CSS Modules
 *
 * Why this approach:
 * - SSR-safe: no runtime style generation on the client, so markup matches server output.
 * - Real CSS: responsive behavior (media queries) lives in stylesheets, not JS.
 * - Isolation: CSS module scope + `font-` prefix avoids leaking into/global collisions.
 * - Extensible: caller can pass `className` to augment or override without changing the API.
 */

import styles from './Font.module.css'
import type React from 'react'

type FontType = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'ps' | 'mono' | 'monoSmall'

const Font = ({ children, type, className }: { children: React.ReactNode, type: FontType, className?: string }) => {
  const baseClassName = styles[`font-${type}` as keyof typeof styles] as string || ''
  const mergedClassName = `${baseClassName}${className ? `${baseClassName ? ' ' : ''}${className}` : ''}`

  const tagNameMap: Record<FontType, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    p: 'p',
    ps: 'p',
    mono: 'p',
    monoSmall: 'p',
  }

  const Tag: React.ElementType = tagNameMap[type] || 'div'

  return (
    <Tag className={mergedClassName}>
      {children}
    </Tag>
  )
}

export default Font