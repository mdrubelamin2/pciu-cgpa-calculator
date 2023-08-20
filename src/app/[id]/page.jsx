import CGPAChart from "@/components/CGPAChart/CGPAChart"
import Heading from "@/components/Heading/Heading"
import LeftContainer from "@/components/LeftContainer/LeftContainer"
import ResultModal from "@/components/ResultModal/ResultModal"
import RightContainer from "@/components/RightContainer/RightContainer"
import { fetcher, formatStudentId, isObjectEmpty } from "@/utils/helpers"
import { headers } from "next/headers"
import { notFound } from 'next/navigation'
import styles from '../page.module.css'
import SSRProvider from "./SSRProvider"

export default async function Page({ params }) {
    const { id } = params
    const studentId = formatStudentId(id)
    const pageHeaders = headers()
    const url = pageHeaders.get('x-forwarded-proto') + '://' + pageHeaders.get('host')
    const studentInfo = await fetcher(`${url}/api/student/${studentId}`)
    if (isObjectEmpty(studentInfo)) return notFound()
    const allTrimesters = await fetcher(`${url}/api/trimesters`)
    const studentTrimesters = allTrimesters.slice(allTrimesters.indexOf(studentInfo.studentSession))
    studentTrimesters.reverse()
    const allResults = []
    for (let i = 0; i < studentTrimesters.length; i++) {
        const trimester = studentTrimesters[i]
        const resultData = await fetcher(`${url}/api/trimester-result/${studentId}/${trimester}`)
        if (!isObjectEmpty(resultData)) allResults.unshift(resultData)
    }
    const onlineResultData = await fetcher(`${url}/api/online-result/${studentId}`)
    if (!isObjectEmpty(onlineResultData)) allResults.unshift(onlineResultData)

    return (
        <div className={styles.mainContainer}>
            <Heading />
            <SSRProvider studentId={studentId} studentInfo={studentInfo} allResults={allResults}>
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