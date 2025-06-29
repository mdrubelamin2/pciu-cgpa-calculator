'use client'

import { useTheme } from 'next-themes'
import styles from './style.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ToggleThemeButton() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const size = 25
  const lightModeIcon = (
    <Image
      src='/images/sun.svg'
      alt='Light mode'
      width={size}
      height={size}
      className='ignore-dark'
    />
  )
  const darkModeIcon = (
    <Image
      src='/images/moon.svg'
      alt='Dark mode'
      width={size}
      height={size}
      className='ignore-dark'
    />
  )

  if (!mounted) {
    return (
      <div className={styles.btn} style={{ opacity: 0 }}>
        <div style={{ width: size, height: size }} />
      </div>
    )
  }

  const getIcon = () => {
    return theme === 'light' ? darkModeIcon : lightModeIcon
  }

  const getAriaLabel = () => {
    return `${theme === 'light' ? 'Light' : 'Dark'} mode. Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode.`
  }

  return (
    <button
      className={styles.btn}
      onClick={toggleTheme}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {getIcon()}
    </button>
  )
}
