import * as actionTypes from "./actionTypes";


export const openAddChat = ()=>{
    return{
        type:actionTypes.OPEN_CREATE_CHAT
    };
};

export const closeAddChat = ()=>{
    return{
        type:actionTypes.CLOSE_CREATE_CHAT
    };
};