import styles from './style.module.css'

export default function Heading() {
    return (
        <div className={styles.headerSection}>
            <h1 className={styles.headerTitle}>CGPA Calculator</h1>
            <p className={styles.headerSubtitle}>
                Port City International University, Chattogram
            </p>
        </div>
    )
}