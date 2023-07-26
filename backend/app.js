const express = require('express')
const path = require('path')
const indexRouter = require('./route')
const app = express()

const nodeEnv = (process.env.NODE_ENV).trim()
const viewFolder = (nodeEnv === 'development') ? 'frontend' : 'dist'

app.use(express.static(path.join(__dirname, '../', viewFolder)))

// view engine setup
app.set('views', path.join(__dirname, '../', viewFolder));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', indexRouter)

module.exports = app
