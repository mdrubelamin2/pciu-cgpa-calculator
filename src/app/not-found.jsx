import Link from "next/link";
import styles from "./page.module.css";

/**
 * Metadata for the global 404 page
 * @returns {Object} Metadata object with title, description, etc.
 */
export const metadata = {
  title: "Page Not Found | PCIU CGPA Calculator",
  description: "The page you're looking for doesn't exist. Return to the PCIU CGPA Calculator homepage.",
  alternates: {
    canonical: "/not-found",
    other: {
      "alternate-domain": "/not-found",
    },
  },
  robots: {
    index: false,
    follow: true,
  },
};

/**
 * Global NotFound component for the entire application
 * Displays when a route is not found
 */
export default function NotFound() {

  return (
    <div className={styles.mainContainer}>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.notFoundTitle}>Page Not Found</h1>
          <p className={styles.notFoundMessage}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className={styles.notFoundLink}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
