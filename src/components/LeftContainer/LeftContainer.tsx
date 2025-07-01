'use client'

import { useAtomValue } from 'jotai'
import { $studentInfo } from '@/atoms/global'
import { isObjectEmpty } from '@/utils/helpers'
import CGPABox from '../CGPABox/CGPABox'
import StudentIdForm from '../StudentIdForm/StudentIdForm'
import StudentInfo from '../StudentInfo/StudentInfo'
import styles from './style.module.css'

export default function LeftContainer() {
  const studentInfo = useAtomValue($studentInfo)

  return (
    <div
      className={`${styles.leftContent} ${isObjectEmpty(studentInfo) && styles.beforeSearch}`}
    >
      <StudentIdForm />
      {!isObjectEmpty(studentInfo) && (
        <>
          <StudentInfo />
          <CGPABox />
        </>
      )}
    </div>
  )
}
