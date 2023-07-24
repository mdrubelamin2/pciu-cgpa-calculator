const select = selector => document.querySelector(selector)

const addEvent = (elm, eventType, cb) => { elm.addEventListener(eventType, cb) }

const setInnerHTML = (elm, html) => { elm.innerHTML = html }

const setTextContent = (elm, text) => { elm.textContent = text }

const createElm = elmType => document.createElement(elmType)

const appendChild = (parent, child) => { parent.appendChild(child) }

const setAttr = (elm, attr, value) => { elm.setAttribute(attr, value) }

const setClass = (elm, className, remove = 0) => {
  if (remove) {
    elm.classList.remove(className)
  } else {
    elm.classList.add(className)
  }
}

// creates input mask for the id input by maska.js
const idInputElm = select('.id-input')
Maska.create(idInputElm, { mask: 'AAA ### #####' })

// enable the search button when the window loading is complete
addEvent(window, 'load', () => {
  setLoadingBtn(false)
  lineChart()
})

const chartElm = select('.my-chart')

const formSubEvent = async (e) => {
  e.preventDefault()
  const idInpElm = select('.id-input')
  studentId = idInpElm.value

  if (!studentId) return

  setLoadingBtn(true)

  await getStudentInfo()
  if (!studentInfo) return setLoadingBtn(false)
  setClass(chartElm, 'show')
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
  const url = `/get-student-info/${studentId}`
  const response = await fetch(url)
  const data = await response.json()
  studentInfo = data.length > 0 ? data[0] : null
  Promise.resolve(true)
}

const removeBeforeSearchClasses = () => {
  const mainContainer = select('.main-container')
  setClass(mainContainer, 'before-search', 1)
  setClass(document.body, 'before-search', 1)
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
  const tdGPAWrp = createElm('div')
  const tdGPAText = document.createElement('span')
  const infoImg = createElm('img')

  const { trimester, totalCreditHrs, currentGPA } = trimesterResult

  setTextContent(tdTrimester, trimester)
  setTextContent(tdTotalCredit, totalCreditHrs)
  setAttr(tdGPAWrp, 'class', 'td-wrp')
  setAttr(infoImg, 'src', './images/info.svg')
  setAttr(infoImg, 'class', 'info-img')
  addEvent(infoImg, 'click', () => perTrimResults(trimester))
  const GPAText = currentGPA ? roundToTwoDecimal(currentGPA, true) : 'Incomplete'
  setTextContent(tdGPAText, GPAText)
  appendChild(tdGPAWrp, tdGPAText)
  appendChild(tdGPAWrp, infoImg)
  appendChild(tdGPA, tdGPAWrp)
  appendChild(tr, tdTrimester)
  appendChild(tr, tdTotalCredit)
  appendChild(tr, tdGPA)

  // add the tr to the table as first tr
  resultsTable.insertBefore(tr, resultsTable.firstChild)
}

const roundToTwoDecimal = (num, trailingZero = false) => trailingZero ? num.toFixed(2) : (Math.round(num * 100) / 100)

const getAverageCGPAandCredits = (resultData, toIndex) => {
  let totalCreditHrs = 0
  let totalCGPA = 0
  const allResults = toIndex !== undefined ? resultData.slice(0, toIndex + 1) : resultData
  allResults.forEach(trimesterResult => {
    totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
    totalCreditHrs += trimesterResult.completedCreditHrs
  })
  totalCGPA = totalCGPA / totalCreditHrs
  let totalAverageCGPA = roundToTwoDecimal(totalCGPA, true)
  totalAverageCGPA = isNaN(totalAverageCGPA) ? 0 : totalAverageCGPA
  return { totalCreditHrs, totalAverageCGPA }
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
  // count all creditHrs, skip the credit if GradePoint is greater than 0
  let totalCreditHrs = 0
  let completedCreditHrs = 0
  resultData.forEach(course => {
    if (course.status === 'Improvement') return
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
    currentGPA,
    individuals: resultData
  }

  return trimesterResult
}

const getAllTrimesterList = async () => {
  if (allTrimestersList.length > 0) Promise.resolve(true)
  try {
    // get all trimester list
    const url = `/get-all-trimester-list`
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
      const url = `/get-trimester-result/${studentId}/${trimester}`
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
    updateChart()
  }
}

const getAndRenderOnlineTrimesterResult = async () => {
  try {
    const url = `/get-online-result/${studentId}`
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
  setInnerHTML(resultsTable, '')
  calculateTotalCreditHrsAndGPA()
  updateChart()
}

const setLoadingBtn = status => {
  const searchBtnElm = select('.search-btn')
  if (status) {
    setClass(searchBtnElm, 'loading')
    setAttr(searchBtnElm, 'disabled', true)
  } else {
    setClass(searchBtnElm, 'loading', 1)
    searchBtnElm.removeAttribute('disabled')
  }
}

// my code complete - rubel

// modal code start - rahat

const modal = select(".modal")
const modalTitleElm = select(".title")
const closeBtn = select("#closeBtn")

const setModal = status => {
  if (status) setClass(modal, 'show')
  else setClass(modal, 'show', 1)
}

addEvent(modal, 'click', event => {
  const isInsideModal = event.target.closest('.modal-container');
  if (isInsideModal === null) closeBtn.click()
})

addEvent(closeBtn, 'click', () => setModal(false))

const convertGradeToClassName = letter => {
  const grade = letter.trim().toLowerCase()
  const [_, stat] = grade

  if (grade === '-') return 'i'
  if (!stat) return grade
  if (stat == "+") return grade.replace(stat, "-plus")
  if (stat == "-") return grade.replace(stat, "-minus")
}

const perTrimResults = (trimester) => {
  const modalContent = select(".modal-content")
  setInnerHTML(modalContent, '')
  setTextContent(modalTitleElm, `${trimester} Trimester Result`)

  const trimResult = trimesterResultsArray.find(result => result.trimester === trimester)

  if (!trimResult) return

  const { individuals } = trimResult

  const modalResultHtml = individuals.map((item, i) => `<div class="grid-container">
<div class="grid-item item-no-one">
  <div class="center">
    <span class="serialNo">${i + 1}</span>
  </div>
</div>
<div class="grid-item item-no-two">
  <div class="courseName">${item.courseTitle} <span class="courseCode">${item.courseCode
    }</span>
  </div>
</div>
<div class="grid-item item-no-three">
  <div class="leftBox">
    <span>  <img class="svg" src="./images/grade.svg" alt=""> </span>
    <span class="grade">Grade :</span>
    <span class="gradePoint">${item.GradePoint}</span>
    <span class="cgpaLetter ${convertGradeToClassName(item.LetterGrade)}">${item.LetterGrade}</span>
  </div>
  <div class="middleBox">
    <span> <img  class="svg" src="./images/type.svg" alt=""> </span> 
    <span class="type">Type :</span>
    <span class="typeStatus">${item.status}</span>
  </div>
  <div class="rightBox">
  <span>   <img  class="svg" src="./images/credit.svg" alt=""> </span>
    <span class="credit">Credit :</span>
    <span class="subCreditPoint">${item.creditHr}</span>
  </div>
</div>
</div>`
  ).join('')

  setInnerHTML(modalContent, modalResultHtml);
  setModal(true);
};

// line chart - rahad

let resultChart

const updateChart = () => {
  const resultData = [...trimesterResultsArray].reverse()
  const trimesterTitles = resultData.map(result => result.trimester)
  const gpaValues = resultData.map(result => result.currentGPA)
  const cgpaValues = resultData.map((_, i) => getAverageCGPAandCredits(resultData, i).totalAverageCGPA)
  resultChart.data.labels = trimesterTitles
  resultChart.data.datasets[0].data = gpaValues
  resultChart.data.datasets[1].data = cgpaValues
  resultChart.update()
}

const lineChart = () => {
  const data = {
    labels: [],
    datasets: [
      {
        label: 'SGPA ',
        backgroundColor: '#00a3ff',
        borderColor: '#00a3ff',
        data: [],
      },
      {
        label: 'CGPA ',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
      },
    ]
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      // ... other options ...
      plugins: {
        tooltip: {
          mode: 'interpolate',
          intersect: false
        },
        crosshair: {
          line: {
            color: '#F66',  // crosshair line color
            width: 1// crosshair line width
          },
          sync: {
            enabled: true,            // enable trace line syncing with other charts
            group: 1,                 // chart group
            suppressTooltips: false   // suppress tooltips when showing a synced tracer
          },
          zoom: {
            enabled: true,                                      // enable zooming
            zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
            zoomboxBorderColor: '#48F',                         // border color of zoom box
            zoomButtonText: 'Reset Zoom',                       // reset zoom button text
            zoomButtonClass: 'reset-zoom',                      // reset zoom button class
          },
          callbacks: {
            beforeZoom: () => function (start, end) {                  // called before zoom, return false to prevent zoom
              return true;
            },
            afterZoom: () => function (start, end) {                   // called after zoom
            }
          }
        }
      }
    }
  };

  resultChart = new Chart(
    select('#myChart'),
    config
  )
}

