'use client'

import { $studentInfo } from '@/atoms/global'
import Heading from '@/components/Heading/Heading'
import LeftContainer from '@/components/LeftContainer/LeftContainer'
import RightContainer from '@/components/RightContainer/RightContainer'
import { isObjectEmpty } from '@/utils/helpers'
import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const CGPAChart = dynamic(() => import('@/components/CGPAChart/CGPAChart'), { ssr: false })
const ResultModal = dynamic(() => import('@/components/ResultModal/ResultModal'), { ssr: false })

export default function Home() {
  const studentInfo = useAtomValue($studentInfo)
  return (
    <div className={`${styles.mainContainer} ${isObjectEmpty(studentInfo) && styles.beforeSearch}`}>
      <Heading />
      <div className={styles.contentContainer}>
        <LeftContainer />
        <RightContainer />
      </div>
      {!isObjectEmpty(studentInfo) && (
        <>
          <CGPAChart />
          <ResultModal />
        </>
      )}
    </div>
  )
}
