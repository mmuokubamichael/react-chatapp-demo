import React from "react";
import { Form,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import * as actions from '../store/actions/nav'
import axios from 'axios';

class CreateChat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        channelName:''
      }
  
      
    }
    handleChange = (event)=>{
        this.setState({
            channelName: event.target.value
        })
      }
    
      creatingChat = (username,token)=>{
        
        const combine = [username]
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
          "Content-Type":"application/json",
          Authorization: `Token ${token}`
        };
        axios.post(`http://127.0.0.1:8000/chat/createchat/`,{
          "participants": combine,
          "messages": [],
          "chat_name": this.state.channelName,
          "chat_slug": ""

        })
        .then(res =>{
          console.log(res.data.chat_slug)
          this.setState({
            channelName:''
          })
          this.props.hideChatpopup()
          this.props.history(`/${res.data.chat_slug}/`)
        })
        .catch(e=>{
          console.log(e.response)
        })
    }
    
    submitCreatechat = (e)=>{
      e.preventDefault();
     
      this.creatingChat(this.props.username,this.props.token)

    }
   
  
    render() {
      return (
        <Form inline onSubmit={this.submitCreatechat} >
        <FormGroup controlId="formInlineName" >
          <ControlLabel>channel Name</ControlLabel>{' '}
          <FormControl type="text" onChange={this.handleChange} placeholder="" bsClass="mx-auto" value={this.state.channelName} required  />
        </FormGroup>{' '}
        <Button type="submit">Create</Button>
      </Form>
      )
    }
  }

  const mapStateToProps = state =>{
    return{
        error: state.auth.error,
        username: state.auth.username,
        token: state.auth.token,
        showaddchat: state.nav.showChatPopup,
        
  
    }
  }
  
const mapDispatchToProps = dispatch =>{
  return{
      hideChatpopup: () => dispatch(actions.closeAddChat())
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CreateChat) 