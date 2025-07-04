'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { $allResults, $editMode, $modal, $tempResults } from '@/atoms/global'
import {
  checkIfImprovement,
  generateCurrentGPA,
  handleResultData,
  roundToTwoDecimal,
  trimStr,
} from '@/utils/helpers'
import type { Course, TrimesterResult } from '../../../types'
import styles from './style.module.css'

const convertGradeToClassName = (letter: string) => {
  const grade = letter.trim().toLowerCase()
  const stat = grade.charAt(1)

  if (grade === '-') return 'i'
  if (!stat) return grade
  if (stat === '+') return grade.replace(stat, 'Plus')
  if (stat === '-') return grade.replace(stat, 'Minus')
}

const grades = [
  { letter: 'A+', point: 4.0 },
  { letter: 'A', point: 3.75 },
  { letter: 'A-', point: 3.5 },
  { letter: 'B+', point: 3.25 },
  { letter: 'B', point: 3.0 },
  { letter: 'B-', point: 2.75 },
  { letter: 'C+', point: 2.5 },
  { letter: 'C', point: 2.25 },
  { letter: 'D', point: 2.0 },
  { letter: 'F', point: 0.0 },
  { letter: 'I', point: 0.0 },
  { letter: 'W', point: 0.0 },
]

export default function ResultModal() {
  const [modal, setModal] = useAtom($modal)
  const editMode = useAtomValue($editMode)
  const [allResults, setAllResults] = useAtom($allResults)
  const { show, data: trimesterResult } = modal

  const closeModal = () => setModal({ show: false, data: null })

  const closeOutsideModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    // check if the click is outside the modalContainer which is the modal itself
    if ((e.target as HTMLElement).classList.contains(styles.modal)) closeModal()
  }

  const handleGradeChange =
    (trimesterData: Course) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTrimesterResult = structuredClone(
        trimesterResult as TrimesterResult
      )
      const { value: letterGrade } = e.target
      const grade = grades.find(grade => grade.letter === letterGrade)
      const courseIndex = newTrimesterResult.individuals.findIndex(
        (item: Course) => item.courseCode === trimesterData.courseCode
      )
      if (courseIndex !== -1 && grade) {
        newTrimesterResult.individuals[courseIndex].LetterGrade = grade.letter
        newTrimesterResult.individuals[courseIndex].GradePoint = grade.point
      }
      setAllResults((prev: TrimesterResult[]) => {
        const newAllResults = structuredClone(prev)
        const trimesterIndex = prev.findIndex(
          (item: TrimesterResult) =>
            item.trimester === (trimesterResult as TrimesterResult).trimester
        )
        if (trimesterIndex !== -1) {
          const { individuals } = newTrimesterResult
          const newResultData = handleResultData(individuals)
          newResultData.currentGPA = generateCurrentGPA(newResultData)
          newAllResults[trimesterIndex] = newResultData
        }
        return newAllResults
      })
      setModal(prev => {
        const newModal = { ...prev }
        newModal.data = newTrimesterResult
        return newModal
      })
    }

  const checkIfGradeEdittable = (courseCode: string): boolean => {
    const reversedResults = [...allResults].reverse()
    const resultIndx = reversedResults.findIndex(
      (trimester: TrimesterResult) =>
        trimester.trimester === (trimesterResult as TrimesterResult).trimester
    )
    const remainingResults = reversedResults.slice(resultIndx + 1)
    const courseExists = remainingResults.some(trimester =>
      trimester.individuals.some(
        item => item.courseCode === courseCode && !checkIfImprovement(item)
      )
    )
    // check if the course is not improvement course
    const isImprovementCourse = (
      trimesterResult as TrimesterResult
    ).individuals.some(
      (item: Course) =>
        item.courseCode === courseCode && checkIfImprovement(item)
    )
    return !courseExists && !isImprovementCourse
  }

  if (!show || !trimesterResult) return null

  return (
    <div
      className={styles.modal}
      onClick={closeOutsideModal}
      onKeyDown={e => e.key === 'Escape' && closeModal()}
      role='dialog'
      aria-modal='true'
    >
      <div className={styles.modalContainer}>
        <div className={styles.heading}>
          <p
            className={styles.title}
          >{`${(trimesterResult as TrimesterResult).trimester} Trimester Result`}</p>
          <button
            type='button'
            className={styles.closeBtn}
            onClick={closeModal}
            aria-label='Close modal'
          >
            <Image src='/images/close.svg' alt='' width={24} height={24} />
          </button>
        </div>
        <div className={styles.modalContent}>
          {(trimesterResult as TrimesterResult)?.individuals?.map(
            (item: Course, indx: number) => (
              <div key={item.courseCode} className={styles.gridContainer}>
                <div className={`${styles.gridItem} ${styles.itemNoOne}`}>
                  <div className={styles.center}>
                    <span className={styles.serialNo}>{indx + 1}</span>
                  </div>
                </div>
                <div className={`${styles.gridItem} ${styles.itemNoTwo}`}>
                  <div className={styles.courseName}>
                    {item.courseTitle}{' '}
                    <span className={styles.courseCode}>{item.courseCode}</span>
                  </div>
                </div>
                <div className={`${styles.gridItem} ${styles.itemNoThree}`}>
                  <div className={styles.leftBox}>
                    <Image
                      className={styles.svg}
                      src='/images/grade.svg'
                      alt=''
                      width={17}
                      height={17}
                    />
                    <span className={styles.grade}>Grade: </span>
                    <span className={styles.gradePoint}>
                      {roundToTwoDecimal(item.GradePoint, true)}
                    </span>
                    {editMode && checkIfGradeEdittable(item.courseCode) ? (
                      <>
                        <select
                          className={styles.gradeSelect}
                          onChange={handleGradeChange(item)}
                          value={trimStr(item.LetterGrade)}
                        >
                          {grades.map(grade => (
                            <option key={grade.letter} value={grade.letter}>
                              {grade.letter}
                            </option>
                          ))}
                        </select>
                        <GradeUndoButton
                          courseIndex={indx}
                          trimester={
                            (trimesterResult as TrimesterResult).trimester
                          }
                        />
                      </>
                    ) : (
                      <span
                        className={`${styles.cgpaLetter} ${styles[convertGradeToClassName(item.LetterGrade) || '']}`}
                      >
                        {item.LetterGrade}
                      </span>
                    )}
                  </div>
                  <div className={styles.middleBox}>
                    <Image
                      className={styles.svg}
                      src='/images/type.svg'
                      alt=''
                      width={16}
                      height={16}
                    />
                    <span className={styles.type}>Type: </span>
                    <span className={styles.typeStatus}>{item.status}</span>
                  </div>
                  <div className={styles.rightBox}>
                    <Image
                      className={styles.svg}
                      src='/images/credit.svg'
                      alt=''
                      height={16}
                      width={16}
                    />
                    <span className={styles.credit}>Credit: </span>
                    <span className={styles.subCreditPoint}>
                      {item.creditHr}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const GradeUndoButton = ({
  courseIndex,
  trimester,
}: {
  courseIndex: number
  trimester: string
}) => {
  const [allResults, setAllResults] = useAtom($allResults)
  const tempResults = useAtomValue($tempResults)
  const setModal = useSetAtom($modal)

  const trimesterIndex = allResults.findIndex(
    item => item.trimester === trimester
  )
  const course = allResults[trimesterIndex].individuals[courseIndex]
  const tempCourse = tempResults[trimesterIndex].individuals[courseIndex]
  const isGradeChanged =
    trimStr(course.LetterGrade) !== trimStr(tempCourse.LetterGrade)

  if (!isGradeChanged) return null

  const undoGradeChange = () => {
    setAllResults(prev => {
      const newAllResults = structuredClone(prev)
      const changeAbleTrimester = tempResults[trimesterIndex]
      const course = changeAbleTrimester.individuals[courseIndex]
      course.LetterGrade = tempCourse.LetterGrade
      course.GradePoint = tempCourse.GradePoint
      const newResultData = handleResultData(changeAbleTrimester.individuals)
      newResultData.currentGPA = generateCurrentGPA(newResultData)
      newAllResults[trimesterIndex] = newResultData
      return newAllResults
    })
    setModal(prev => {
      const newModal = { ...prev }
      newModal.data = tempResults[trimesterIndex]
      return newModal
    })
  }

  return (
    <button type='button' className={styles.undoBtn} onClick={undoGradeChange}>
      <Image
        src='/images/undo.svg'
        alt='Undo'
        className={styles.svg}
        width={13}
        height={13}
      />
    </button>
  )
}
