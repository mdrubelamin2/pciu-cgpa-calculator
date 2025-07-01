import { NextResponse } from 'next/server'
import parse from 'node-html-parser'
import { fetcherText, trimStr } from '@/utils/helpers'
import { urls } from '@/utils/urls'

export const GET = async () => {
  const url = urls.TRIMESTER_RESULT_SITE
  const data = await fetcherText(url)
  const root = parse(data)
  const trimesters = root.querySelectorAll('#semester option')
  const trimestersList: string[] = []
  trimesters.forEach(trimester => {
    const optValue = trimStr(
      trimester.rawAttrs.split('value=')[1].split('"')[1]
    )
    if (!optValue) return
    trimestersList.unshift(optValue)
  })
  return NextResponse.json(trimestersList)
}
