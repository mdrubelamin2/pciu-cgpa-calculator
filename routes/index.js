var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const puppeteer = require('puppeteer');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'PCIU CGPA Calculator' });
});

router.get('/get-online-result/:id', async function (req, res, next) {
  const id = req.params.id;

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://119.18.149.45/PCIUOnlineResult');
  // await page.waitForNavigation();
  await page.waitForSelector('#StudentIdNo');
  await page.type('#StudentIdNo', id);
  await page.waitForSelector('#Semester')
  const trimesterInput = await page.$('#Semester')
  // get value of the Semester input
  const semester = await trimesterInput.evaluate(el => el.value)
  await page.waitForSelector('input[type="submit"]')
  await page.click('input[type="submit"]');
  try {
    await page.waitForSelector('table', { timeout: 5000 })
    // get the first table from the page
    const allTables = await page.$$('table');
    const firstTable = allTables[0]
    // get the tbody and second row from the table
    const tbody = await firstTable.$$('tbody');
    const allTrFromTbody = await tbody[0].$$('tr');
    const secondRow = allTrFromTbody[1]
    // get the last td from the second row
    const allTdFromSecondRow = await secondRow.$$('td');
    const cgpaTd = allTdFromSecondRow[allTdFromSecondRow.length - 1]
    // get the text content of the last td
    const currentGPATxt = await cgpaTd.evaluate(el => el.textContent)
    const currentGPATxtFormatted = currentGPATxt.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    const GPA = parseFloat(currentGPATxtFormatted)
    // get the second table from allTables
    const secondTable = allTables[1]
    // get the tbody from the second table
    const secondTbody = await secondTable.$$('tbody');
    // get all tr except first row
    const allTrFromSecondTbody = await secondTbody[0].$$('tr');
    const allTrFromSecondTbodyExceptFirstRow = allTrFromSecondTbody.slice(1)

  const results = []

    for (let i = 0; i < allTrFromSecondTbodyExceptFirstRow.length; i++) {
      const tr = allTrFromSecondTbodyExceptFirstRow[i]
      const allTd = await tr.$$('td');
      const courseCode = await allTd[1].evaluate(el => el.textContent)
      const courseTitle = await allTd[2].evaluate(el => el.textContent)
      const status = await allTd[3].evaluate(el => el.textContent)
      const creditHrTxt = await allTd[5].evaluate(el => el.textContent)
      const LetterGrade = await allTd[6].evaluate(el => el.textContent.trim())
      const gradePointTxt = await allTd[7].evaluate(el => el.textContent)
      const creditHr = parseFloat(creditHrTxt)
      const GradePoint = parseFloat(gradePointTxt)
      results.push({ semester, courseCode, courseTitle, status, creditHr, GradePoint, LetterGrade, GPA })
    }

    res.json(results)
  } catch (_) {
    res.json([])
  }

  browser.close();
})

router.get('/get-student-info/:id', async function (req, res, next) {
  const id = req.params.id
  // fetch the student info
  const url = `http://119.18.149.45/StudentAPI/api/studentinfo/get?studentIdNo=${id}`
  const studentInfo = await fetch(url)
  const studentInfoJson = await studentInfo.json()

  // return the student info
  res.json(studentInfoJson)
})

router.get('/get-trimester-result/:id/:trimester', async function (req, res, next) {
  const id = req.params.id
  const trimester = req.params.trimester
  // fetch the trimester result
  const url = `http://119.18.149.45/StudentAPI/api/StudentResult/get?studentIdNo=${id}&Trimester=${trimester}`
  const trimesterResult = await fetch(url)
  const trimesterResultJson = await trimesterResult.json()

  // return the trimester result
  res.json(trimesterResultJson)
})


module.exports = router;
