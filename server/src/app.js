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
// webhook.on('issues', function (repo, data) {
//   console.log(data)
// })
webhook.on('error', function (err, req, res) {
  console.log(err)
})

app.ws('/echo', function (ws, req) {
  webhook.on('issues', function (repo, data) {
    ws.send(data.issue.title)
  })
  ws.on('connection', function (wot) {
    console.log('wat')
  })
  ws.on('message', function (msg) {
    ws.send(msg)
  })
  ws.send('connected')
  console.log('socket')
})

export default app
