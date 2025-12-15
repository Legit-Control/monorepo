"use client"

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

export default function PostHog({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
    
    if (token) {
      posthog.init(token, {
        api_host: host || 'https://eu.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true
      })
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}