import { isObjectEmpty, trimStr } from '@/utils/helpers'
import { urls } from '@/utils/urls'
import { NextResponse } from 'next/server'
import parse from 'node-html-parser'
import { fetchOnlineResult } from '../../helpers'
import { getCache } from '@/utils/cache'

const onlineResultCache = getCache('onlineResult', { max: 1000 })

export const GET = async (_, { params }) => {
  const { studentId } = await params
  const url = urls.ONLINE_RESULT_SITE

  let initialReq, initialText, initialRoot

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
    console.warn(`Failed to fetch initial online result page: ${error.message}`)
    return NextResponse.json([])
  }

  const requestVerificationToken = initialRoot
    .querySelector('form [name="__RequestVerificationToken"]')
    ?.getAttribute('value')
  const RsData = initialRoot
    .querySelector('form [name="RsData"]')
    ?.getAttribute('value')
  const semester = initialRoot.querySelector('form [name="Semester"]')
    ?.attributes['Value']
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

  const allResults = []
  if (!requestVerificationToken || !semester) {
    console.warn(
      `Missing required tokens: requestVerificationToken=${!!requestVerificationToken}, semester=${!!semester}`
    )
    return NextResponse.json(allResults)
  }

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
    const cacheKey = `${studentId}:${currentSemester}`

    // Check cache first to avoid unnecessary requests
    if (onlineResultCache.has(cacheKey)) {
      const cachedResult = onlineResultCache.get(cacheKey)
      if (cachedResult && !isObjectEmpty(cachedResult)) {
        allResults.push(cachedResult)
        continue
      }
    }

    try {
      const singleResult = await fetchOnlineResult({
        studentId,
        semester: currentSemester,
        requestVerificationToken,
        RsData,
        siteCookies,
      })

      if (singleResult && !isObjectEmpty(singleResult)) {
        onlineResultCache.set(cacheKey, singleResult)
        allResults.push(singleResult)
      }
    } catch (error) {
      console.warn(
        `Error processing semester ${currentSemester} for ${studentId}:`,
        error.message
      )
    }
  }

  return NextResponse.json(allResults)
}
