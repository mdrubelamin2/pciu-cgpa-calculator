const express = require('express')
const path = require('path')
const indexRouter = require('./route')
const app = express()

const nodeEnv = (process.env.NODE_ENV).trim()
const viewFolder = (nodeEnv === 'development') ? 'public' : 'dist'

app.use(express.static(path.join(__dirname, viewFolder)))

app.use('/', indexRouter)

module.exports = app
