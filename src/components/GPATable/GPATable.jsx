'use client'

import { $allResults, $editMode, $modal } from '@/atoms/global'
import { roundToTwoDecimal } from '@/utils/helpers'
import { useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import styles from './style.module.css'

export default function GPATable() {
    const allResults = useAtomValue($allResults)
    console.log({ allResults })
    const editMode = useAtomValue($editMode)
    const setModal = useSetAtom($modal)
    const showModal = (trimesterResult) => () => setModal({ show: true, data: trimesterResult })

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
                <tbody>
                    {allResults.map(({ trimester, totalCreditHrs, currentGPA }, indx) => (
                        <tr key={trimester}>
                            <td>{trimester}</td>
                            <td>{totalCreditHrs}</td>
                            <td>{currentGPA ? roundToTwoDecimal(currentGPA, true) : '0.00'}</td>
                            <td>
                                <button className={styles.detailsBtn} onClick={showModal(allResults[indx])}>
                                    <Image src="/images/info.svg" className="info-img" width={13} height={13} alt="Info" />
                                    <span>Details</span>
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}