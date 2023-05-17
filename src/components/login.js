import React from "react";
import { Form, Icon, Input, Button, Checkbox,Spin } from 'antd';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import { useNavigate } from "react-router-dom";


const antIcon = <Icon type="loading" style={{ fontSize:24 }} spin />;
 


class NormalLoginForm extends React.Component {
  constructor(props){
    super(props)
    
    this.state={
      email:'',
      password:'',
      check:false
    }
    

  }

  emailChange = event =>{
    this.setState({
      email:event.target.value
    })
  }
  
  passwordChange = event =>{
    this.setState({
      password:event.target.value
    })
  }

  checkChange = event =>{
    this.setState({
      check:event.target.value
    })
  }
  
  handleSubmit = e => {
    e.preventDefault();
    if(this.state.email !== '' && this.state.password !== '' ){
      this.props.auth(this.state.email,this.state.password);
    }
    
  };
  

  render() {
   
    if(this.props.token){
      this.props.history("/")
    }
    
    
    
    return (
      <div className="container">
        <div className="col-6 mx-auto mt-3">
          <br />
          {this.props.error && <p style={{ color:"red" }}>{this.props.error.response.data.non_field_errors[0]}</p> }
           
          { this.props.loading ? 

            <Spin indicator={antIcon} />
          
          :

          <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="username">Username:</label>
                <input type="text" onChange={this.emailChange} value={this.state.email} className="form-control" id="username" required />
              </div>
              <div className="form-group">
                <label for="pwd">Password:</label>
                <input type="password" onChange={this.passwordChange} value={this.state.password} className="form-control" id="pwd" required />
              </div>
              <div className="checkbox">
                <label><input type="checkbox" onChange={this.checkChange} value={this.state.check} /> Remember me</label>
              </div>
              <button type="submit" className="btn btn-default">login</button> <a className="btn btn-success" href="/signup/">sgnup</a>
        </form>
         
        
        }
       
        </div>
        
      </div>
    );
  }
}


const mapStateToProps = state =>{
  return{
      error: state.auth.error,
      loading:state.auth.loading,
      token: state.auth.token

  }
}

const mapDispatchToProps = dispatch =>{
  return{
      auth: (username,password) => dispatch(actions.authLogin(username,password))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm);