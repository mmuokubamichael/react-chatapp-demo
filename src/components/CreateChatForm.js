import React from "react";
import { Form,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import * as actions from '../store/actions/nav'
import axios from 'axios';

class CreateChat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        channelName:'',
        isLoading: false
      }
  
      
    }
    handleChange = (event)=>{
        this.setState({
            channelName: event.target.value,
            
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
        axios.post(`http://3.92.68.71/chat/createchat/`,{
          "participants": combine,
          "messages": [],
          "chat_name": this.state.channelName,
          "chat_slug": ""

        })
        .then(res =>{
          
          this.setState({
            channelName:''
          })
          
          this.props.history(`/${res.data.chat_slug}/`)
          this.props.hideChatpopup()
          this.setState({isLoading: false})
        })
        .catch(e=>{
          console.log(e.response)
        })
    }
    
    submitCreatechat = (e)=>{
      e.preventDefault();
     this.setState({isLoading: true})
      this.creatingChat(this.props.username,this.props.token)

    }
   
  
    render() {
      const { isLoading } = this.state;
      return (
      
       
         <Form inline onSubmit={this.submitCreatechat} >
        
        {isLoading ? (
          <>
          <FormGroup controlId="formInlineName" >
          <ControlLabel>channel Name</ControlLabel>{' '}
          <FormControl type="text" onChange={this.handleChange} placeholder="" bsClass="mx-auto" value={this.state.channelName} disabled  />
        </FormGroup>{' '}
        <Button type="submit" disabled><i class="fa fa-spinner fa-spin" ></i></Button>
          </>
          
        ):
        <>
        <FormGroup controlId="formInlineName" >
          <ControlLabel>channel Name</ControlLabel>{' '}
          <FormControl type="text" onChange={this.handleChange} placeholder="" bsClass="mx-auto" value={this.state.channelName} required  />
        </FormGroup>{' '}
        <Button type="submit">Create</Button>
        </>
        
        }
        
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