'use client'

import { $allResults } from "@/atoms/global"
import { getAverageCGPAandCredits, roundToTwoDecimal } from "@/utils/helpers"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { Chart } from "react-charts"
import styles from './style.module.css'

const generateChartData = allResults => {
    const allResultData = [...allResults].reverse()
    const resultData = allResultData.filter(result => result.currentGPA > 0)
    const data = [
        {
            label: "CGPA",
            data: resultData.map((_, i) => ({
                primary: resultData[i].trimester,
                secondary: Number(getAverageCGPAandCredits(resultData, i).totalAverageCGPA),
            })),
        },
        {
            label: "SGPA",
            data: resultData.map((result) => ({
                primary: result.trimester,
                secondary: roundToTwoDecimal(result.currentGPA),
            })),
        }
    ]

    return data
}

export default function CGPAChart() {
    const allResults = useAtomValue($allResults)

    const data = useMemo(
        () => generateChartData(allResults),
        [allResults]
    )

    const primaryAxis = useMemo(
        () => ({
            getValue: (datum) => datum.primary,
        }),
        []
    )

    const secondaryAxes = useMemo(
        () => [
            {
                getValue: (datum) => datum.secondary,
                elementType: 'line',
            },
        ],
        []
    )

    const isDataExists = data[0].data.length > 0 && data[1].data.length > 0

    if (!isDataExists) return null

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartBox}>
                <Chart
                    options={{
                        data,
                        primaryAxis,
                        secondaryAxes,
                    }}
                />
            </div>
        </div>
    )
}
