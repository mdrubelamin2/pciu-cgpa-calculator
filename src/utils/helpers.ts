import Toastify from 'toastify-js'
import type { Course, TrimesterResult } from '../../types'

export const isObjectEmpty = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') return true
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export const isJCOFString = (str: string): boolean =>
  typeof str === 'string' && /^[^;]*;[^;]*;/.test(str)

export const trimStr = (str: string): string =>
  str.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then(res => res.json())
    .catch(() => null)

export const fetcherText = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then(res => res.text())
    .catch(() => '')

export const roundToTwoDecimal = (
  num: number,
  onlyFirstTwoDecimal = false
): number | string =>
  onlyFirstTwoDecimal ? num.toFixed(2) : Math.round(num * 100) / 100

export const getStudentInfo = (studentId: string) =>
  fetcher(`/api/student/${studentId}`)

export const getTrimesterList = () => fetcher(`/api/trimesters`)

export const getTrimesterResult = (studentId: string, trimester: string) =>
  fetcher(`/api/trimester-result/${studentId}/${trimester}`)

export const getOnlineResult = (studentId: string) =>
  fetcher(`/api/online-result/${studentId}`)

export const checkIfImprovement = (course: Course): boolean =>
  course.status === 'Improvement'

export const checkIfIncomplete = (course: Course): boolean =>
  course.status === 'Incomplete' || trimStr(course.LetterGrade) === 'I'

export const checkIfWithdraw = (course: Course): boolean =>
  course.status === 'Withdraw' || trimStr(course.LetterGrade) === 'W'

export const handleResultData = (resultData: Course[]): TrimesterResult => {
  if (!resultData.length) return {} as TrimesterResult
  const trimester = resultData[0].semester || ''
  let totalCreditHrs = 0
  let completedCreditHrs = 0
  resultData.forEach(course => {
    if (checkIfImprovement(course)) return
    if (checkIfIncomplete(course)) return
    if (checkIfWithdraw(course)) return
    totalCreditHrs += course.creditHr
    // check if the gradepoint is greater than 0 to count the completed credithours
    if (course.GradePoint > 0) {
      completedCreditHrs += course.creditHr
    }
  })

  const { GPA } = resultData[0]
  const currentGPA = GPA || 0

  // store the trimester result in local storage in a object
  const trimesterResult: TrimesterResult = {
    trimester,
    year: '', // Will be set by sortByTrimesterAndYear function
    totalCreditHrs,
    completedCreditHrs,
    currentGPA,
    individuals: resultData,
  }

  return trimesterResult
}

export const generateCurrentGPA = (currentTrimester: TrimesterResult): number =>
  currentTrimester.individuals.reduce(
    (acc: number, curr: Course) => acc + curr.GradePoint * curr.creditHr,
    0
  ) / currentTrimester.completedCreditHrs

export const getAverageCGPAandCredits = (
  resultData: TrimesterResult[],
  toIndex?: number
): { totalCreditHrs: number; totalAverageCGPA: number | string } => {
  let totalCreditHrs = 0
  let totalCGPA = 0
  const allResults =
    toIndex !== undefined ? resultData.slice(0, toIndex + 1) : resultData
  allResults.forEach((trimesterResult: TrimesterResult) => {
    totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
    totalCreditHrs += trimesterResult.completedCreditHrs
  })
  totalCGPA = totalCGPA / totalCreditHrs
  const totalAverageCGPA = Number.isNaN(totalCGPA)
    ? 0
    : roundToTwoDecimal(totalCGPA, true)
  return { totalCreditHrs, totalAverageCGPA }
}

export const showToast = (
  msg = '',
  type: 'success' | 'error' = 'error'
): void => {
  const toastConfig = {
    text: msg,
    gravity: 'bottom' as const,
    style: {
      borderRadius: '8px',
      background: type === 'success' ? '#00a3ff' : '#f44336',
      color: '#fff',
    },
  }
  Toastify(toastConfig).showToast()
}

export const formatStudentId = (studentId: string): string => {
  const decodedStudentId = decodeURIComponent(studentId)
  let formattedStudentId = decodedStudentId.replace(/[^a-zA-Z0-9]/g, '')
  formattedStudentId = formattedStudentId.replace(
    /([\w]{3})(\d{3})(\d{5})/,
    '$1 $2 $3'
  )
  formattedStudentId = formattedStudentId.replace(/(\w{3})/, (_, p1) =>
    p1.toUpperCase()
  )
  return formattedStudentId
}

export const copyToClipboard = (textToCopy: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Method 1: Use Clipboard API if available and in secure context
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => resolve(undefined))
        .catch(err => {
          console.warn('Clipboard API failed:', err)
          // Fall back to method 2
          tryExecCommand()
        })
      return
    }

    // Method 2: Use document.execCommand
    tryExecCommand()

    function tryExecCommand() {
      try {
        const input = document.createElement('textarea') // Use textarea for multi-line support
        input.value = textToCopy
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.top = '0'
        input.style.left = '0'
        input.style.opacity = '0'
        document.body.appendChild(input)

        // For iOS devices
        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
          const textareaElement = input as HTMLTextAreaElement & {
            contentEditable: string
          }
          textareaElement.contentEditable = 'true'
          input.readOnly = false
          const range = document.createRange()
          range.selectNodeContents(input)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
          input.setSelectionRange(0, 999999)
        } else {
          input.select()
        }

        const success = document.execCommand('copy')
        document.body.removeChild(input)

        if (success) {
          resolve(undefined)
        } else {
          console.warn('execCommand failed')
          reject(new Error('Copy command failed'))
        }
      } catch (err) {
        console.error('Copy failed:', err)
        reject(err)
      }
    }
  })
}

export function sortByTrimesterAndYear(
  results: TrimesterResult[]
): TrimesterResult[] {
  const trimesterOrder: Record<string, number> = {
    spring: 1,
    summer: 2,
    fall: 3,
  }
  return [...results].sort((a, b) => {
    if (!a.trimester || !b.trimester) return 0
    const [aTrim, aYear] = a.trimester.split(' ')
    const [bTrim, bYear] = b.trimester.split(' ')
    const yearA = parseInt(aYear, 10) || 0
    const yearB = parseInt(bYear, 10) || 0
    if (yearA !== yearB) return yearA - yearB
    return (
      (trimesterOrder[aTrim?.toLowerCase()] || 0) -
      (trimesterOrder[bTrim?.toLowerCase()] || 0)
    )
  })
}
