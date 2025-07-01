'use client'

import {
  $allResults,
  $editMode,
  $studentId,
  $studentInfo,
} from '@/atoms/global'
import {
  getOnlineResult,
  getStudentInfo,
  getTrimesterList,
  getTrimesterResult,
  isObjectEmpty,
  showToast,
  sortByTrimesterAndYear,
} from '@/utils/helpers'
import { sendGAEvent } from '@next/third-parties/google'
import { InputMask } from '@react-input/mask'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import { TrimesterResult } from '../../../types'
import styles from './style.module.css'

export default function StudentIdForm() {
  const [studentId, setStudentId] = useAtom($studentId)
  const setStudentInfo = useSetAtom($studentInfo)
  const setAllResults = useSetAtom($allResults)
  const setEditMode = useSetAtom($editMode)
  const [isLoading, setIsLoading] = useState(false)

  const handleStudentId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value.toUpperCase())
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await generateStudentResult()
    } catch (_) {}

    setIsLoading(false)
  }

  const generateStudentResult = async () => {
    const TOTAL_ID_LENGTH = 13 // ### ### ##### ex: CSE 019 06859

    if (studentId.length !== TOTAL_ID_LENGTH) {
      showToast('Please check if the Student ID is valid')
      return
    }
    setIsLoading(true)
    const studentData = await getStudentInfo(studentId)
    if (isObjectEmpty(studentData)) {
      setIsLoading(false)
      showToast('Student ID not found in the PCIU database')
      return
    }
    sendGAEvent('event', 'STUDENT-ID', { value: studentId })
    const bodyElm = document.querySelector('body')
    bodyElm?.classList.remove('before-search')
    setStudentInfo(studentData)
    setEditMode(false)
    setAllResults([])

    const allTrimesters = await getTrimesterList()
    const studentTrimesters = allTrimesters.slice(
      allTrimesters.indexOf(studentData.studentSession)
    )

    const trimesterPromises = studentTrimesters.map((trimester: string) =>
      getTrimesterResult(studentId, trimester).then(result => {
        if (!isObjectEmpty(result)) {
          setAllResults((prevResults: TrimesterResult[]) =>
            sortByTrimesterAndYear([...prevResults, result])
          )
        }
        return result
      })
    )

    const onlineResultPromise = getOnlineResult(studentId).then(onlineData => {
      if (!isObjectEmpty(onlineData)) {
        setAllResults((prevResults: TrimesterResult[]) =>
          sortByTrimesterAndYear([...prevResults, ...onlineData])
        )
      }
      return onlineData
    })

    await Promise.allSettled([...trimesterPromises, onlineResultPromise])
  }

  return (
    <form className='form-container' onSubmit={submitForm}>
      <div className='input-container'>
        <label htmlFor='id-input' className={styles.inputLabel}>
          Enter Your ID
        </label>
        <InputMask
          id='id-input'
          className={styles.idInput}
          mask='@@@ ### #####'
          replacement={{ '#': /\d/, '@': /[A-Z]/i }}
          onInput={handleStudentId}
          value={studentId}
          placeholder='XXX XXX XXXX'
        />
      </div>
      <button
        className={`${styles.searchBtn} ${isLoading && styles.loading}`}
        type='submit'
        disabled={isLoading}
      >
        {!isLoading && 'Search'}
        {isLoading && 'Searching...'}
      </button>
    </form>
  )
}
