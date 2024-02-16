import Image from "next/image";
import styles from "./style.module.css";

export default function PageLoader() {
  return (
    <div className={styles.loadingContainer}>
      <Image src="/images/pciu-logo.png" alt="pciu logo" width={100} height={120} className="ignore-dark" />
      <span data-text="Loading…" className={styles.loading}>Loading…</span>
    </div>
  )
}
