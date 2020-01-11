import express from 'express'
import http from 'http'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import github from 'express-github-webhook'
import octonode from 'octonode'
require('dotenv').config()

var app = express()
// Server starting
const PORT = process.env.PORT
const server = http.createServer(app).listen(PORT, function () {
  console.log('Listening on port ' + PORT)
})
// this lines registers the websocket for the server
const expressWs = require('express-ws')(app, server)
// prepare middlewares and webhook connection
app.use(logger('dev'))
app.use(bodyParser.json())
const webhook = github({ path: '/hook', secret: process.env.secret })
app.use(webhook)
/**
 * Serve the React app
 */
app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

/**
 * Handle the initial websocket connection
 */

expressWs.getWss().on('connection', function (ws) {
  if (ws.readyState === 1) {
    const client = octonode.client(process.env.secret)
    const repo = client.repo('1dv523/cb223ai-examination-3')
    repo.issues(function (callback, body, header) {
      const issues = []
      body.map((issue) => {
        issues.push({
          id: issue.number,
          title: issue.title,
          url: issue.html_url,
          author: issue.user.login,
          body: issue.body,
          comments: issue.comments
        })
      })
      if (ws.readyState === 1) {
        try {
          ws.send(JSON.stringify({
            type: 'initial',
            data: issues
          }))
        } catch (error) {
        }
      }
    })
  }
})

/**
 * Handle webhooks trough websocket
 */
app.ws('', function (ws, req) {
  ws.on('close', function (code, reason) {
    ws.close(1, '')
  })
  webhook.on('issues', function (repo, data) {
    if (ws.readyState === 1) {
      const toSend = {
        action: data.action,
        title: data.issue.title,
        url: data.issue.html_url,
        auhtor: data.sender.login,
        body: data.issue.body,
        changes: data.changes,
        id: data.issue.number,
        comments: data.issue.comments
      }
      try {
        ws.send(JSON.stringify({
          type: 'update',
          data: toSend
        }))
      } catch (error) {
      }
    }
  })
  webhook.on('issue_comment', function (repo, data) {
    if (ws.readyState === 1) {
      const toSend = {
        action: data.action,
        issue: data.issue.number,
        body: data.comment.body,
        author: data.comment.user.login
      }
      try {
        ws.send(JSON.stringify({ type: 'comment', data: toSend }))
      } catch (error) {
      }
    }
  })
  webhook.on('error', function (err, req, res) {
    console.log(err)
  })
})
