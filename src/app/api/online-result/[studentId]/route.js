import { fetcherText, handleResultData, trimStr } from "@/utils/helpers"
import { urls } from "@/utils/urls"
import { NextResponse } from "next/server"
import parse from "node-html-parser"

export const GET = async (_, { params }) => {
    const { studentId } = params
    const url = urls.ONLINE_RESULT_SITE
    const initialReq = await fetch(url)
    const initialText = await initialReq.text()
    const initialRoot = parse(initialText);

    const requestVerificationToken = initialRoot.querySelector('form [name="__RequestVerificationToken"]').getAttribute('value')
    const semester = initialRoot.querySelector('#Semester').rawAttributes.Value

    if (!(requestVerificationToken && semester)) return new NextResponse(JSON.stringify({}))

    const formData = new FormData();
    formData.append('__RequestVerificationToken', requestVerificationToken);
    formData.append('StudentIdNo', studentId);
    formData.append('Semester', semester);

    // get the cookies from the fetch response
    const headers = initialReq.headers
    const cookies = headers.get('set-cookie')
    const cookie = cookies.split(';')[0]

    const config = {
        method: 'POST',
        headers: {
            'Cookie': cookie,
        },
        body: formData
    }

    const resultResp = await fetcherText(url, config)
    const bodyHTML = trimStr(resultResp)
    const parsedResHTML = parse(bodyHTML)
    const cgpaTd = parsedResHTML.querySelector('.table:first-child tr:last-child td:last-child')

    if (!cgpaTd) return new NextResponse(JSON.stringify({}))

    const cgpaTxt = cgpaTd.text
    const GPA = parseFloat(cgpaTxt)

    const allTrFromSecondTbodyExceptFirstRow = parsedResHTML.querySelectorAll('.table:nth-child(2) tr:not(:first-child)')
    const results = []
    allTrFromSecondTbodyExceptFirstRow.forEach(tr => {
        // filter the tr childnodes that are only html elements and node type 1
        const tds = tr.childNodes.filter(node => node.nodeType === 1)
        // tds index = 1 - course code, 2 - course name, 3 - status, 5 - credit hr, 6 - letter grade, 7 - grade point
        const courseCode = trimStr(tds[1].text)
        const courseTitle = trimStr(tds[2].text)
        const status = trimStr(tds[3].text)
        const creditHrTxt = trimStr(tds[5].text)
        const LetterGrade = trimStr(tds[6].text)
        const gradePointTxt = trimStr(tds[7].text)
        const creditHr = parseFloat(creditHrTxt)
        const GradePoint = parseFloat(gradePointTxt)
        results.push({ semester, courseCode, courseTitle, status, creditHr, GradePoint, LetterGrade, GPA })
    })
    const resultData = handleResultData(results)
    return new NextResponse(JSON.stringify(resultData))
}