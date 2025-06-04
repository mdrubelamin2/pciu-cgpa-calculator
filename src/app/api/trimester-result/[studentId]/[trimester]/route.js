import { fetcher, handleResultData } from '@/utils/helpers'
import { urls } from '@/utils/urls'
import { NextResponse } from 'next/server'
import { getCache } from '@/utils/cache'

const trimesterResultCache = getCache('trimesterResult', { max: 2000 })

export const GET = async (_, { params }) => {
  const { studentId, trimester } = await params
  const cacheKey = `${studentId}:${trimester}`
  if (trimesterResultCache.has(cacheKey)) {
    return NextResponse.json(trimesterResultCache.get(cacheKey))
  }
  // fetch the trimester result
  const url = `${urls.STUDENT_RESULT_API}/get?studentIdNo=${studentId}&Trimester=${trimester}`
  const data = await fetcher(url)
  if (data.length === 0) return NextResponse.json({})
  const resultData = handleResultData(data)
  trimesterResultCache.set(cacheKey, resultData)
  return NextResponse.json(resultData)
}
