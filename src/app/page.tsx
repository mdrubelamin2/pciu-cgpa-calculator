'use client'

import { Provider, useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { $studentInfo } from '@/atoms/global'
import Heading from '@/components/Heading/Heading'
import LeftContainer from '@/components/LeftContainer/LeftContainer'
import { isObjectEmpty } from '@/utils/helpers'

const RightContainer = dynamic(
  () => import('@/components/RightContainer/RightContainer')
)
const CGPAChart = dynamic(() => import('@/components/CGPAChart/CGPAChart'))
const ResultModal = dynamic(
  () => import('@/components/ResultModal/ResultModal')
)

function Home() {
  const studentInfo = useAtomValue($studentInfo)
  const hasStudentData = !isObjectEmpty(studentInfo)

  return (
    <div className={`main-container ${!hasStudentData ? 'before-search' : ''}`}>
      <Heading />
      <div className='content-container'>
        <LeftContainer />
        <RightContainer />
      </div>
      {hasStudentData && (
        <>
          <CGPAChart />
          <ResultModal />
        </>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Provider>
      <Home />
    </Provider>
  )
}
