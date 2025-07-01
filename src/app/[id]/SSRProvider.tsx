'use client'

import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { $allResults, $studentId, $studentInfo } from '@/atoms/global'
import type { SSRProviderProps } from '../../../types'

function Providers({
  studentId,
  studentInfo,
  allResults,
  children,
}: SSRProviderProps) {
  useHydrateAtoms([
    [$studentId, studentId],
    [$studentInfo, studentInfo],
    [$allResults, allResults],
  ])
  return children
}

export default function SSRProvider({ children, ...props }: SSRProviderProps) {
  return (
    <Provider key={props.studentId}>
      <Providers {...props}>{children}</Providers>
    </Provider>
  )
}
