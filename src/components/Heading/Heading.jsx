import Image from 'next/image'
import styles from './style.module.css'

export default function Heading() {
    return (
        <header className={styles.headerSection}>
            <Image 
                src="/images/pciu-logo.png" 
                alt="PCIU Logo - Port City International University" 
                width={35} 
                height={46} 
                className="ignore-dark"
                priority // Load PCIU logo immediately
            />
            <div>
                <h1 className={styles.headerTitle}>PCIU Online Result</h1>
                <p className={styles.headerSubtitle}>
                    Port City International University, Chattogram
                </p>
            </div>
        </header>
    )
}