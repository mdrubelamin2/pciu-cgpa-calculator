'use client'

import { $studentInfo } from '@/atoms/global'
import Heading from '@/components/Heading/Heading'
import LeftContainer from '@/components/LeftContainer/LeftContainer'
import { isObjectEmpty } from '@/utils/helpers'
import { Provider, useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const RightContainer = dynamic(() => import('@/components/RightContainer/RightContainer'))
const CGPAChart = dynamic(() => import('@/components/CGPAChart/CGPAChart'))
const ResultModal = dynamic(() => import('@/components/ResultModal/ResultModal'))

function Home() {
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

export default function Page() {
  return <Provider><Home /></Provider>
}
