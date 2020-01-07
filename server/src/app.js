import express from 'express'
import http from 'http'
import logger from 'morgan'
import bodyParser from 'body-parser'
import github from 'express-github-webhook'
import octonode from 'octonode'
import { parseUpdate, getAllIssues } from './controllers/controller'
require('dotenv').config()

var app = express()

const PORT = process.env.PORT
const server = http.createServer(app).listen(PORT, function () {
  console.log('Listening on port ' + PORT)
})
const expressWs = require('express-ws')(app, server)
// prepare middlewares and webhook connection
app.use(logger('dev'))
app.use(bodyParser.json())
const webhook = github({ path: '/hook', secret: process.env.secret })
app.use(webhook)

expressWs.getWss().on('connection', function (ws) {
  var client = octonode.client(process.env.secret)
  var repo = client.repo('1dv523/cb223ai-examination-3')
  repo.issues(function (callback, body, header) {
    console.log(body)
  })
  // getAllIssues()
  ws.send(JSON.stringify({ action: 'ping' }))
})
app.ws('', function (ws, req) {
  webhook.on('issues', function (repo, data) {
    const toSend = parseUpdate(data)
    ws.send(JSON.stringify(toSend))
  })
  webhook.on('issue_comment', function (repo, data) {
    ws.send(`New comment added to Issue: ${data.issue.title} by ${data.issue.user.login}`)
  })
  webhook.on('error', function (err, req, res) {
    console.log(err)
  })
})
