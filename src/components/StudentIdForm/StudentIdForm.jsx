'use client'

import { $allResults, $editMode, $studentInfo } from '@/atoms/global'
import { fetcher, getOnlineResult, getStudentInfo, getTrimesterList, getTrimesterResult, isObjectEmpty, showToast } from '@/utils/helpers'
import { InputMask } from '@react-input/mask'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import useSWR from 'swr'
import styles from './style.module.css'

export default function StudentIdForm() {
    const [studentId, setStudentId] = useState('')
    const setStudentInfo = useSetAtom($studentInfo)
    const setAllResults = useSetAtom($allResults)
    const setEditMode = useSetAtom($editMode)
    const [isLoading, setIsLoading] = useState(false)
    const { data: allTrimesters } = useSWR(`/api/trimesters`, fetcher, { revalidateOnFocus: false })

    const handleStudentId = e => { setStudentId(e.target.value.toUpperCase()) }

    const handleFormSubmit = async e => {
        e.preventDefault()
        const TOTAL_ID_LENGTH = 13 // ### ### ##### ex: CSE 019 06859

        if (studentId.length < TOTAL_ID_LENGTH) {
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
        const bodyElm = document.querySelector('body')
        bodyElm.classList.remove('before-search')
        setStudentInfo(studentData)
        setEditMode(false)
        setAllResults([])
        const studentTrimesters = allTrimesters.slice(allTrimesters.indexOf(studentData.studentSession))
        for (let i = 0; i < studentTrimesters.length; i++) {
            const trimester = studentTrimesters[i]
            const resultData = await getTrimesterResult(studentId, trimester)
            if (!isObjectEmpty(resultData)) setAllResults(prevResults => [resultData, ...prevResults])
        }
        const onlineResultData = await getOnlineResult(studentId)
        if (!isObjectEmpty(onlineResultData)) setAllResults(prevResults => [onlineResultData, ...prevResults])
        setIsLoading(false)
    }

    return (
        <form className="form-container" onSubmit={handleFormSubmit}>
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