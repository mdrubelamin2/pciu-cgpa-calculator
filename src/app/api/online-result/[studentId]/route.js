import { isObjectEmpty, trimStr } from "@/utils/helpers"
import { urls } from "@/utils/urls"
import { NextResponse } from "next/server"
import parse from "node-html-parser"
import { fetchOnlineResult } from "../../helpers"
import { getCache } from "@/utils/cache"

const onlineResultCache = getCache("onlineResult", { max: 1000 })

export const GET = async (_, { params }) => {
    const { studentId } = await params
    const url = urls.ONLINE_RESULT_SITE
    const initialReq = await fetch(url, {
        cache: "no-cache",
        credentials: 'include',
    })
    const initialText = await initialReq.text()
    const initialRoot = parse(initialText);

    const requestVerificationToken = initialRoot.querySelector('form [name="__RequestVerificationToken"]').getAttribute('value')
    const RsData = initialRoot.querySelector('form [name="RsData"]').getAttribute('value')
    const semester = initialRoot.querySelector('form [name="Semester"]').attributes['Value']
    const semesters = initialRoot.querySelectorAll('#Semester option')
    const semestersList = []
    if (semesters.length) {
        semesters.forEach(trimester => {
            const optValue = trimStr(trimester.rawAttrs.split('value=')[1].split('"')[1])
            if (!optValue) return null
            semestersList.unshift(optValue)
        })
    } else if (semester) {
        semestersList.push(semester)
    }

    const allResults = []
    if (!requestVerificationToken || !semester) return NextResponse.json(allResults)

    // get the cookies from the fetch response
    const headers = initialReq.headers
    const cookies = headers.getSetCookie()
    const siteCookies = []
    cookies.forEach(c => {
        const cookie = c.split(';')[0]
        if (!siteCookies.includes(cookie)) {
            siteCookies.push(cookie)
        }
    })

    for (let i = 0; i < semestersList.length; i++) {
        const currentSemester = semestersList[i]
        const singleResult = await fetchOnlineResult({ studentId, semester: currentSemester, requestVerificationToken, RsData, siteCookies })
        const cacheKey = `${studentId}:${currentSemester}`
        if (singleResult && !isObjectEmpty(singleResult)) {
            onlineResultCache.set(cacheKey, singleResult)
            allResults.push(singleResult)
        }
    }
    return NextResponse.json(allResults)
}
