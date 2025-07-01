import { NextResponse } from 'next/server'
import parse from 'node-html-parser'
import { getCache } from '@/utils/cache'
import { isObjectEmpty, trimStr } from '@/utils/helpers'
import { urls } from '@/utils/urls'
import type { TrimesterResult } from '../../../../../types'
import { fetchOnlineResult } from '../../helpers'

const onlineResultCache = getCache('onlineResult', {
  ttl: 120 * 24 * 60 * 60,
  max: 1000,
})

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ studentId: string }> }
) => {
  const { studentId } = await params
  const url = urls.ONLINE_RESULT_SITE

  let initialReq: Response
  let initialText: string
  let initialRoot: ReturnType<typeof parse>

  try {
    initialReq = await fetch(url, {
      cache: 'no-cache',
      credentials: 'include',
    })

    if (!initialReq.ok) {
      console.warn(`Initial request failed with status: ${initialReq.status}`)
      return NextResponse.json([])
    }

    initialText = await initialReq.text()
    initialRoot = parse(initialText)
  } catch (error) {
    console.warn(
      `Failed to fetch initial online result page: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return NextResponse.json([])
  }

  const requestVerificationToken = initialRoot
    .querySelector('form [name="__RequestVerificationToken"]')
    ?.getAttribute('value')
  const RsData = initialRoot
    .querySelector('form [name="RsData"]')
    ?.getAttribute('value')
  const semester = initialRoot.querySelector('form [name="Semester"]')
    ?.attributes.Value
  const semesters = initialRoot.querySelectorAll('#Semester option')
  const semestersList = []

  if (semesters.length) {
    semesters.forEach(trimester => {
      const optValue = trimStr(
        trimester.rawAttrs.split('value=')[1].split('"')[1]
      )
      if (!optValue) return null
      semestersList.unshift(optValue)
    })
  } else if (semester) {
    semestersList.push(semester)
  }

  const allResults: TrimesterResult[] = []
  if (!requestVerificationToken || !semester) {
    console.warn(
      `Missing required tokens: requestVerificationToken=${!!requestVerificationToken}, semester=${!!semester}`
    )
    return NextResponse.json([])
  }

  // get the cookies from the fetch response
  const headers = initialReq.headers
  const cookies = headers.getSetCookie()
  const siteCookies: string[] = []
  cookies.forEach(c => {
    const cookie = c.split(';')[0]
    if (!siteCookies.includes(cookie)) {
      siteCookies.push(cookie)
    }
  })

  const results = await Promise.allSettled(
    semestersList.map(async currentSemester => {
      const cacheKey = `${studentId}:${currentSemester}`

      if (await onlineResultCache.has(cacheKey)) {
        return await onlineResultCache.get(cacheKey)
      }

      try {
        const singleResult = await fetchOnlineResult({
          studentId,
          semester: currentSemester,
          requestVerificationToken,
          RsData: RsData || '',
          siteCookies,
        })

        if (singleResult && !isObjectEmpty(singleResult)) {
          await onlineResultCache.set(cacheKey, singleResult)
          return singleResult
        }
      } catch (error) {
        console.error(
          `Error fetching semester ${currentSemester}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }

      return null
    })
  )

  results.forEach(result => {
    if (
      result.status === 'fulfilled' &&
      result.value &&
      !isObjectEmpty(result.value)
    ) {
      allResults.push(result.value as TrimesterResult)
    }
  })

  return NextResponse.json(allResults)
}
