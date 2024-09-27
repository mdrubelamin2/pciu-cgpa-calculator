'use client'

import { $allResults, $editMode, $studentId, $studentInfo } from '@/atoms/global'
import { getOnlineResult, getStudentInfo, getTrimesterList, getTrimesterResult, isObjectEmpty, showToast } from '@/utils/helpers'
import { sendGAEvent } from '@next/third-parties/google'
import { InputMask } from '@react-input/mask'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import styles from './style.module.css'

export default function StudentIdForm() {
    const [studentId, setStudentId] = useAtom($studentId)
    const setStudentInfo = useSetAtom($studentInfo)
    const setAllResults = useSetAtom($allResults)
    const setEditMode = useSetAtom($editMode)
    const [isLoading, setIsLoading] = useState(false)

    const handleStudentId = e => { setStudentId(e.target.value.toUpperCase()) }

    const submitForm = async e => {
        e.preventDefault()
        try {
            await generateStudentResult()
        } catch (_) { }

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
        sendGAEvent({ event: 'STUDENT-ID', value: studentId })
        const bodyElm = document.querySelector('body')
        bodyElm.classList.remove('before-search')
        setStudentInfo(studentData)
        setEditMode(false)
        setAllResults([])
        const allTrimesters = await getTrimesterList()
        const studentTrimesters = allTrimesters.slice(allTrimesters.indexOf(studentData.studentSession))
        for (let i = 0; i < studentTrimesters.length; i++) {
            const trimester = studentTrimesters[i]
            const resultData = await getTrimesterResult(studentId, trimester)
            if (!isObjectEmpty(resultData)) setAllResults(prevResults => [resultData, ...prevResults])
        }
        const onlineResultData = await getOnlineResult(studentId)
        if (onlineResultData.length) setAllResults(prevResults => [...onlineResultData, ...prevResults])
    }

    return (
        <form className="form-container" onSubmit={submitForm}>
            <div className="input-container">
                <label htmlFor="id-input" className={styles.inputLabel}>Enter Your ID</label>
                <InputMask id="id-input" className={styles.idInput} mask="@@@ ### #####" replacement={{ '#': /\d/, '@': /[A-Z]/i }} onInput={handleStudentId} value={studentId} placeholder="XXX XXX XXXX" />
            </div>
            <button className={`${styles.searchBtn} ${isLoading && styles.loading}`} type="submit" disabled={isLoading}>
                {!isLoading && 'Search'}
                {isLoading && 'Searching...'}
                {/* <div className={styles.ldsRing}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div> */}
            </button>
        </form >
    )
}