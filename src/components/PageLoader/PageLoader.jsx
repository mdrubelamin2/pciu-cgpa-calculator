import Image from 'next/image'
import styles from './style.module.css'

export default function PageLoader() {
  return (
    <div
      className={styles.loadingContainer}
      role='status'
      aria-label='Loading page content'
    >
      <Image
        src='/images/pciu-logo.png'
        alt='PCIU Logo'
        width={100}
        height={120}
        className='ignore-dark'
        priority
      />
      <span data-text='Loading…' className={styles.loading} aria-live='polite'>
        Loading…
      </span>
    </div>
  )
}
