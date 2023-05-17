

class WebSocketService {
    static instance = null;
    //callback = {};
    callbacks = {};
    static getInstance(){
        if(!WebSocketService.instance){
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    constructor(){
        this.socketRef = null;
    }
    connect(chatID){
       
        const path = `ws://127.0.0.1:8000/ws/chat/${chatID}/`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = ()=>{
            console.log("open")
        };
        
       
        this.socketRef.onmessage = (m)=>{
            // receiving message
            console.log(m)
           
            this.socketNewMessage(m.data)
        };

        this.socketRef.onerror = (e)=>{
            // error
            console.log(e.message)
        };
        this.socketRef.onclose = ()=>{
            console.log("closed")
            this.connect();
        }

    }
/*
    socketNewMessage(data){
        const parseData = JSON.parse(data)
        const command = parseData.comand
        if(Object.keys(this.callback).length === 0){
            return;
        }
        if(command === 'fetch_messsage'){
            console.log(Object.keys(this.callback))
            console.log(parseData.messages)
            this.callback[command](parseData.messages);
        }
        if(command === 'chat_message'){
            console.log("jkjjjjjjjjj")
            this.callback[command](parseData.message);
        }
    }
    */
    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.comand;
        if (Object.keys(this.callbacks).length === 0) {
          return;
        }
        if (command === "fetch_messsage") {
            
          this.callbacks[command](parsedData);
        }
        if (command === "chat_message") {
          this.callbacks[command](parsedData);
        }
      }

    fetchMessages(username,chatUrl,cat){
        
        this.sendMessage({comand:'fetch_message',username:username,chaturl:chatUrl,cat:cat})
    }
    newChatMessage(message){
        this.sendMessage({comand:'send_chat_message',from:message.from, message:message.content,chaturl:message.chatUrl,replyid:message.replyChatId})
    }

    /*
    addCallbacks(messagesCallback, newMessageCallback){
        this.callback['fetch_message'] = messagesCallback;
        this.callback['chat_message'] = newMessageCallback;

    }
    */
    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks["fetch_messsage"] = messagesCallback;
        this.callbacks["chat_message"] = newMessageCallback;
      }

    sendMessage(data){
        try{
            this.socketRef.send(JSON.stringify({...data}))
        }catch(err){
            console.log(err)
        }
    }

    state(){
        return this.socketRef.readyState;
    }
    disconnect(){
        this.socketRef.close();
    }
    waitForSocketConnetion(callback){
        const socket = this.socketRef;
        const recursion = this.waitForSocketConnetion;
        setTimeout(
            function(){
                if(socket.readyState === 1){
                    console.log('connection is secured');
                    if(callback != null){
                        callback();
                    }
                    return;
                }else {
                    console.log('waiting for connection....')
                    recursion(callback);
                }

            },1);
    }
}

const WebSocketInstance = WebSocketService.getInstance();
export default WebSocketInstance