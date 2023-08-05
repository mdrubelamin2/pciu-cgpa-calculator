import { atom } from "jotai";

export const $studentId = atom('')
export const $studentInfo = atom({})
export const $trimesterList = atom([])
export const $allResults = atom([])
export const $modal = atom({ show: false, data: {} })