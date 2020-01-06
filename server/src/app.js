import express from 'express'
import http from 'http'
import logger from 'morgan'
import bodyParser from 'body-parser'
import github from 'express-github-webhook'
require('dotenv').config()

var app = express()
const PORT = process.env.PORT
const server = http.createServer(app).listen(PORT, function () {
  console.log('Listening on port ' + PORT)
})
const webhook = github({ path: '/hook', secret: process.env.secret })
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(webhook)
webhook.on('issues', function (repo, data) {
  console.log(data)
})
webhook.on('error', function (err, req, res) {
  console.log(err)
})

export default app
