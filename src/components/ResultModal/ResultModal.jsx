'use client'

import { $modal } from "@/atoms/global"
import { useAtom } from "jotai"
import Image from "next/image"
import styles from './style.module.css'

const convertGradeToClassName = letter => {
    const grade = letter.trim().toLowerCase()
    const [_, stat] = grade

    if (grade === '-') return 'i'
    if (!stat) return grade
    if (stat == "+") return grade.replace(stat, "Plus")
    if (stat == "-") return grade.replace(stat, "Minus")
}

export default function ResultModal() {
    const [modal, setModal] = useAtom($modal)
    const { show, data: trimesterResult } = modal

    const closeModal = () => setModal({ show: false, data: {} })

    const closeOutsideModal = e => {
        e.stopPropagation()
        // check if the click is outside the modalContainer which is the modal itself
        if (e.target.classList.contains(styles.modal)) closeModal()
    }

    if (!show) return null

    return (
        <div className={styles.modal} onClick={closeOutsideModal}>
            <div className={styles.modalContainer}>
                <div className={styles.heading}>
                    <p className={styles.title}>{`${trimesterResult.trimester} Trimester Result`}</p>
                    <span className={styles.closeBtn} onClick={closeModal}>
                        <Image src="/images/close.svg" alt="" width={24} height={24} />
                    </span>
                </div>
                <div className={styles.modalContent}>
                    {trimesterResult?.individuals?.map((item, indx) => (
                        <div key={indx} className={styles.gridContainer}>
                            <div className={`${styles.gridItem} ${styles.itemNoOne}`}>
                                <div className={styles.center}>
                                    <span className={styles.serialNo}>{indx + 1}</span>
                                </div>
                            </div>
                            <div className={`${styles.gridItem} ${styles.itemNoTwo}`}>
                                <div className={styles.courseName}>{item.courseTitle} <span className={styles.courseCode}>{item.courseCode
                                }</span>
                                </div>
                            </div>
                            <div className={`${styles.gridItem} ${styles.itemNoThree}`}>
                                <div className={styles.leftBox}>
                                    <span>
                                        <Image className={styles.svg} src="/images/grade.svg" alt="" width={17} height={17} />
                                    </span>
                                    <span className={styles.grade}>Grade: </span>
                                    <span className={styles.gradePoint}>{item.GradePoint}</span>
                                    <span className={`${styles.cgpaLetter} ${styles[convertGradeToClassName(item.LetterGrade)]}`}>{item.LetterGrade}</span>
                                </div>
                                <div className={styles.middleBox}>
                                    <span>
                                        <Image className={styles.svg} src="/images/type.svg" alt="" width={16} height={16} />
                                    </span>
                                    <span className={styles.type}>Type: </span>
                                    <span className={styles.typeStatus}>{item.status}</span>
                                </div>
                                <div className={styles.rightBox}>
                                    <span>
                                        <Image className={styles.svg} src="/images/credit.svg" alt="" height={16} width={16} />
                                    </span>
                                    <span className={styles.credit}>Credit: </span>
                                    <span className={styles.subCreditPoint}>{item.creditHr}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}
