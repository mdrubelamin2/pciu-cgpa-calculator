'use client'

import { $studentInfo } from '@/atoms/global'
import CGPAChart from '@/components/CGPAChart/CGPAChart'
import Heading from '@/components/Heading/Heading'
import LeftContainer from '@/components/LeftContainer/LeftContainer'
import ResultModal from '@/components/ResultModal/ResultModal'
import RightContainer from '@/components/RightContainer/RightContainer'
import { isObjectEmpty } from '@/utils/helpers'
import { useAtomValue } from 'jotai'
import styles from './page.module.css'

export default function Home() {
  const studentInfo = useAtomValue($studentInfo)
  return (
    <div className={`${styles.mainContainer} ${isObjectEmpty(studentInfo) && styles.beforeSearch}`}>
      <Heading />
      <div className={styles.contentContainer}>
        <LeftContainer />
        <RightContainer />
      </div>
      <CGPAChart />
      <ResultModal />
    </div>
  )
}
