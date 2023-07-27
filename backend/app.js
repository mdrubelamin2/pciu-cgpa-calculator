const express = require('express')
const path = require('path')
const indexRouter = require('./route')
const app = express()
const fs = require('fs')

const nodeEnv = (process.env.NODE_ENV).trim()
const viewFolder = (nodeEnv === 'development') ? 'frontend' : 'dist'

// get the build hash from the build-hash.txt file if exists
let buildHash = ''
const hashPath = __dirname + '/../build-hash.txt'
if (fs.existsSync(hashPath)) {
    buildHash = fs.readFileSync(hashPath, 'utf8')
}

app.use(express.static(path.join(__dirname, '../', viewFolder), {
    index: [`index.${buildHash}.html`, 'index.html'],
    etag: false,
    maxage: -1
}))

app.use('/', indexRouter)

module.exports = app
