const express = require('express')
const path = require('path')
const indexRouter = require('./route')
const app = express()
const fs = require('fs')

const nodeEnv = (process.env.NODE_ENV).trim()
const viewFolder = (nodeEnv === 'development') ? 'frontend' : 'dist'

app.use(express.static(path.join(__dirname, '../', viewFolder), {
    etag: false,
    setHeaders: (res, path) => {
        if (express.static.mime.lookup(path) === 'text/html') {
            // Skip cache on html to load new builds.
            res.setHeader("Cache-Control", "max-age=0, s-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Expires", "0");
            res.header('Pragma', 'no-cache');
            res.setHeader("Surrogate-Control", "no-store");
        }
    }
}))

app.use('/', indexRouter)

module.exports = app
