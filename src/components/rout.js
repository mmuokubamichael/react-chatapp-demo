import React from 'react';
import Chat from './chatapp';
import WrappedNormalLoginForm from './login';
import WrappedRegistrationForm from './signup';
import Home from './home';
import Addchat from './Popup'


import {useNavigate, Routes,Route,useParams, } from "react-router-dom";



const Rout = () => {
  const history = useNavigate()
  
  const Wrapper =(props)=>{
    const params = useParams();
    return <Chat history={history} {...{...props,match:{params}}} />

  }
  return (
    
    <Routes>

      <Route path="/" element={<Home history={history} />} ></Route>
      <Route path="/open" element={<Addchat history={history} />} ></Route>
      <Route path="/:chat" element={<Wrapper />} ></Route>
        <Route path="/login/" element={<WrappedNormalLoginForm history={history} />} ></Route>
        <Route path="/signup/" element={<WrappedRegistrationForm history={history} />} ></Route>
    </Routes>
  )
}

export default Rout;
