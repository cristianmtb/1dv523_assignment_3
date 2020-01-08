import React from 'react'

export default class Notification extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
      return (
        <div className='Notification'>
          {this.props.message}
        </div>
      )
  }
}
