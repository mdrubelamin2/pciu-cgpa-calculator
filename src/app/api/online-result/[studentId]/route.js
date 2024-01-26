import { isObjectEmpty, trimStr } from "@/utils/helpers"
import { urls } from "@/utils/urls"
import { NextResponse } from "next/server"
import parse from "node-html-parser"
import { fetchOnlineResult } from "../../helpers"

export const GET = async (_, { params }) => {
    const { studentId } = params
    const url = urls.ONLINE_RESULT_SITE
    const initialReq = await fetch(url, {
        cache: "no-cache",
        credentials: 'include',
    })
    const initialText = await initialReq.text()
    const initialRoot = parse(initialText);

    const requestVerificationToken = initialRoot.querySelector('form [name="__RequestVerificationToken"]').getAttribute('value')
    const RsData = initialRoot.querySelector('form [name="RsData"]').getAttribute('value')
    const semesters = initialRoot.querySelectorAll('#Semester option')
    const semestersList = []
    semesters.forEach(trimester => {
        const optValue = trimStr(trimester.rawAttrs.split('value=')[1].split('"')[1])
        if (!optValue) return null
        semestersList.unshift(optValue)
    })

    const allResults = []

    if (!(requestVerificationToken && semestersList.length)) return new NextResponse(JSON.stringify(allResults))

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
        const semester = semestersList[i]
        const singleResult = await fetchOnlineResult({ studentId, semester, requestVerificationToken, RsData, siteCookies })
        if (!isObjectEmpty(singleResult)) allResults.push(singleResult)
    }

    return new NextResponse(JSON.stringify(allResults))
}
