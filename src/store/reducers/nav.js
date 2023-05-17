import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    showChatPopup:false
}

const openAddChat = (state,action)=>{
    return updateObject(state,{
        showChatPopup: true
    })
}

const closeAddChat = (state,action)=>{
    return updateObject(state,{
        showChatPopup: false
    })
}

const nav_reducer = (state=initialState,action) => {
    switch (action.type){
        case actionTypes.OPEN_CREATE_CHAT: return openAddChat(state,action);
        case actionTypes.CLOSE_CREATE_CHAT: return closeAddChat(state,action);
       
        default: return state;
    }
}

export default nav_reducer;