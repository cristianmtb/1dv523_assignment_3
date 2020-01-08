import React from 'react'

export default class Notification extends React.Component {
  time
  //Standrad doesn't recognize the constructor
  constructor (props) {
    super(props)
    this.time = new Date();
  }

  render () {
    return (
      <div className='Notification'>
        {this.props.message}
        <div className = "Line"></div>
        <div className = "Notif-time">{this.time.toUTCString()}</div>
      </div>
    )
  }
}
