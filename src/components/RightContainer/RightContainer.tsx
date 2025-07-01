'use client'

import { useAtomValue } from 'jotai'
import { $studentInfo } from '@/atoms/global'
import { isObjectEmpty } from '@/utils/helpers'
import EditModeButton from '../EditModeButton/EditModeButton'
import GPATable from '../GPATable/GPATable'
import ShareButton from '../ShareButton/ShareButton'
import styles from './style.module.css'

export default function RightContainer() {
  const studentInfo = useAtomValue($studentInfo)

  if (isObjectEmpty(studentInfo)) return null

  return (
    <div className={styles.rightContainer}>
      <div className={styles.headerWrp}>
        <div className={styles.leftHeader}>
          <h4 className={styles.rightContainerTitle}>GPA History</h4>
          <EditModeButton />
        </div>
        <div className={styles.rightHeader}>
          <ShareButton />
        </div>
      </div>
      <GPATable />
    </div>
  )
}
