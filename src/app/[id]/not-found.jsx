import Link from 'next/link'
import styles from '../page.module.css'
import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains'

/**
 * Generate metadata for the student ID not-found page
 * @returns {Object} Metadata object with title, description, etc.
 */
export const generateMetadata = () => {
  return {
    title: 'Student ID Not Found | PCIU CGPA Calculator',
    description:
      "The student ID you're looking for doesn't exist in the PCIU database. Please check the ID and try again.",
    alternates: {
      canonical: '/not-found',
      other: {
        'alternate-domain': '/not-found',
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

/**
 * NotFound component for student ID routes
 * Displays when a student ID is not found in the database
 */
export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.notFoundTitle}>Student ID Not Found</h1>
        <p className={styles.notFoundMessage}>
          The student ID you&apos;re looking for doesn&apos;t exist in our
          database. Please check the ID and try again.
        </p>
        <Link href='/' className={styles.notFoundLink}>
          Go back to home
        </Link>
      </div>
    </div>
  )
}
