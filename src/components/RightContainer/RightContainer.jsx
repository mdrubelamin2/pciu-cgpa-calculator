'use client'

import { $studentInfo } from '@/atoms/global'
import { isObjectEmpty } from '@/utils/helpers'
import { useAtomValue } from 'jotai'
import GPATable from '../GPATable/GPATable'
import styles from './style.module.css'

export default function RightContainer() {
    const studentInfo = useAtomValue($studentInfo)

    if (isObjectEmpty(studentInfo)) return null

    return (
        <div className={styles.rightContainer}>
            <div className="right-container-title-wrp">
                <h4 className={styles.rightContainerTitle}>GPA History</h4>
            </div>
            <GPATable />
        </div>
    )
}