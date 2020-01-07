import React from 'react';
import './App.css';
import Notification from './Notification'

export default class App extends React.Component {

    constructor(props) {
    super(props)
    this.socket = new WebSocket("ws:192.168.0.104:3000");

    this.socket.addEventListener("message", (event) => this.receive(event));
    this.state = {
      issues: [],
      notification: {
        active: false,
        message: ""
      }
    }
  }


  receive(event) {
    const msg = JSON.parse(event.data)
    if (msg.type === 'initial') {
      this.setState({
        issues: msg.data
      })
      console.log(msg.data)
    }
    else if (msg.type === 'update') {
      this.update(msg.data)
    }
  }

  render() {
    return (
      <div className="App">
        <Notification
          active = {this.state.notification.active}
          message = {this.state.notification.message}
        >
        </Notification>
        <div>
          {
            this.state.issues.map((issue) => (
              <div>
                <h2>{issue.title}</h2>
                {issue.body}
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  update(data) {
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

  addIssue(data) {
    const aux = this.state.issues
    aux.push({
      id: data.id,
      title: data.title,
      url: data.url,
      auhtor: data.auhtor,
      body: data.body
    })
    this.setState({
      issues: aux,
      notification:{
        active:true,
        message:`An issue has been ${data.action}`
      }
    })
  }

  removeIssue(data) {
    const aux = this.state.issues
    let index = aux.findIndex(x => x.id === data.id);
    aux.splice(index, 1)
    this.setState({
      issues: aux
    })
  }

  editIssue(data) {
    const aux = this.state.issues
    let index = aux.findIndex(x => x.id === data.id);
    aux[index] = {
      id: data.id,
      title: data.title,
      url: data.url,
      auhtor: data.auhtor,
      body: data.body
    }
    this.setState({
      issues: aux
    })
  }

}
