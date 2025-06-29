'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      enableSystem={true}
      themes={['light', 'dark']}
      disableTransitionOnChange
      storageKey='pciu-cgpa-calculator'
    >
      {children}
    </NextThemesProvider>
  )
}
