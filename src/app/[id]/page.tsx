import CGPAChart from '@/components/CGPAChart/CGPAChart'
import Heading from '@/components/Heading/Heading'
import LeftContainer from '@/components/LeftContainer/LeftContainer'
import ResultModal from '@/components/ResultModal/ResultModal'
import RightContainer from '@/components/RightContainer/RightContainer'
import {
  fetcher,
  formatStudentId,
  isObjectEmpty,
  sortByTrimesterAndYear,
} from '@/utils/helpers'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageProps } from '../../../types'
import styles from '../page.module.css'
import SSRProvider from './SSRProvider'
import { generateMetadata } from './generateMetadata'

export { generateMetadata }

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const studentId = formatStudentId(id)
  const TOTAL_ID_LENGTH = 13 // ### ### ##### ex: CSE 019 06859
  if (studentId.length !== TOTAL_ID_LENGTH) return notFound()
  const pageHeaders = await headers()
  const url =
    pageHeaders.get('x-forwarded-proto') + '://' + pageHeaders.get('host')
  const studentInfo = await fetcher(`${url}/api/student/${studentId}`)
  if (isObjectEmpty(studentInfo)) return notFound()
  const allTrimesters = await fetcher(`${url}/api/trimesters`)
  const studentTrimesters = allTrimesters.slice(
    allTrimesters.indexOf(studentInfo.studentSession)
  )
  const trimesterPromises = studentTrimesters.map((trimester: string) =>
    fetcher(`${url}/api/trimester-result/${studentId}/${trimester}`)
  )
  const onlineResultPromise = fetcher(`${url}/api/online-result/${studentId}`)
  const [trimesterResults, onlineResultData] = await Promise.all([
    Promise.all(trimesterPromises),
    onlineResultPromise,
  ])

  const validTrimesterResults = [
    ...trimesterResults,
    ...onlineResultData,
  ].filter(result => !isObjectEmpty(result))
  const allResults = sortByTrimesterAndYear(validTrimesterResults)

  return (
    <div className={styles.mainContainer}>
      <Heading />
      <SSRProvider
        studentId={studentId}
        studentInfo={studentInfo}
        allResults={allResults}
      >
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
      </SSRProvider>
    </div>
  )
}
