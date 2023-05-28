import React from 'react'
import '../App.css';
import Sidepanel from './sidepanel'
import WebSocketInstance from '../websocket'
import Chathandler from './handlechat'
import {connect} from 'react-redux';




class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state ={}

       


    }
   
    /*
    setMessages(messages){
        
        this.setState({
            messages: messages.reverse(),
        });
    }
    addMessage(message){
        this.setState({
            messages: [...this.state.messages, message]
        });
    }
    */
    
   
    
    render(){
         /*
        const renderChat = this.state.messages.map(msg => {
            return <Chathandler key={msg.id} {...msg} />
        })
        */
        if(this.props.token){
            return(
                <div className="container app chatstyless">
                <div className="row app-one chatstyless">
                    
                    
                <Sidepanel history={this.props.history} />
                 
                </div>
              </div>
            )
          }else{
            this.props.history("/login/")
          }
       
        
    }

}


const mapStateToProps = state =>{
    return{
        error: state.auth.error,
        username: state.auth.username,
        token: state.auth.token,
        
        
  
    }
  }
export default connect(mapStateToProps)(Chat);
