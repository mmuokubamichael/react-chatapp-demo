import * as actionTypes from './actionTypes';
import axios from 'axios';






export const authStart = () => {
    return{
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token,username) =>{
    return{
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username:username
    }
}

export const authFail = (error) =>{
    return{
        type: actionTypes.AUTH_FAIL,
        error:error
    }
}

export const authlogout = () => {
    localStorage.removeItem("token");
    return{
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authLogin = (userName,passWord) =>{
    return dispatch =>{
        dispatch(authStart())
        console.log(userName)
        console.log(passWord)
        axios.post('http://3.92.68.71/rest-auth/login/',{
            username: userName,
            password: passWord,
        })
        .then(res =>{
            const token = res.data.key;
            localStorage.setItem("token",token);
            localStorage.setItem("username",userName);
            dispatch(authSuccess(token,userName));
            
        })
        .catch(err => {
            console.log(err)
            dispatch(authFail(err));
           
            
        })

    }
}

export const authSignup = (username,email,password1,password2) =>{
    return dispatch =>{
        dispatch(authStart())
        axios.post('http://3.92.68.71/rest-auth/registration/',{
            username:username,
            email:email,
            password1:password1,
            password2:password2
        })
        .then(res =>{
            const token = res.data.key;
            localStorage.setItem("token",token);
            localStorage.setItem("username",username);
            dispatch(authSuccess(token,username));
        })
        .catch(err => {
       
            dispatch(authFail(err.response.data));
            
        })

    }
}

export const authCheckState = () =>{
    return dispatch =>{
        const token = localStorage.getItem("token")
        const username = localStorage.getItem("username")
        if(token === undefined){
            dispatch(authlogout())
        }else{
            dispatch(authSuccess(token,username))
        }

    }
}