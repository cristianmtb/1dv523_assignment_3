import React from 'react'

export default class Notification extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        if(this.props.active === true){
            return(
                <div className = 'notification'>
                    {this.props.message}
                </div>
            )
        }
        return(
            <div>

            </div>
        )
        
    }

}