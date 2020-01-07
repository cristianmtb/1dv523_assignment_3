import React from 'react';
import './App.css';

export default class App extends React.Component {

  socket
  state
  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws:localhost:3000");
    this.socket.addEventListener("message", (event) => this.receive(event));
    this.state={
      issues:[]
    }
  }


  receive(event){
    const msg = JSON.parse(event.data)
    if(msg.type === 'initial') {
      this.setState({
        issues:msg.data
      })
      console.log(msg.data)
    }
    else if (msg.type === 'update'){

    }
  }

  render() {
    return (
      <div className="App">
        {
          this.state.issues.map((issue)=>(
            <p>
              Hello {issue.title}
            </p>
          ))
        }
      </div>
    );
  }
}
