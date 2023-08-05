'use client'

import { $studentInfo } from '@/atoms/global'
import { useAtomValue } from 'jotai'
import styles from './style.module.css'

export default function StudentInfo() {
    const studentInfo = useAtomValue($studentInfo)
    const { studentIdNo, StudentName, studentProgram, studentSession, studentBatch, Shift } = studentInfo
    return (
        <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>ID</span>
                <span className={styles.infoItemContent}>{studentIdNo}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>Name</span>
                <span className={styles.infoItemContent}>{StudentName}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>Program</span>
                <span className={styles.infoItemContent}>{studentProgram}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>Batch</span>
                <span className={styles.infoItemContent}>{studentBatch}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>Shift</span>
                <span className={styles.infoItemContent}>{Shift}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.infoItemTitle}>Session</span>
                <span className={styles.infoItemContent}>{studentSession}</span>
            </div>
        </div>
    )
}