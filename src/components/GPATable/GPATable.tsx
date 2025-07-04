'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { $allResults, $editMode, $modal } from '@/atoms/global'
import { roundToTwoDecimal } from '@/utils/helpers'
import type { TrimesterResult } from '../../../types'
import styles from './style.module.css'

export default function GPATable() {
  const allResults = useAtomValue($allResults)
  const editMode = useAtomValue($editMode)
  const setModal = useSetAtom($modal)
  const [animationParent] = useAutoAnimate()
  const showModal = (trimesterResult: TrimesterResult) => () =>
    setModal({ show: true, data: trimesterResult })

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Trimester</th>
            <th>Credit Hr.</th>
            <th>SGPA</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody ref={animationParent}>
          {allResults.map(({ trimester, totalCreditHrs, currentGPA }, indx) => (
            <tr key={trimester}>
              <td>{trimester}</td>
              <td>{totalCreditHrs}</td>
              <td>
                {currentGPA ? roundToTwoDecimal(currentGPA, true) : '0.00'}
              </td>
              <td>
                <button
                  type='button'
                  className={styles.detailsBtn}
                  onClick={showModal(allResults[indx])}
                >
                  {editMode && (
                    <>
                      <Image
                        src='/images/edit.svg'
                        className='edit-img'
                        width={13}
                        height={13}
                        alt='Edit'
                      />
                      <span>Edit</span>
                    </>
                  )}
                  {!editMode && (
                    <>
                      <Image
                        src='/images/info.svg'
                        className='info-img'
                        width={13}
                        height={13}
                        alt='Info'
                      />
                      <span>Details</span>
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
