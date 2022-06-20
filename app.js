const express = require('express')
const path = require('path')
const indexRouter = require('./route')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'dist')))

app.use('/', indexRouter)

module.exports = app
