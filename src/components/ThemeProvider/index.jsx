'use client'

import { ThemeProvider as NextThemesProvider } from '@designcise/next-theme-toggle'
import { themes } from '@designcise/next-theme-toggle/server'
import { useState, useEffect } from 'react'

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  // Only execute this effect on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash by rendering a simplified version during SSR
  if (!mounted) {
    // Return a placeholder with the same structure but no theme applied
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <NextThemesProvider
      storageKey='pciu-cgpa-calculator'
      defaultTheme={themes.light.type}
    >
      {children}
    </NextThemesProvider>
  )
}
