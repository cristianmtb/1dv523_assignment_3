import React from 'react'
import './App.css'
import Notification from './Notification'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    // For some reason standard JS doesn't recognize the websocket
    this.socket = new WebSocket('wss:46.101.156.130:443')

    this.socket.addEventListener('message', (event) => this.receive(event))
    this.state = {
      notifs: [],
      issues: [],
      notification: {
        active: false,
        message: ''
      }
    }
  }

  receive (event) {
    const msg = JSON.parse(event.data)
    if (msg.type === 'initial') {
      this.setState({
        issues: msg.data
      })
    } else if (msg.type === 'update') {
      this.notifyUpdate(msg.data)
      this.update(msg.data)
    } else if (msg.type === 'comment') {
      this.notifyComment(msg.data)
    }
  }

  render () {
    return (
      <div className='App'>
        <div className='Issue-div'>
          <h1>Issues:</h1>
          {
            this.state.issues.map((issue) => (
              <div
                key={issue.id}
                className='Issue'
              >
                <h3>{issue.title} #{issue.id}</h3>
                <a href={issue.url}>Go to Issue</a>
                <p>Author: {issue.author}</p>
                <div className='Line' />
                <div className='BodyTitle'>Body:</div>
                {issue.body}
                <div className='Line' />
                Number of comments: {issue.comments}
              </div>
            ))
          }
        </div>
        <div className='Notification-Div'>
          <h1>Notifications:</h1>
          {
            this.state.notifs.map((notif) => (
              <Notification
                key={notif}
                message={notif}
              />
            ))
          }
        </div>
      </div>
    )
  }

  update (data) {
    switch (data.action) {
      case 'opened':
        this.addIssue(data)
        break
      case 'reopened':
        this.addIssue(data)
        break
      case 'closed':
        this.removeIssue(data)
        break
      case 'edited':
        this.editIssue(data)
        break
      default:
        break
    }
  }

  addIssue (data) {
    const aux = this.state.issues
    aux.push({
      id: data.id,
      title: data.title,
      url: data.url,
      auhtor: data.auhtor,
      body: data.body,
      comments: data.comments
    })
    this.setState({
      issues: aux
    })
  }

  removeIssue (data) {
    const aux = this.state.issues
    const index = aux.findIndex(x => x.id === data.id)
    aux.splice(index, 1)
    this.setState({
      issues: aux
    })
  }

  editIssue (data) {
    const aux = this.state.issues
    const index = aux.findIndex(x => x.id === data.id)
    aux[index] = {
      id: data.id,
      title: data.title,
      url: data.url,
      auhtor: data.auhtor,
      body: data.body,
      comments: data.comments
    }
    this.setState({
      issues: aux
    })
  }

  notifyComment (data) {
    const message = `A comment has been ${data.action} to issue number ${data.issue}`
    const aux = this.state.notifs
    aux.push(message)
    const temp = this.state.issues
    const index = temp.findIndex(x => x.id === data.issue)
    if (data.action === 'deleted') temp[index].comments--
    else if (data.action === 'created') temp[index].comments++
    this.setState({
      issues: temp,
      notifs: aux
    })
  }

  notifyUpdate (data) {
    const message = `Issue number ${data.id} has been ${data.action}`
    const temp = this.state.notifs
    temp.push(message)
    this.setState({
      notifs: temp
    })
  }
}
