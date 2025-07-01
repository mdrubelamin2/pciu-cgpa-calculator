'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useAtomValue } from 'jotai'
import { Line } from 'react-chartjs-2'
import { $allResults, $studentInfo } from '@/atoms/global'
import {
  getAverageCGPAandCredits,
  isObjectEmpty,
  roundToTwoDecimal,
} from '@/utils/helpers'
import type { TrimesterResult } from '../../../types'
import styles from './style.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const generateChartData = (allResults: TrimesterResult[]) => {
  const resultData = allResults.filter(
    (result: TrimesterResult) => result.currentGPA > 0
  )

  const data = {
    labels: resultData.map((result: TrimesterResult) => result.trimester),
    datasets: [
      {
        label: 'SGPA ',
        backgroundColor: '#00a3ff',
        borderColor: '#00a3ff',
        data: resultData.map((result: TrimesterResult) =>
          roundToTwoDecimal(result.currentGPA)
        ),
      },
      {
        label: 'CGPA ',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: resultData.map(
          (_, i: number) =>
            getAverageCGPAandCredits(resultData, i).totalAverageCGPA
        ),
      },
    ],
  }

  return data
}

const config = {
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart',
    },
  },
}

export default function CGPAChart() {
  const allResults = useAtomValue($allResults)
  const studentInfo = useAtomValue($studentInfo)
  const chartData = generateChartData(allResults)

  if (isObjectEmpty(studentInfo)) return null

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartBox}>
        <Line options={config} data={chartData} />
      </div>
    </div>
  )
}
