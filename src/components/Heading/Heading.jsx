import Image from 'next/image'
import styles from './style.module.css'

export default function Heading() {
    return (
        <div className={styles.headerSection}>
            <Image src="/images/pciu-logo.png" alt="pciu logo" width={35} height={46} />
            <div>
                <h1 className={styles.headerTitle}>Online Result</h1>
                <p className={styles.headerSubtitle}>
                    Port City International University, Chattogram
                </p>
            </div>
        </div>
    )
}