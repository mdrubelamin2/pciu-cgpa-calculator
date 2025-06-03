import { fetcherText, trimStr } from "@/utils/helpers"
import { urls } from "@/utils/urls"
import { NextResponse } from "next/server"
import parse from "node-html-parser"

export const GET = async () => {
    const url = urls.TRIMESTER_RESULT_SITE
    const data = await fetcherText(url)
    const root = parse(data)
    const trimesters = root.querySelectorAll('#semester option')
    const trimestersList = []
    trimesters.forEach(trimester => {
        const optValue = trimStr(trimester.rawAttrs.split('value=')[1].split('"')[1])
        if (!optValue) return
        trimestersList.unshift(optValue)
    })
    return NextResponse.json(trimestersList);
}