import Toastify from 'toastify-js'

export const isObjectEmpty = obj =>
  obj && Object.keys(obj).length === 0 && obj.constructor === Object

export const trimStr = str => str.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()

export const fetcher = (...args) =>
  fetch(...args)
    .then(res => res.json())
    .catch()

export const fetcherText = (...args) =>
  fetch(...args)
    .then(res => res.text())
    .catch()

export const roundToTwoDecimal = (num, onlyFirstTwoDecimal = false) =>
  onlyFirstTwoDecimal ? num.toFixed(2) : Math.round(num * 100) / 100

export const getStudentInfo = studentId => fetcher(`/api/student/${studentId}`)

export const getTrimesterList = () => fetcher(`/api/trimesters`)

export const getTrimesterResult = (studentId, trimester) =>
  fetcher(`/api/trimester-result/${studentId}/${trimester}`)

export const getOnlineResult = studentId =>
  fetcher(`/api/online-result/${studentId}`)

export const checkIfImprovement = course => course.status === 'Improvement'

export const checkIfIncomplete = course =>
  course.status === 'Incomplete' || trimStr(course.LetterGrade) === 'I'

export const checkIfWithdraw = course =>
  course.status === 'Withdraw' || trimStr(course.LetterGrade) === 'W'

export const handleResultData = resultData => {
  if (!resultData.length) return {}
  const trimester = resultData[0].semester
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
  const trimesterResult = {
    trimester,
    totalCreditHrs,
    completedCreditHrs,
    currentGPA,
    individuals: resultData,
  }

  return trimesterResult
}

export const generateCurrentGPA = currentTrimester =>
  currentTrimester.individuals.reduce(
    (acc, curr) => acc + curr.GradePoint * curr.creditHr,
    0
  ) / currentTrimester.completedCreditHrs

export const getAverageCGPAandCredits = (resultData, toIndex) => {
  let totalCreditHrs = 0
  let totalCGPA = 0
  const allResults =
    toIndex !== undefined ? resultData.slice(0, toIndex + 1) : resultData
  allResults.forEach(trimesterResult => {
    totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
    totalCreditHrs += trimesterResult.completedCreditHrs
  })
  totalCGPA = totalCGPA / totalCreditHrs
  let totalAverageCGPA = Number.isNaN(totalCGPA)
    ? 0
    : roundToTwoDecimal(totalCGPA, true)
  return { totalCreditHrs, totalAverageCGPA }
}

export const showToast = (msg = '', type = 'error') => {
  const toastConfig = {
    text: msg,
    gravity: 'bottom',
    style: {
      borderRadius: '8px',
    },
  }
  if (type === 'success') {
    toastConfig.style.background = '#00a3ff'
    toastConfig.style.color = '#fff'
  } else if (type === 'error') {
    toastConfig.style.background = '#f44336'
    toastConfig.style.color = '#fff'
  }
  Toastify(toastConfig).showToast()
}

export const formatStudentId = studentId => {
  const decodedStudentId = decodeURIComponent(studentId)
  let formattedStudentId = decodedStudentId.replace(/[^a-zA-Z0-9]/g, '')
  formattedStudentId = formattedStudentId.replace(
    /([\w]{3})(\d{3})(\d{5})/,
    '$1 $2 $3'
  )
  formattedStudentId = formattedStudentId.replace(/(\w{3})/, (match, p1) =>
    p1.toUpperCase()
  )
  return formattedStudentId
}

export const copyToClipboard = textToCopy => {
  return new Promise((resolve, reject) => {
    // Method 1: Use Clipboard API if available and in secure context
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => resolve())
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
          input.contentEditable = true
          input.readOnly = false
          const range = document.createRange()
          range.selectNodeContents(input)
          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          input.setSelectionRange(0, 999999)
        } else {
          input.select()
        }

        const success = document.execCommand('copy')
        document.body.removeChild(input)

        if (success) {
          resolve()
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

export function sortByTrimesterAndYear(results) {
  const trimesterOrder = { spring: 1, summer: 2, fall: 3 }
  return [...results].sort((a, b) => {
    if (!a.trimester || !b.trimester) return 0
    const [aTrim, aYear] = a.trimester.split(' ')
    const [bTrim, bYear] = b.trimester.split(' ')
    const yearA = parseInt(aYear, 10) || 0
    const yearB = parseInt(bYear, 10) || 0
    if (yearA !== yearB) return yearA - yearB
    return (
      (trimesterOrder[aTrim.toLowerCase()] || 0) -
      (trimesterOrder[bTrim.toLowerCase()] || 0)
    )
  })
}
