'use client'

import { $allResults } from "@/atoms/global"
import { getAverageCGPAandCredits, roundToTwoDecimal } from "@/utils/helpers"
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import { useAtomValue } from "jotai"
import { Line } from 'react-chartjs-2'
import styles from './style.module.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const generateChartData = allResults => {
    const allResultData = [...allResults].reverse()
    const resultData = allResultData.filter(result => result.currentGPA > 0)

    const data = {
        labels: resultData.map(result => result.trimester),
        datasets: [
            {
                label: 'SGPA ',
                backgroundColor: '#00a3ff',
                borderColor: '#00a3ff',
                data: resultData.map(result => roundToTwoDecimal(result.currentGPA)),
            },
            {
                label: 'CGPA ',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: resultData.map((_, i) => getAverageCGPAandCredits(resultData, i).totalAverageCGPA),
            },
        ]
    };

    return data
}

const config = {
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart',
        },
    },
}

export default function CGPAChart() {
    const allResults = useAtomValue($allResults)
    const chartData = generateChartData(allResults)

    if (!allResults.length) return null

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartBox}>
                <Line options={config} data={chartData} />
            </div>
        </div>
    )
}
