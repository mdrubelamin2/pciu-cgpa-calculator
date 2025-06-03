import { fetcher, handleResultData } from "@/utils/helpers"
import { urls } from "@/utils/urls"
import { NextResponse } from "next/server"

export const GET = async (_, { params }) => {
    const { studentId, trimester } = await params
    // fetch the trimester result
    const url = `${urls.STUDENT_RESULT_API}/get?studentIdNo=${studentId}&Trimester=${trimester}`
    const data = await fetcher(url)
    if (data.length === 0) return new NextResponse(JSON.stringify({}));
    const resultData = handleResultData(data)
    return new NextResponse(JSON.stringify(resultData));
}