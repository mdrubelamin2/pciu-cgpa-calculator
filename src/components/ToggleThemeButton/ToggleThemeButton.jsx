'use client'

import { useTheme } from '@designcise/next-theme-toggle'
import styles from './style.module.css'
import Image from 'next/image'

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme()
  const { color: currentColor } = theme
  const isLightMode = currentColor === 'light'
  const isDarkMode = currentColor === 'dark'

  const size = 25
  const lightModeIcon = <Image src="/images/sun.svg" alt="" width={size} height={size} className="ignore-dark" />
  const darkModeIcon = <Image src="/images/moon.svg" alt="" width={size} height={size} className="ignore-dark" />

  return (
    <button className={styles.btn} onClick={toggleTheme}>
      {isLightMode && darkModeIcon}
      {isDarkMode && lightModeIcon}
    </button>
  )
}