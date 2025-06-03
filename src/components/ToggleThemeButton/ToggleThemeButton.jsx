'use client'

import { useTheme } from '@designcise/next-theme-toggle'
import styles from './style.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ToggleThemeButton() {
  const [mounted, setMounted] = useState(false)
  const themeContext = useTheme()
  
  // Use safe access to theme properties
  const theme = mounted ? themeContext?.theme : null
  const toggleTheme = mounted ? themeContext?.toggleTheme : () => {}
  
  // Default to light if theme is not available
  const currentColor = theme?.color || 'light'
  const isLightMode = currentColor === 'light'
  const isDarkMode = currentColor === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  const size = 25
  const lightModeIcon = <Image src="/images/sun.svg" alt="" width={size} height={size} className="ignore-dark" />
  const darkModeIcon = <Image src="/images/moon.svg" alt="" width={size} height={size} className="ignore-dark" />

  if (!mounted) {
    // Return a placeholder button during SSR and initial client render
    return (
      <button className={styles.btn} aria-label="Toggle theme">
        <div style={{ width: size, height: size }} />
      </button>
    )
  }

  return (
    <button className={styles.btn} onClick={toggleTheme}>
      {isLightMode && darkModeIcon}
      {isDarkMode && lightModeIcon}
    </button>
  )
}