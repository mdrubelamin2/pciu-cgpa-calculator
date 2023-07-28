import { addEvent, appendChild, createElm, fetchApi, getAverageCGPAandCredits, roundToTwoDecimal, select, setAttr, setClass, setInnerHTML, setLoadingBtn, setTextContent, showToast } from "./helpers.js"
import { lineChart, updateChart } from "./chart.js"
import { perTrimResults } from "./modal.js"

// initially declare variables
let studentId
let studentInfo
let allTrimestersList = []
let trimesterResultsArray = []
const idInputElm = select('.id-input')
const formElm = select('.form-container')
const chartElm = select('.my-chart')

// do the initial tasks when the window loading is complete
addEvent(window, 'load', () => {
  // creates input mask for the id input by maska.js
  Maska.create(idInputElm, { mask: 'AAA ### #####' })
  // new MaskInput(idInputElm, {
  //   mask: '@@@ ### #####', tokens: {
  //     '@': { pattern: /[A-Z]/, transform: (char) => char.toUpperCase() }
  //   }
  // })
  addEvent(formElm, 'submit', formSubEvent)
  lineChart()
  setLoadingBtn(false)
})

const formSubEvent = async (e) => {
  e.preventDefault()
  const idInpElm = select('.id-input')
  studentId = idInpElm.value

  const TOTAL_ID_LENGTH = 13 // ### ### ##### ex: CSE 019 06859

  if (studentId.length < TOTAL_ID_LENGTH) {
    showToast('Please check if the Student ID is valid')
    return
  }

  setLoadingBtn(true)
  await getStudentInfo()
  if (studentInfo === null) return
  if (studentInfo === 'not-found') {
    showToast('Student ID not found in the PCIU database')
    setLoadingBtn(false)
    return
  }
  setClass(chartElm, 'show')
  resetOldSearchResult()
  removeBeforeSearchClasses()
  setValueToIdInputElm()
  renderStudentInfo()
  await getAllTrimesterList()
  await getAndRenderAllTrimesterResults()
  await getAndRenderOnlineTrimesterResult()
  setLoadingBtn(false)
}

const getStudentInfo = async () => {
  // Get the student's info
  const url = `/get-student-info/${studentId}`
  const data = await fetchApi(url)
  if (!data) studentInfo = null
  else studentInfo = Array.isArray(data) && data.length > 0 ? data[0] : 'not-found'
}

const removeBeforeSearchClasses = () => {
  const mainContainer = select('.main-container')
  setClass(mainContainer, 'before-search', 1)
  setClass(document.body, 'before-search', 1)
}

const setValueToIdInputElm = () => {
  idInputElm.value = studentId
}

const renderStudentInfo = () => {
  const studentIdElm = select('.student-id')
  const studentNameElm = select('.student-name')
  const studentProgramElm = select('.student-program')
  const studentSessionElm = select('.student-session')
  const studentBatchElm = select('.student-batch')
  const studentShiftElm = select('.student-shift')

  const { studentIdNo, StudentName, studentProgram, studentSession, studentBatch, Shift } = studentInfo

  setTextContent(studentIdElm, studentIdNo)
  setTextContent(studentNameElm, StudentName)
  setTextContent(studentProgramElm, studentProgram)
  setTextContent(studentSessionElm, studentSession)
  setTextContent(studentBatchElm, studentBatch)
  setTextContent(studentShiftElm, Shift)
}

const addResultTrToResultTable = trimesterResult => {
  const resultsTable = select('.table tbody')

  const tr = createElm('tr')
  const tdTrimester = createElm('td')
  const tdTotalCredit = createElm('td')
  const tdGPA = createElm('td')
  const tdDetails = createElm('td')
  const detailsBtn = createElm('button')
  const detailsBtnText = createElm('span')
  const infoImg = createElm('img')
  const btnChildsWrp = createElm('div')
  appendChild(btnChildsWrp, infoImg)
  appendChild(btnChildsWrp, detailsBtnText)
  appendChild(detailsBtn, btnChildsWrp)
  appendChild(tdDetails, detailsBtn)
  setTextContent(detailsBtnText, 'Details')

  const { trimester, totalCreditHrs, currentGPA } = trimesterResult

  setTextContent(tdTrimester, trimester)
  setTextContent(tdTotalCredit, totalCreditHrs)
  setAttr(detailsBtn, 'class', 'details-btn')
  setAttr(infoImg, 'src', './images/info.svg')
  setAttr(infoImg, 'class', 'info-img')
  addEvent(detailsBtn, 'click', () => {
    const trimResult = trimesterResultsArray.find(result => result.trimester === trimester)
    if (!trimResult) return
    perTrimResults(trimResult)
  })
  const GPAText = currentGPA ? roundToTwoDecimal(currentGPA, true) : '0.00'
  setTextContent(tdGPA, GPAText)

  appendChild(tr, tdTrimester)
  appendChild(tr, tdTotalCredit)
  appendChild(tr, tdGPA)
  appendChild(tr, tdDetails)

  // add the tr to the table as first tr
  resultsTable.insertBefore(tr, resultsTable.firstChild)
}

const calculateTotalCreditHrsAndGPA = () => {
  const totalCreditHrsElm = select('.total-credit-hrs')
  const totalGPAElm = select('.total-cgpa')
  const { totalCreditHrs, totalAverageCGPA } = getAverageCGPAandCredits(trimesterResultsArray)
  setTextContent(totalCreditHrsElm, totalCreditHrs)
  setTextContent(totalGPAElm, totalAverageCGPA)
}

const formatSingleTrimesterResult = resultData => {
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

const getAllTrimesterList = async () => {
  if (allTrimestersList.length > 0) return
  // get all trimester list
  const url = `/get-all-trimester-list`
  allTrimestersList = await fetchApi(url)
}

const getAndRenderAllTrimesterResults = async () => {
  const trimestersToFetch = allTrimestersList.slice(allTrimestersList.indexOf(studentInfo.studentSession))
  for (let i = 0; i < trimestersToFetch.length; i++) {
    const trimester = trimestersToFetch[i]
    const url = `/get-trimester-result/${studentId}/${trimester}`
    const data = await fetchApi(url)
    if (!data) return
    handleResultData(data)
  }
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
    updateChart(trimesterResultsArray)
  }
}

const getAndRenderOnlineTrimesterResult = async () => {
  const url = `/get-online-result/${studentId}`
  const resp = await fetch(url)
  const data = await resp.json()
  if (!data?.length) return
  // find the trimester result in the all results array
  const findTrimesterResult = trimesterResultsArray.find(trimesterResult => trimesterResult.trimester === data[0].semester)
  if (findTrimesterResult) return

  handleResultData(data)
}

const resetOldSearchResult = () => {
  trimesterResultsArray = []
  const resultsTable = select('.table tbody')
  setInnerHTML(resultsTable, '')
  calculateTotalCreditHrsAndGPA()
  updateChart([])
}

// my code complete - rubel
