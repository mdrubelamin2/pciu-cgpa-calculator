import Toastify from 'toastify-js'

export const isObjectEmpty = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;

export const trimStr = (str) => str.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()

export const fetcher = (...args) => fetch(...args).then(res => res.json())

export const fetcherText = (...args) => fetch(...args).then(res => res.text())

export const roundToTwoDecimal = (num, onlyFirstTwoDecimal = false) => onlyFirstTwoDecimal ? num.toFixed(2) : (Math.round(num * 100) / 100)

export const getStudentInfo = studentId => fetcher(`/api/student/${studentId}`)

export const getTrimesterList = () => fetcher(`/api/trimesters`);

export const getTrimesterResult = (studentId, trimester) => fetcher(`/api/trimester-result/${studentId}/${trimester}`)

export const getOnlineResult = studentId => fetcher(`/api/online-result/${studentId}`)

export const handleResultData = resultData => {
    if (!resultData.length) return {}
    const trimester = resultData[0].semester
    let totalCreditHrs = 0
    let completedCreditHrs = 0
    resultData.forEach(course => {
        if (course.status === 'Improvement') return
        if (course.status === "Incomplete" || course.LetterGrade.trim() === "I") return
        if (course.status === "Withdraw" || course.LetterGrade.trim() === "W") return
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
        individuals: resultData
    }

    return trimesterResult
}

export const getAverageCGPAandCredits = (resultData, toIndex) => {
    let totalCreditHrs = 0
    let totalCGPA = 0
    const allResults = toIndex !== undefined ? resultData.slice(0, toIndex + 1) : resultData
    allResults.forEach(trimesterResult => {
        totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
        totalCreditHrs += trimesterResult.completedCreditHrs
    })
    totalCGPA = totalCGPA / totalCreditHrs
    let totalAverageCGPA = Number.isNaN(totalCGPA) ? 0 : roundToTwoDecimal(totalCGPA, true)
    return { totalCreditHrs, totalAverageCGPA }
}

export const showToast = (msg = '', type = 'error') => {
    const toastConfig = {
        text: msg,
        gravity: 'bottom',
        style: {
            borderRadius: '8px',
        }
    }
    if (type === 'success') {
        toastConfig.style.background = '#00a3ff'
        toastConfig.style.color = '#fff'
    } else if (type === 'error') {
        toastConfig.style.background = '#f44336'
        toastConfig.style.color = '#fff'
    }
    Toastify(toastConfig).showToast();
}