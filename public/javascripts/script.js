const select = selector => document.querySelector(selector)

const addEvent = (elm, eventType, cb) => {
  elm.addEventListener(eventType, cb)
}

// creates input mask for the id input by maska.js
const idInputElm = select('.id-input')
Maska.create(idInputElm, { mask: 'AAA ### #####' })

// enable the search button when the window loading is complete
window.addEventListener('load', () => {
  setLoadingBtn(false)
})

const formSubEvent = async (e) => {
  e.preventDefault()
  const idInpElm = select('.id-input')
  studentId = idInpElm.value

  if (!studentId) return

  setLoadingBtn(true)

  await getStudentInfo()
  if (!studentInfo) return setLoadingBtn(false)
  resetOldSearchResult()
  removeBeforeSearchClasses()
  setValueToIdInputElm()
  renderStudentInfo()
  await getAndRenderAllTrimesterResults()
  await getAndRenderOnlineTrimesterResult()
  setLoadingBtn(false)
}

const formElm = select('.form-container')
addEvent(formElm, 'submit', formSubEvent)

let studentId
let studentInfo
let allTrimestersList = []
let trimesterResultsArray = []

const getStudentInfo = async () => {
  // Get the student's info
  const url = `/api/get-student-info/${studentId}`
  const response = await fetch(url)
  const data = await response.json()
  studentInfo = data.length > 0 ? data[0] : null

  Promise.resolve(true)
}

const removeBeforeSearchClasses = () => {
  const mainContainer = select('.main-container')
  mainContainer.classList.remove('before-search')
  document.body.classList.remove('before-search')
}

const setValueToIdInputElm = () => {
  const idInpElm = select('.id-input')
  idInpElm.value = studentId
}

const renderStudentInfo = () => {
  const studentIdElm = select('.student-id')
  const studentNameElm = select('.student-name')
  const studentProgramElm = select('.student-program')
  const studentSessionElm = select('.student-session')
  const studentBatchElm = select('.student-batch')
  const studentShiftElm = select('.student-shift')

  studentIdElm.innerHTML = studentInfo.studentIdNo
  studentNameElm.innerHTML = studentInfo.StudentName
  studentProgramElm.innerHTML = studentInfo.studentProgram
  studentSessionElm.innerHTML = studentInfo.studentSession
  studentBatchElm.innerHTML = studentInfo.studentBatch
  studentShiftElm.innerHTML = studentInfo.Shift
}

const addResultTrToResultTable = trimesterResult => {
  const resultsTable = select('.table tbody')

  const tr = document.createElement('tr')
  const tdTrimester = document.createElement('td')
  const tdTotalCredit = document.createElement('td')
  const tdGPA = document.createElement('td')
  tdTrimester.textContent = trimesterResult.trimester
  tdTotalCredit.textContent = trimesterResult.totalCreditHrs
  tdGPA.textContent = trimesterResult.currentGPA ? roundToTwoDecimal(trimesterResult.currentGPA, true) : 'Incomplete'
  tr.appendChild(tdTrimester)
  tr.appendChild(tdTotalCredit)
  tr.appendChild(tdGPA)
  // add the tr to the table as first tr
  resultsTable.insertBefore(tr, resultsTable.firstChild)
}

const roundToTwoDecimal = (num, trailingZero = false) => trailingZero ? num.toFixed(2) : (Math.round(num * 100) / 100)

const calculateTotalCreditHrsAndGPA = () => {
  const totalCreditHrsElm = select('.total-credit-hrs')
  const totalGPAElm = select('.total-cgpa')
  let totalCreditHrs = 0
  let totalCGPA = 0
  trimesterResultsArray.forEach(trimesterResult => {
    totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
    totalCreditHrs += trimesterResult.completedCreditHrs
  })
  totalCGPA = totalCGPA / totalCreditHrs
  const totalAverageCGPA = roundToTwoDecimal(totalCGPA, true)
  totalCreditHrsElm.textContent = totalCreditHrs
  totalGPAElm.textContent = isNaN(totalAverageCGPA) ? 0 : totalAverageCGPA
}

const formatSingleTrimesterResult = resultData => {
  const trimester = resultData[0].semester
  // count all creditHrs, skip the credit if GradePoint is greater than 0
  let totalCreditHrs = 0
  let completedCreditHrs = 0
  resultData.forEach(course => {
    // check if the course is not incomplete to count the totalcredithours
    if (course.status !== "Incomplete" && course.LetterGrade.trim() !== "I") {
      totalCreditHrs += course.creditHr
    }
    // check if the gradepoint is greater than 0 to count the completed credithours
    if (course.GradePoint > 0) {
      completedCreditHrs += course.creditHr
    }
  })

  const { GPA } = resultData[0]
  const currentGPA = roundToTwoDecimal(GPA)

  // store the trimester result in local storage in a object
  const trimesterResult = {
    trimester,
    totalCreditHrs,
    completedCreditHrs,
    currentGPA
  }

  return trimesterResult
}

const getAllTrimesterList = async () => {
  if (allTrimestersList.length > 0) Promise.resolve(true)
  try {
    // get all trimester list
    const url = `/api/get-all-trimester-list`
    const response = await fetch(url)
    allTrimestersList = await response.json()
  } catch (_) { console.log('failed to fetch the trimester list') }
  Promise.resolve(true)
}

const getAndRenderAllTrimesterResults = async () => {
  await getAllTrimesterList()
  const trimestersToFetch = allTrimestersList.slice(allTrimestersList.indexOf(studentInfo.studentSession))
  for (let i = 0; i < trimestersToFetch.length; i++) {
    const trimester = trimestersToFetch[i]
    try {
      const url = `/api/get-trimester-result/${studentId}/${trimester}`
      const resp = await fetch(url)
      const data = await resp.json()
      handleResultData(data)
    } catch (_) { console.log(`failed to fetch the result of ${trimester}`) }
  }

  Promise.resolve(true)
}

const handleResultData = data => {
  if (data.length > 0) {
    const trimesterResult = formatSingleTrimesterResult(data)
    // unshift the trimester result to the array
    trimesterResultsArray.unshift(trimesterResult)
    // add a new tr to result table with the trimester result
    addResultTrToResultTable(trimesterResult)
    // calculate the totalGPA
    calculateTotalCreditHrsAndGPA()
  }
}

const getAndRenderOnlineTrimesterResult = async () => {
  try {
    const url = `/api/get-online-result/${studentId}`
    const resp = await fetch(url)
    const data = await resp.json()

    // find the trimester result in the array
    if (data.length === 0) return
    const findTrimesterResult = trimesterResultsArray.find(trimesterResult => trimesterResult.trimester === data[0].semester)
    if (findTrimesterResult) return

    handleResultData(data)
  } catch (_) { console.log('failed to fetch the online result') }
}

const resetOldSearchResult = () => {
  trimesterResultsArray = []
  const resultsTable = select('.table tbody')
  resultsTable.innerHTML = ''
  calculateTotalCreditHrsAndGPA()
}

setLoadingBtn = status => {
  const searchBtnElm = select('.search-btn')
  if (status) {
    searchBtnElm.classList.add('loading')
    searchBtnElm.disabled = true
  } else {
    searchBtnElm.classList.remove('loading')
    searchBtnElm.disabled = false
  }
}