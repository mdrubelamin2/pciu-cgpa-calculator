const formElm = document.querySelector('form')
const idInputElm = document.getElementById('id-input')
const submitElm = document.getElementById('submit')
const resultsElm = document.getElementById('results')
const totalCGPAElm = document.getElementById('total-cgpa')
const studentInfoElm = document.getElementById('student-info')

const allTrimesters = ['Spring 2014', 'Summer 2014', 'Fall 2014', 'Spring 2015', 'Summer 2015', 'Fall 2015', 'Spring 2016', 'Summer 2016', 'Fall 2016', 'Spring 2017', 'Summer 2017', 'Fall 2017', 'Spring 2018', 'Summer 2018', 'Fall 2018', 'Spring 2019', 'Summer 2019', 'Fall 2019', 'Spring 2020', 'Summer 2020', 'Fall 2020', 'Spring 2021', 'Summer 2021', 'Fall 2021', 'Spring 2022', 'Summer 2022', 'Fall 2022']

formElm.addEventListener('submit', (e) => {
  e.preventDefault()
  const id = idInputElm.value

  if (id) {
    // Clear the results
    resultsElm.innerHTML = ''
    totalCGPAElm.innerHTML = ''

    // Get the student's info
    const url = `http://119.18.149.45/StudentAPI/api/studentinfo/get?studentIdNo=${id}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        const studentInfo = data[0]
        const studentName = studentInfo.StudentName || 'No name found'
        const studentProgram = studentInfo.StudentProgram || 'No program found'
        const studentSession = studentInfo.StudentSession || 'No session found'
        const studentBatch = studentInfo.studentBatch || 'No batch found'
        const studentIdNo = studentInfo.studentIdNo || 'No id found'
        const campus = studentInfo.Campus || 'No campus found'
        const shift = studentInfo.Shift || 'No shift found'
        const crHr = studentInfo.CrHr || 'No crHr found'

        studentInfoElm.innerHTML = `
          <p>Student Name: ${studentName}</p> 
          <p>Student Program: ${studentProgram}</p>
          <p>Student Session: ${studentSession}</p>
          <p>Student Batch: ${studentBatch}</p>
          <p>Student Id No: ${studentIdNo}</p>
          <p>Campus: ${campus}</p>
          <p>Shift: ${shift}</p>
          <p>CrHr: ${crHr}</p>
        `
      })

    // set the th for trimester name, total credits, and cgpa
    const trimesterHeaders = document.createElement('tr')
    trimesterHeaders.innerHTML = `
      <th>Trimester</th>
      <th>Total Credits</th>
      <th>CGPA</th>
    `
    resultsElm.appendChild(trimesterHeaders)

    // set the fetch-count, total credit & total cgpa to 0 so we can keep track of how many trimesters we have fetched
    localStorage.setItem('fetch-count', 0)
    // empty the trimester-result array
    localStorage.setItem('trimester-result', JSON.stringify([]))

    allTrimesters.forEach((trimester, indx) => {
      // id format - CSE 019 06800
      const url = `http://119.18.149.45/StudentAPI/api/StudentResult/get?studentIdNo=${id}&Trimester=${trimester}`
      fetch(url)
        .then(res => res.json())
        .then(data => {

          // store the count of current fetch in local storage 
          localStorage.setItem('fetch-count', indx + 1)

          if (data.length > 0) {
            console.log(data)
            // count all creditHrs, skip the credit if GradePoint is greater than 0
            let totalCreditHrs = 0
            data.forEach(course => {
              if (course.GradePoint > 0) {
                totalCreditHrs += course.creditHr
              }
            })
            const currentGPA = Math.round(data[0].GPA * 100) / 100

            // store the trimester result in local storage in a object
            const trimesterResult = {
              trimester: trimester,
              totalCreditHrs: totalCreditHrs,
              currentGPA: currentGPA
            }
            // get the trimester-result array from local storage
            const trimesterResultArray = JSON.parse(localStorage.getItem('trimester-result')) || []
            // unshift the trimester result to the array
            trimesterResultArray.unshift(trimesterResult)
            // set the trimester-result array to local storage
            localStorage.setItem('trimester-result', JSON.stringify(trimesterResultArray))
          }
        })
    })
  }

  // wait for all trimesters to be fetched by checking the fetch-count in setInterval
  const interval = setInterval(() => {
    const fetchCount = localStorage.getItem('fetch-count')

    if (fetchCount >= (allTrimesters.length - 1)) {
      // clear the interval
      clearInterval(interval)

      // append a tr in results table to input the creditHrs and CGPA for Spring 2022
      const spring2022Tr = document.createElement('tr')
      const trimesterTd = document.createElement('td')
      trimesterTd.textContent = 'Spring 2022'
      spring2022Tr.appendChild(trimesterTd)
      const totalCreditHrsTd = document.createElement('td')
      totalCreditHrsTd.textContent = 15
      spring2022Tr.appendChild(totalCreditHrsTd)
      const cgpaTd = document.createElement('td')
      const cgpaInput = document.createElement('input')
      cgpaInput.setAttribute('type', 'number')
      cgpaInput.setAttribute('step', '0.01')
      cgpaInput.setAttribute('min', '0')
      cgpaInput.setAttribute('max', '4')
      cgpaInput.setAttribute('placeholder', '0.00')
      // dont allow to input more than 4 in the input
      cgpaInput.addEventListener('input', (e) => {
        if (e.target.value > 4) {
          e.target.value = 4
        }
        // set the value to trimester-result array & unshift a new array for spring 2022 if not exist
        const trimesterResultArray = JSON.parse(localStorage.getItem('trimester-result'))
        const spring2022TrimesterResult = trimesterResultArray.find(trimester => trimester.trimester == 'Spring 2022')
        if (spring2022TrimesterResult) {
          spring2022TrimesterResult.currentGPA = e.target.value
        } else {
          trimesterResultArray.unshift({
            trimester: 'Spring 2022',
            totalCreditHrs: 15,
            currentGPA: e.target.value
          })
        }
        localStorage.setItem('trimester-result', JSON.stringify(trimesterResultArray))

        // calculate the total CGPA & total credit hours
        let totalCGPA = 0
        let totalCreditHrs = 0
        trimesterResultArray.forEach(trimester => {
          totalCGPA += trimester.currentGPA * trimester.totalCreditHrs
          totalCreditHrs += trimester.totalCreditHrs
        }
        )
        // set the total CGPA & total credit hours to the table
        const totalCGPAElm = document.querySelector('#total-cgpa')
        const totalAverageCGPA = Math.round((totalCGPA / totalCreditHrs) * 100) / 100
        totalCGPAElm.textContent = `Total CGPA: ${totalAverageCGPA}`
      })
      cgpaTd.appendChild(cgpaInput)
      spring2022Tr.appendChild(cgpaTd)
      resultsElm.appendChild(spring2022Tr)

      // get the trimester-result array from local storage
      const trimesterResultArray = JSON.parse(localStorage.getItem('trimester-result'))

      // sort the trimester-result array by allTrimesters in descending order
      trimesterResultArray.sort((a, b) => {
        return allTrimesters.indexOf(b.trimester) - allTrimesters.indexOf(a.trimester)
      })

      // show the result in the table
      trimesterResultArray.forEach(trimesterResult => {
        const trimesterElm = document.createElement('tr')
        const trimesterNameElm = document.createElement('td')
        trimesterNameElm.textContent = trimesterResult.trimester
        trimesterElm.appendChild(trimesterNameElm)
        const totalCreditElm = document.createElement('td')
        totalCreditElm.textContent = trimesterResult.totalCreditHrs
        trimesterElm.appendChild(totalCreditElm)
        const gpaElm = document.createElement('td')
        gpaElm.textContent = trimesterResult.currentGPA
        trimesterElm.appendChild(gpaElm)
        resultsElm.appendChild(trimesterElm)
      })

      // calculate the total CGPA = (trimester CGPA * trimester credit hour) / (total credit hour)
      let totalCGPA = 0
      let totalCreditHrs = 0
      trimesterResultArray.forEach(trimesterResult => {
        totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
        totalCreditHrs += trimesterResult.totalCreditHrs
      })
      totalCGPA = totalCGPA / totalCreditHrs
      totalCGPA = Math.round(totalCGPA * 100) / 100
      const totalCGPAElm = document.createElement('tr')
      const totalCGPANameElm = document.createElement('td')
      totalCGPANameElm.textContent = 'Total CGPA'
      totalCGPAElm.appendChild(totalCGPANameElm)
      const totalCreditElm = document.createElement('td')
      totalCreditElm.textContent = totalCreditHrs
      totalCGPAElm.appendChild(totalCreditElm)
      const totalGPAElm = document.createElement('td')
      totalGPAElm.textContent = totalCGPA
      totalCGPAElm.appendChild(totalGPAElm)
      resultsElm.appendChild(totalCGPAElm)
    }
  }, 1000)

})

