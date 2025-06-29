import { atom } from 'jotai'
import { StudentInfo, TrimesterResult } from '../../types'

export const $studentId = atom<string>('')
export const $studentInfo = atom<StudentInfo>({} as StudentInfo)
export const $trimesterList = atom<string[]>([])
export const $allResults = atom<TrimesterResult[]>([])
export const $modal = atom<{ show: boolean; data: TrimesterResult | {} }>({
  show: false,
  data: {},
})
export const $editMode = atom<boolean>(false)
export const $tempResults = atom<TrimesterResult[]>([])
