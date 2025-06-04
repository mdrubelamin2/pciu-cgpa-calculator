'use client'

import { $allResults, $studentId, $studentInfo } from '@/atoms/global'
import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

function Providers({ studentId, studentInfo, allResults, children }) {
  useHydrateAtoms([
    [$studentId, studentId],
    [$studentInfo, studentInfo],
    [$allResults, allResults],
  ])
  return children
}

export default function SSRProvider({ children, ...props }) {
  return (
    <Provider key={props.studentId}>
      <Providers {...props}>{children}</Providers>
    </Provider>
  )
}
