import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    token:null,
    error:null,
    loading: false,
    username:null
}

const authStart = (state,action) => {
    return updateObject(state, {
        loading: true,
        error:null,
    })
}

const authSuccess = (state,action) =>{
    return updateObject(state,{
        token:action.token,
        error:null,
        loading: false,
        username:action.username
    })
}

const authFail = (state,action) =>{
    return updateObject(state,{
        token:null,
        error:action.error,
        loading: false,
        username:null

    })
}

const authlogout = (state,action) =>{
    return updateObject(state,{
        token:null,
        error:null,
        loading: false,
        username:null
    })
}

const reducer = (state=initialState,action) => {
    switch (action.type){
        case actionTypes.AUTH_START: return authStart(state,action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state,action);
        case actionTypes.AUTH_FAIL: return authFail(state,action);
        case actionTypes.AUTH_LOGOUT: return authlogout(state,action);
        default: return state;
    }
}

export default reducer;