'use client'

import { $allResults, $studentId, $studentInfo } from "@/atoms/global"
import { useHydrateAtoms } from "jotai/utils"

export default function SSRProvider({ studentId, studentInfo, allResults, children }) {
  useHydrateAtoms([
    [$studentId, studentId],
    [$studentInfo, studentInfo],
    [$allResults, allResults],
  ])
  return children
}