import { NextResponse } from 'next/server'
import { getCache } from '@/utils/cache'
import { fetcher } from '@/utils/helpers'
import { urls } from '@/utils/urls'

const studentInfoCache = getCache('studentInfo')

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  if (await studentInfoCache.has(id)) {
    return NextResponse.json(await studentInfoCache.get(id))
  }

  const url = `${urls.STUDENT_INFO_API}/get?studentIdNo=${id}`
  const data = await fetcher(url)

  if (data.length === 0) return NextResponse.json({})

  await studentInfoCache.set(id, data[0])
  return NextResponse.json(data[0])
}
