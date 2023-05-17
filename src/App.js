import React from "react";

import { BrowserRouter,HashRouter } from "react-router-dom";
import {connect} from 'react-redux';
import * as actions from './store/actions/auth';

import Rout from './components/rout';
import WebSocketInstance from './websocket'



class App extends React.Component{
componentDidMount(){
    this.props.onTryAutoSignUp()
    
    }

    render(){
        return(
           
                
                <BrowserRouter>
               
                        <Rout />           
                
                </BrowserRouter>
                
           
           
        )
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onTryAutoSignUp: () => dispatch(actions.authCheckState())
    }
}

export default connect(null,mapDispatchToProps)(App);
