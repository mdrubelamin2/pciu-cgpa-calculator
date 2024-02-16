import { $allResults, $editMode, $tempResults } from "@/atoms/global"
import { useAtom, useSetAtom } from "jotai"
import Image from "next/image"
import { useRef } from "react"
import styles from './style.module.css'

export default function EditModeButton() {
    const [editMode, setEditMode] = useAtom($editMode)
    const [allResults, setAllResults] = useAtom($allResults)
    const realResults = useRef([])
    const setTempResults = useSetAtom($tempResults)

    const toggleEditMode = () => {
        if (!editMode) {
            const newResults = structuredClone(allResults)
            setTempResults(newResults)
            realResults.current = newResults
        } else {
            setAllResults(realResults.current)
            setTempResults([])
            realResults.current = []
        }
        setEditMode(prev => !prev)
    }

    return (
        <button className={styles.btn} onClick={toggleEditMode}>
            {!editMode && (
                <Image src="/images/edit.svg" width={12} height={12} alt="Edit" />
            )}
            {editMode && (
                <>
                    <Image src="/images/stop.svg" width={14} height={14} alt="Check" className="ignore-dark" />
                    {'Stop '}
                </>
            )}
            Edit Mode
        </button>
    )
}