var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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
