const select = selector => document.querySelector(selector)

const addEvent = (elm, eventType, cb) => {
    elm.addEventListener(eventType, cb)
}

const idInputElm = select('.id-input')
Maska.create(idInputElm, { mask: 'AAA ### #####' })

const searchBtnElm = select('.search-btn')
const formElms = select('.form-container')

let studentId
let studentInfo
let trimesterResultsArray = []

const getStudentInfo = async () => {
  // Get the student's info
  const url = `/get-student-info/${studentId}`
  const response = await fetch(url)
  const data = await response.json()

  if (data.length > 0) {
    studentInfo = data[0]
  } else {
    studentInfo = null
  }

  Promise.resolve(true)
}

const unhideMainContainer = () => {
  const mainContainer = select('.main-container')
  mainContainer.classList.remove('before-search')
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
  tdGPA.textContent = trimesterResult.currentGPA
  tr.appendChild(tdTrimester)
  tr.appendChild(tdTotalCredit)
  tr.appendChild(tdGPA)
  // add the tr to the table as first tr
  resultsTable.insertBefore(tr, resultsTable.firstChild)
}

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
  const totalAverageCGPA = Math.round(totalCGPA * 100) / 100
  totalCreditHrsElm.textContent = totalCreditHrs
  totalGPAElm.textContent = isNaN(totalAverageCGPA) ? 'N/A' : totalAverageCGPA
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

  const currentGPA = Math.round(resultData[0].GPA * 100) / 100

  // store the trimester result in local storage in a object
  const trimesterResult = {
    trimester,
    totalCreditHrs,
    completedCreditHrs,
    currentGPA
  }

  return trimesterResult
}

const getAndRenderAllTrimesterResults = async () => {
  const allTrimesters = ['Spring 2014', 'Summer 2014', 'Fall 2014', 'Spring 2015', 'Summer 2015', 'Fall 2015', 'Spring 2016', 'Summer 2016', 'Fall 2016', 'Spring 2017', 'Summer 2017', 'Fall 2017', 'Spring 2018', 'Summer 2018', 'Fall 2018', 'Spring 2019', 'Summer 2019', 'Fall 2019', 'Spring 2020', 'Summer 2020', 'Fall 2020', 'Spring 2021', 'Summer 2021', 'Fall 2021', 'Spring 2022']
  const trimestersToFetch = allTrimesters.slice(allTrimesters.indexOf(studentInfo.studentSession))
  for (let i = 0; i < trimestersToFetch.length; i++) {
    const trimester = trimestersToFetch[i]

    const url = `/get-trimester-result/${studentId}/${trimester}`
    const resp = await fetch(url)
    const data = await resp.json()

    handleResultData(data)
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
  const url = `/get-online-result/${studentId}`
  const resp = await fetch(url)
  const data = await resp.json()

  handleResultData(data)
}

const resetOldSearchResult = () => {
  trimesterResultsArray = []
  const resultsTable = select('.table tbody')
  resultsTable.innerHTML = ''
  calculateTotalCreditHrsAndGPA()
}

setLoadingBtn = status => {
  if(status) {
     searchBtnElm.classList.add('loading')
     searchBtnElm.disabled = true
  } else {
    searchBtnElm.classList.remove('loading')
    searchBtnElm.disabled = false
  }
}

const formSubEvent = async (e) => {
  console.log('submit');
  e.preventDefault()
  const idInpElm = select('.id-input')
  studentId = idInpElm.value

  if (!studentId) return

  setLoadingBtn(true)

  await getStudentInfo()
  console.log('studentInfo', studentInfo)
  if (!studentInfo) return setLoadingBtn(false)
  resetOldSearchResult()
  unhideMainContainer()
  setValueToIdInputElm()
  renderStudentInfo()
  await getAndRenderAllTrimesterResults()
  await getAndRenderOnlineTrimesterResult()
  setLoadingBtn(false)
}
console.log(formElms);
addEvent(formElms, 'submit', formSubEvent)