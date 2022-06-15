var express = require('express')
var router = express.Router()
var HTMLParser = require('node-html-parser')
var axios = require('axios')
var FormData = require('form-data')

const trimStr = (str) => {
  return str.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'PCIU CGPA Calculator' });
});

router.get('/get-online-result/:id', async function (req, res, next) {
  const studentId = req.params.id
  const resp = await axios.get('http://119.18.149.45/PCIUOnlineResult')
  const respData = resp.data
  var root = HTMLParser.parse(respData);

  // get the cookies from the fetch response
  const cookies = respData.headers.get('set-cookie')
  const cookie = cookies.split(';')[0]

  const requestVerificationToken = root.querySelector('form').firstChild.getAttribute('value')
  const semester = root.querySelector('#Semester').rawAttributes.Value

  if (!(requestVerificationToken && semester)) return res.json([])

  const formData = new FormData();
  formData.append('__RequestVerificationToken', requestVerificationToken);
  formData.append('StudentIdNo', studentId);
  formData.append('Semester', semester);

  const url = 'http://119.18.149.45/PCIUOnlineResult'
  var config = {
    headers: {
      'Cookie': cookie,
      ...formData.getHeaders()
    },
    data: formData
  };

  const resultResp = await axios.post(url, config)
  const resultData = resultResp.data
  const bodyHTML = resultData.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
  const parsedResHTML = HTMLParser.parse(bodyHTML)
  const cgpaTd = parsedResHTML.querySelector('.table:first-child tr:last-child td:last-child')

  if (!cgpaTd) return res.json([])

  const cgpaTxt = cgpaTd.text
  const GPA = parseFloat(cgpaTxt)

  const allTrFromSecondTbodyExceptFirstRow = parsedResHTML.querySelectorAll('.table:nth-child(2) tr:not(:first-child)')
  const results = []
  for (let i = 0; i < allTrFromSecondTbodyExceptFirstRow.length; i++) {
    const tr = allTrFromSecondTbodyExceptFirstRow[i]
    const courseCode = trimStr(tr.childNodes[3].text)
    const courseTitle = trimStr(tr.childNodes[5].text)
    const status = trimStr(tr.childNodes[7].text)
    const creditHrTxt = trimStr(tr.childNodes[11].text)
    const LetterGrade = trimStr(tr.childNodes[13].text)
    const gradePointTxt = trimStr(tr.childNodes[15].text)
    const creditHr = parseFloat(creditHrTxt)
    const GradePoint = parseFloat(gradePointTxt)
    results.push({ semester, courseCode, courseTitle, status, creditHr, GradePoint, LetterGrade, GPA })
  }
  res.json(results)
})

router.get('/get-student-info/:id', async function (req, res, next) {
  const id = req.params.id
  // fetch the student info
  const url = `http://119.18.149.45/StudentAPI/api/studentinfo/get?studentIdNo=${id}`
  const studentInfoJson = await axios.get(url)
  const studentInfo = studentInfoJson.data

  // return the student info
  res.json(studentInfo)
})

router.get('/get-trimester-result/:id/:trimester', async function (req, res, next) {
  const id = req.params.id
  const trimester = req.params.trimester
  // fetch the trimester result
  const url = `http://119.18.149.45/StudentAPI/api/StudentResult/get?studentIdNo=${id}&Trimester=${trimester}`
  const trimesterResultJson = await axios.get(url)
  const trimesterResult = trimesterResultJson.data

  // return the trimester result
  res.json(trimesterResult)
})


module.exports = router;
