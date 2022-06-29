const express = require('express')
const app = express()
const HTMLParser = require('node-html-parser')
const axios = require('axios')
const FormData = require('form-data')

const trimStr = (str) => {
  return str.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
}

/* GET home page. */
app.get('/api', function (req, res, next) {
  res.end(`Hello from Md Rubel Amin`);
});

app.get('/get-all-trimester-list', async (req, res, next) => {
  const url = 'http://119.18.149.45/PCIUStudentPortal/Student/TrimesterResult'
  const response = await axios.get(url)
  const data = response.data
  const root = HTMLParser.parse(data)
  const trimesters = root.querySelectorAll('#semester option')
  const trimestersList = []
  trimesters.forEach(trimester => {
    const optValue = trimStr(trimester.rawAttrs.split('value=')[1].split('"')[1])
    if (!optValue) return
    trimestersList.unshift(optValue)
  })

  res.json(trimestersList)
})

app.get('/get-online-result/:studentId', async function (req, res, next) {
  const { studentId } = req.params
  const url = 'http://119.18.149.45/PCIUOnlineResult'
  const resp = await axios.get(url)
  const respData = resp.data
  const root = HTMLParser.parse(respData);

  // get the cookies from the fetch response
  const cookies = resp.headers['set-cookie'][0]
  const cookie = cookies.split(';')[0]

  const requestVerificationToken = root.querySelector('form').firstChild.getAttribute('value')
  const semester = root.querySelector('#Semester').rawAttributes.Value

  if (!(requestVerificationToken && semester)) return res.json([])

  const formData = new FormData();
  formData.append('__RequestVerificationToken', requestVerificationToken);
  formData.append('StudentIdNo', studentId);
  formData.append('Semester', semester);

  const config = {
    url,
    method: 'POST',
    headers: {
      'Cookie': cookie,
      ...formData.getHeaders()
    },
    data: formData
  }

  const resultResp = await axios(config)
  const resultData = resultResp.data
  const bodyHTML = resultData.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
  const parsedResHTML = HTMLParser.parse(bodyHTML)
  const cgpaTd = parsedResHTML.querySelector('.table:first-child tr:last-child td:last-child')

  if (!cgpaTd) return res.json([])

  const cgpaTxt = cgpaTd.text
  const GPA = parseFloat(cgpaTxt)

  const allTrFromSecondTbodyExceptFirstRow = parsedResHTML.querySelectorAll('.table:nth-child(2) tr:not(:first-child)')
  const results = []
  allTrFromSecondTbodyExceptFirstRow.forEach(tr => {
    // filter the tr childnodes that are only html elements and node type 1
    const tds = tr.childNodes.filter(node => node.nodeType === 1)
    // tds index = 1 - course code, 2 - course name, 3 - status, 5 - credit hr, 6 - letter grade, 7 - grade point
    const courseCode = trimStr(tds[1].text)
    const courseTitle = trimStr(tds[2].text)
    const status = trimStr(tds[3].text)
    const creditHrTxt = trimStr(tds[5].text)
    const LetterGrade = trimStr(tds[6].text)
    const gradePointTxt = trimStr(tds[7].text)
    const creditHr = parseFloat(creditHrTxt)
    const GradePoint = parseFloat(gradePointTxt)
    results.push({ semester, courseCode, courseTitle, status, creditHr, GradePoint, LetterGrade, GPA })
  })
  res.json(results)
})

app.get('/get-student-info/:studentId', async function (req, res, next) {
  const { studentId } = req.params
  // fetch the student info
  const url = `http://119.18.149.45/StudentAPI/api/studentinfo/get?studentIdNo=${studentId}`
  const studentInfoJson = await axios.get(url)
  const studentInfo = studentInfoJson.data

  // return the student info
  res.json(studentInfo)
})

app.get('/get-trimester-result/:studentId/:trimester', async function (req, res, next) {
  const { studentId, trimester } = req.params
  // fetch the trimester result
  const url = `http://119.18.149.45/StudentAPI/api/StudentResult/get?studentIdNo=${studentId}&Trimester=${trimester}`
  const trimesterResultJson = await axios.get(url)
  const trimesterResult = trimesterResultJson.data

  // return the trimester result
  res.json(trimesterResult)
})

module.exports = app;