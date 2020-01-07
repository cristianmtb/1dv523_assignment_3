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
var expressWs = require('express-ws')(app, server)
// prepare middlewares and webhook connection
app.use(logger('dev'))
app.use(bodyParser.json())
const webhook = github({ path: '/hook', secret: process.env.secret })
app.use(webhook)
// listen to wekhook events
webhook.on('error', function (err, req, res) {
  console.log(err)
})

app.ws('/echo', function (ws, req) {
  ws.on('connection', function (wot) {
    console.log('connected')
  })
  webhook.on('issues', function (repo, data) {
    const toSend = {
      action: data.action,
      issue: data.issue.title,
      url: data.issue.html_url,
      auhtor: data.sender.login,
      body: data.issue.body,
      changes: data.changes
    }
    ws.send(JSON.stringify(toSend))
  })
  webhook.on('issue_comment', function (repo, data) {
    ws.send(`New comment added to Issue: ${data.issue.title} by ${data.issue.user.login}`)
  })
})

