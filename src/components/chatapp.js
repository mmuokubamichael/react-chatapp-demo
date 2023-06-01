import React from 'react'
import '../App.css';
import Sidepanel from './sidepanel'
import WebSocketInstance from '../websocket'
import Chathandler from './handlechat'
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import {Modal,Button,ModalBody,ListGroup,ListGroupItem} from 'react-bootstrap'
import getCroppedImg  from './utils/cropimage'
import * as actions from '../store/actions/nav'
import { Alert, } from 'react-bootstrap';
import axios from 'axios';





class Chat extends React.Component{
  messagesEndRef = React.createRef();
    constructor(props){

        super(props)
        this.state ={messages:[],
        message:'',
        chatModal:false,
        chat_name:null,
        photoFile:null,
        openCrop:false,
        crop: { x: 0, y: 0 },
        zoom: 1,
        rotation: 0,
        croppedAreaPixels:null,
        cropedImage:null,
        cropedImagefile:null,
        navImage:null,
        participants:[],
        admins:[],
        restrict_user:[],
        participants_count:0,
        exitGroupModal:false,
        restrictUserModal:false,
        unrestrictUserModal:false,
        blockUserModal:false,
        unblockUserModal:false,
        userToRestrict:null,
        userFriend:null,
        replyChat:null,
        replyAuthor:null,
        replyChatID:null,
        exists:null,
        accepted:null,
        cat:null,
        sender:null,
        reciever:null,
        not_friend:null,
        userNotExists:null,
        friendChat:null,
        navigate:null,
        objectexist:null,
        chaterror:null,
        isLoading: false

        

      };
      this.interval = null
        this.waitForSocketConnetion(()=>{
            WebSocketInstance.addCallbacks(this.setMessages.bind(this),this.addMessage.bind(this));
            const username = localStorage.getItem("username")
            if(username){
              WebSocketInstance.fetchMessages(username,this.props.match.params.chat,this.props.match.params.chat[0]);
            }
        
            
            
        })
        try{
            if(WebSocketInstance.state() === 1){
                console.log("reconnecting socket")
                console.log(this.props.match.params.chat)
                WebSocketInstance.disconnect()
                WebSocketInstance.connect(this.props.match.params.chat);
            }
        }
        catch(err){
            console.log("initializing socket")
            console.log(this.props.match.params.chat)
            WebSocketInstance.connect(this.props.match.params.chat);
        }
        /*
        if(WebSocketInstance.state() === 1){
            console.log("reconnecting socket")
            WebSocketInstance.disconnect()
            WebSocketInstance.connect(this.props.match.params.chat);
        }else{
            console.log("initializing socket")
            WebSocketInstance.connect(this.props.match.params.chat);
            
        }
        */
       

    }
    
    
    waitForSocketConnetion=(callback)=>{
        const component = this;
        setTimeout(
            function(){
                if(WebSocketInstance.state() === 1){
                    console.log('connection is secured');
                    if(callback != null){
                        callback();
                        
                    }
                    return;
                }else {
                    console.log('waiting for connection....')
                    component.waitForSocketConnetion(callback);
                }

            },100);
    }


    handleCropChangeChannel = (e) => {
      const file = e.target.files[0];
      console.log(file)
      
      if (file) {
        this.setState({photoFile:URL.createObjectURL(file)})
        this.setState({openCrop:true})
      }
    };
    /*
    setMessages(messages){
        
        this.setState({
            messages: messages.reverse(),
        });
    }
    addMessage(message){
        this.setState({
            messages: [...this.state.messages, message]
        });
    }
    */
    setMessages = (messages)=>{
      console.log(messages.messages)
        
        this.setState({
            messages: messages.messages,
            exists:messages.exists,
            accepted:messages.accepted,
            cat:messages.cat,
            sender:messages.sender,
            reciever:messages.reciever,
            not_friend:messages.is_not_friend,
            userNotExists:messages.user_not_exists,
            friendChat:messages.notfriendChat,
            navigate:messages.navigate,
            chat_name:messages.chat_name,
            objectexist:messages.objectexist,
            chaterror:messages.chaterror,
            userFriend:messages.userFriend,
            navImage:messages.navpic,
            listparticipants:false,
            participants:messages.participants,
            participants_count:messages.participants_count,
            admins:messages.admins,
            restrict_user:messages.restrict_user

        });
       

    }
    addMessage = (message)=>{
      console.log(message)
        if(message.is_user_restricted){
          alert(message.restrict_message)
          window.location.reload();
        }
        else{
          this.setState({
            messages: [...this.state.messages, message.message]
        });
        }
       
        
        
        
    }
   /*
    renderChat = (messages)=>{
        
        messages.map(msg => {
            
           return  (<Chathandler key={msg.id} {...msg} />)
        })
    }
    */

replychat = (chat,author,id)=>{
    this.setState({replyChat:chat,replyAuthor:author,replyChatID:id})
}

unblockUserRequest = (username,token)=>{
    
  
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/unblockUser/${this.props.match.params.chat}/`,{
    "currentuser": username,
    /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    
    window.location.reload();
    this.setState({unblockUserModal:false})
    this.setState({isLoading:false})
  })
  .catch(e=>{
    console.log(e.response)
  })
}
sendunBlockUserrequest =()=>{
  this.setState({isLoading:true})
  this.unblockUserRequest(this.props.username,this.props.token)
}
  
blockUserRequest = (username,token)=>{
    
  
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/blockUser/${this.props.match.params.chat}/`,{
    "currentuser": username,
    /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    
    window.location.reload();
    this.setState({blockUserModal:false})
    this.setState({isLoading:false})
    
  })
  .catch(e=>{
    console.log(e.response)
  })
}   
sendBlockUserrequest =()=>{
  this.setState({isLoading:true})
  this.blockUserRequest(this.props.username,this.props.token)
}

blockUser = ()=>{
  
  console.log(this.state.userFriend,this.state.restrict_user)
  if(Object.values(this.state.restrict_user).includes(this.state.userFriend)){
      return(
       
      <li><a onClick={()=>this.setState({unblockUserModal:true})}>Unblock User</a></li>
      )
  }else{
    return(
      <li><a onClick={()=>this.setState({blockUserModal:true})}>Block User</a></li>
    )
  }
}
   
exitGroupRequest = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/exitgroup/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    this.setState({exitGroupModal:false})
    this.setState({isLoading: true})
    this.props.history('/')
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}

  
UnrestrictGroupRequest = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/unrestrictUser/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    let restricted = this.state.restrict_user
    const index = restricted.indexOf(res.data.unrestricted)
    if(index > -1){
      restricted.splice(index,1)
    }
    
    this.setState({unrestrictUserModal:false})
    this.setState({isLoading: false})
    this.setState({restrict_user:restricted})
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}
  
restrictGroupRequest = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/restrictUser/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    /*
    let restricted = this.state.restrict_user
    restricted.push(res.data.restricted)
    */
    this.setState({restrictUserModal:false})
    this.setState({isLoading: false})
    this.setState({restrict_user: [...this.state.restrict_user,res.data.restricted]})
    
    
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}

exitChanel = ()=>{
  this.setState({isLoading: true})
  this.exitGroupRequest(this.props.username,this.props.token)
}
sendUnRestrictrequest =()=>{
  this.setState({isLoading: true})
  this.UnrestrictGroupRequest(this.state.userToRestrict,this.props.token)
}
sendRestrictrequest =()=>{
    this.setState({isLoading: true})
    this.restrictGroupRequest(this.state.userToRestrict,this.props.token)
}

checkForRestrictedUser = (norm_user)=>{
 
  if(Object.values(this.state.restrict_user).includes(norm_user["author"])){
    return(
      <button key={norm_user["id"]} onClick={()=>this.setState({unrestrictUserModal:true,userToRestrict:norm_user["author"]})} className='btn btn-danger btn-sm'>unrestrict</button>
    )
    
  }else{
    return(
      <button key={norm_user["id"]} onClick={()=>this.setState({restrictUserModal:true,userToRestrict:norm_user["author"]})} className='btn btn-warning btn-sm'>restrict</button>
    )
    
  }
}
restrictUser = (user,admin)=>{
  if(admin["author"] === this.props.username){
    if(user["author"] !== admin["author"]){
      return(
        <>
        {this.state.restrict_user ? <>{this.checkForRestrictedUser(user)}</>  :
        
        <button className='btn btn-warning btn-sm'>restrict</button>
        }
        </>
        
        
      )
    }
    
  }
}

    checkAdmin = (user,admin)=>{
      if(user === admin["author"]){
        return(
         <span className='badgeadmin' >A</span>
        )
      }

    }
    adminEdit = (admin)=>{
      if(this.props.username === admin["author"]){
        return(
          <li><a onClick={()=>this.setState({chatModal:true})}>Edit channel</a></li>
        )
      }
    }

    navHeader = ()=>{
      const is_user = ((this.state.userFriend === this.props.username) ? false : true)
      if(this.state.cat === "c"){
          return(
            <div className="row heading chatstyless">
              
            <div className="col-sm-1 col-xs-1 heading-compose  pull-left chatstyless">
              <i className="fa fa-angle-double-left fa-2x  pull-left" onClick={()=> this.props.history('/')} aria-hidden="true"></i>
            </div>
            <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar chatstyless">
            
              <div className="heading-avatar-icon chatstyless">
                
              {this.state.navImage? 
              
                  <img src={`${this.state.navImage}`} />
                  :
                  <img src="https://www.pngitem.com/pimgs/m/148-1489698_the-main-group-group-chat-group-chat-icon.png" />  
                  }
              </div>
            </div>
            <div className="col-sm-7 col-xs-6 heading-name chatstyless">
              <a className="heading-name-meta">{this.state.chat_name}
              </a>
              <span className="heading-online chatstyle">Online</span>
            </div>
            <div className="col-sm-1 col-xs-1 heading-dot pull-right chatstyless">
            <div className="dropdown">
              <button className="float-right" type="button" data-toggle="dropdown"><i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i></button>
              <ul className="dropdown-menu">
                {this.state.admins &&
                this.state.admins.map(adm => this.adminEdit(adm))}
                
                <li><a onClick={()=>this.setState({listparticipants:true})}>Participants</a></li>
                <li><a onClick={()=>this.setState({exitGroupModal:true})} >Exit Channels</a></li>
              </ul>
            </div>
              
            </div>
            </div>
          )
      }
      if(this.state.cat === "_"){
        return(
          <div className="row heading chatstyless">
          <div className="col-sm-1 col-xs-1 heading-compose  pull-left chatstyless">
            <i className="fa fa-angle-double-left fa-2x  pull-left" onClick={()=> this.props.history('/')} aria-hidden="true"></i>
          </div>
          <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar chatstyless">
            <div className="heading-avatar-icon chatstyless">
              {this.state.navImage? 
                  <img src={`${this.state.navImage}`} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
            </div>
          </div>
          <div className="col-sm-7 col-xs-6 heading-name chatstyless">
            <a className="heading-name-meta">{this.state.userFriend}
            </a>
            <span className="heading-online chatstyle">Online</span>
          </div>
          {is_user && 
          <div className="col-sm-1 col-xs-1 heading-dot pull-right chatstyless">
          <div className="dropdown">
            <button className="float-right" type="button" data-toggle="dropdown"><i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i></button>
            <ul className="dropdown-menu">
              {this.blockUser()}
              
            </ul>
          </div>
            
          </div>
          }
          
          </div>
          )
      }
      if(this.state.cat === "f"){
        return(
          <div className="row heading chatstyless">
          <div className="col-sm-1 col-xs-1 heading-compose  pull-left chatstyless">
            <i className="fa fa-angle-double-left fa-2x  pull-left" onClick={()=> this.props.history('/')} aria-hidden="true"></i>
          </div>
          <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar chatstyless">
            <div className="heading-avatar-icon chatstyless">
              {this.state.navImage? 
                  <img src={`${this.state.navImage}`} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
            </div>
          </div>
          <div className="col-sm-8 col-xs-7 heading-name chatstyless">
            <a className="heading-name-meta">{this.state.userFriend}
            </a>
            <span className="heading-online chatstyle">Online</span>
          </div>
          
          
          </div>
          )
      }
    }


    uploadimagerequest = (username,token)=>{
      let formData = new FormData();
      if(this.state.cropedImagefile){
        const {cropedImagefile} = this.state
        let newImage = new File([cropedImagefile],cropedImagefile.name,{type:cropedImagefile.type});
        formData.append('image',newImage);
        
      }
     
      formData.append('chat_name',this.state.chat_name);
      console.log(formData)
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.headers = {
        "Content-Type":"multipart/form-data",
        Authorization: `Token ${token}`
      };
      axios.put(`http://3.92.68.71/chat/updateprofile/${this.props.match.params.chat}/`,formData)
      .then(res =>{
        
        console.log(res.data)
        
        window.location.reload();
        this.setState({openModal:false})
        this.setState({isLoading:false})
        
       
      })
      .catch(e=>{
        console.log(e.response)
      })
    }
  
    uploadChannelProfile = (e)=>{
      e.preventDefault()
      this.setState({isLoading:true})
      this.uploadimagerequest(this.props.username,this.props.token)
    }


    cropImage = async () => {
      
      try {
        const { file, url } = await getCroppedImg(
          this.state.photoFile,
          this.state.croppedAreaPixels,
          this.state.rotation
          
        );
       console.log(file)
        this.setState({cropedImage:url,cropedImagefile:file})
      
        //setFile(file);
        this.setState({openCrop:false})
        this.setState({crop: { x: 0, y: 0 },
          zoom: 1,
          rotation: 0,})
      } catch (error) {
        console.log(error);
      }
  
     
    };

    setZoom=(zoom)=>{
      this.setState({zoom})
    }
    setRotation=(rotation)=>{
      this.setState({rotation})
    }
    setCrop=(crop)=>{
      this.setState({crop})
    }

    cropComplete = (_, cropedareapicxxels) => {
      console.log(cropedareapicxxels)
      this.setState({croppedAreaPixels:cropedareapicxxels})
    };

sendonlineStatus = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.put(`http://3.92.68.71/chat/sendonlinechatstatus/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}
/*
componentDidMount(){
  this.startFetching();
}
*/
componentDidMount(){
  this.startFetching();
  
}
componentWillUnmount(){
  this.stopFetching();
}
startFetching = ()=> {
  
  this.interval=setInterval(() => {
    console.log("am sending oooooooooooo")
    this.sendonlineStatus(localStorage.getItem("username"),localStorage.getItem("token"))
  }, 2000);
}
stopFetching =()=>{
  clearInterval(this.interval);
}




    messageChangeHandler = (events)=>{
        this.setState({message: events.target.value})
    }
    sendMessageHandler = (e)=>{
        e.preventDefault();
        const messageObject = {
            from: this.props.username,
            content: this.state.message,
            chatUrl: this.props.match.params.chat,
            replyChatId:this.state.replyChatID

        }
        
        WebSocketInstance.newChatMessage(messageObject) 
        
        this.setState({message:'',replyChatId:null,replyChat:null,replyAuthor:null,})
        
        
    }
    updateJoinChannel = (username,token)=>{
        
      
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.headers = {
        "Content-Type":"application/json",
        Authorization: `Token ${token}`
      };
      axios.put(`http://3.92.68.71/chat/updatechat/${this.props.match.params.chat}/`,{
        "participants": username,
       /*
        "messages": [],
        "chat_name": this.state.channelName,
        "chat_slug": ""
      */
      })
      .then(res =>{
        
        this.props.history(`/${res.data.chat_slug}`)
        this.setState({isLoading: false})
        
       
      })
      .catch(e=>{
        console.log(e.response)
      })
  }

  sendingFriendRequest = (username,token)=>{
        
      
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type":"application/json",
      Authorization: `Token ${token}`
    };
    axios.put(`http://3.92.68.71/chat/friendrequest/${this.props.match.params.chat}/`,{
      "currentuser": username,
     /*
      "messages": [],
      "chat_name": this.state.channelName,
      "chat_slug": ""
    */
    })
    .then(res =>{
      
      this.props.history(`/f${res.data.reciever["user"]}`)
      this.setState({isLoading: false})
     
    })
    .catch(e=>{
      console.log(e.response)
    })
}

acceptsFriendRequest = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.put(`http://3.92.68.71/chat/acceptrequest/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    this.props.history(`/${res.data.slug}/`)
    this.setState({isLoading: false})
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}


deletingFriendRequest = (username,token)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/deleterequest/${this.props.match.params.chat}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    this.props.history(`/f${res.data.reciever.user}`)
    this.setState({isLoading: false})
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}

cancelFriendRequest =(e)=>{
  e.preventDefault();
  this.setState({isLoading: true})
  this.deletingFriendRequest(this.props.username,this.props.token)
}

acceptFriendRequest=(e)=>{
  e.preventDefault();
  this.setState({isLoading: true})
  this.acceptsFriendRequest(this.props.username,this.props.token)
}

joinChannel = (e)=>{
  e.preventDefault();
  this.setState({isLoading: true})
  this.updateJoinChannel(this.props.username,this.props.token)
}

sendFrendRequest = (e)=>{
  e.preventDefault();
  this.setState({isLoading: true})
  this.sendingFriendRequest(this.props.username,this.props.token)


}
/*
  scrollToBottom = () => {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    
    componentDidMount() {
      
      this.scrollToBottom();
    }
    
    componentDidUpdate() {
      this.scrollToBottom();
    }
*/


componentDidUpdate() {
  
  this.scrollToBottom();
  
}

scrollToBottom() {

  if (this.messagesEndRef.current) {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  
}

    sendMesaageRender = (data)=>{
      if(data.cat === "f"){
        if(data.userNotExists){
          return(
            <div></div>
          )
        }else{
          if(data.not_friend){
            if( data.userFriend !== this.props.username){
                return(
                      <div className="row reply chatstyless">
                      <form onSubmit={this.sendFrendRequest}>
            
                        <div className="col-sm-12 col-xs-12 reply-main chatstyless">
                        {this.state.isLoading ? (
                          <button type="submit" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" disabled><i class="fa fa-spinner fa-spin" ></i></button>
                        ):
                        <input type="submit" value="Send friend request" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" ></input>
                        }
                          
                        </div>
                        
                      </form>
                      </div>
            )
            }else{
              <div></div>
            }
           
          }else{
            if(data.accepted === "yes"){
              return(
                <div className="row reply chatstyless">
                    <NavLink to={`/${data.navigate}/`}><button className="form-control"  id="chat-message-input">navigate to chat</button></NavLink>
                </div>
              )
            }else{
              if(data.sender !== this.props.username ){
                return(
                  <div className="row reply chatstyless">
                  <form onSubmit={this.acceptFriendRequest}>
        
                      
                    
                    <div className="col-sm-12 col-xs-12 reply-main chatstyless">
                    {this.state.isLoading ? (
                        <button type="submit" value="Accept friend request" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" disabled><i class="fa fa-spinner fa-spin" ></i></button>
                        ):
                      <input type="submit" value="Accept friend request" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" ></input>
                    }
                      </div>
                    
                  </form>
                  </div>
                )
              }else{
                return(
                  <div className="row reply chatstyless">
                  <form onSubmit={this.cancelFriendRequest}>
        
                      
                    
                    <div className="col-sm-12 col-xs-12 reply-main chatstyless">
                    {this.state.isLoading ? (
                        <button type="submit" value="Cancel friend request" style={{ background:"red"}} className="form-control"  id="chat-message-input" disabled><i class="fa fa-spinner fa-spin" ></i></button>
                        ):
                        <input type="submit" value="Cancel friend request" style={{ background:"red"}} className="form-control"  id="chat-message-input" ></input>
                    }
                      
                    </div>
                    
                  </form>
                  </div>
                )
              }
    
            }
          }
        }
        
        

      }if(data.cat === "_"){
        if(!data.friendChat){
          console.log(this.state.restrict_user.length )
          if(this.state.restrict_user.length !== 0 ){
            if(Object.values(this.state.restrict_user).includes(this.state.userFriend)){
              return(
                <div className="row reply chatstyless">
                <form onSubmit={this.sendMessageHandler}>
      
                    
                  <div className="col-sm-1 col-xs-1 reply-emojis chatstyless">
                    <i className="fa fa-smile-o fa-2x"></i>
                  </div>
                  <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                    <textarea style={{color:"red"}} onChange={this.messageChangeHandler} value="unblock user " className="form-control" rows="1" id="chat-message-input" disabled></textarea>
                  </div>
                  <div className="col-sm-1 col-xs-1 reply-recording chatstyless">
                    <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-1 col-xs-1 reply-send chatstyless">
                    <button disabled>
                    <i className="fa fa-send fa-2x" aria-hidden="true" id="chat-message-submit"></i>
                    </button>
                  </div>
                </form>
                </div>
              )
            }else{
              return(
                <div className="row reply chatstyless">
                <form onSubmit={this.sendMessageHandler}>
      
                    
                  
                  <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                    <textarea style={{color:"red"}} onChange={this.messageChangeHandler} value="you have been blocked " className="form-control" rows="1" id="chat-message-input" disabled></textarea>
                  </div>
                  <div className="col-sm-1 col-xs-1 reply-recording chatstyless">
                    <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-1 col-xs-1 reply-send chatstyless">
                    <button disabled>
                    <i className="fa fa-send fa-2x" aria-hidden="true" id="chat-message-submit"></i>
                    </button>
                  </div>
                </form>
                </div>
              )
            }
          }else{
            return(
              <div className="row reply chatstyless">
              <form onSubmit={this.sendMessageHandler}>
    
                  
                <div className="col-sm-1 col-xs-1 reply-emojis chatstyless">
                  <i className="fa fa-smile-o fa-2x"></i>
                </div>
                <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                  <textarea onChange={this.messageChangeHandler} value={this.state.message} className="form-control" rows="1" id="chat-message-input" required></textarea>
                </div>
                <div className="col-sm-1 col-xs-1 reply-recording chatstyless">
                  <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                </div>
                <div className="col-sm-1 col-xs-1 reply-send chatstyless">
                  <button>
                  <i className="fa fa-send fa-2x" aria-hidden="true" id="chat-message-submit"></i>
                  </button>
                </div>
              </form>
              </div>
            )
          }
          
        }else{
          return(
            <div></div>
          )
        }
      }
    
      else{
        if(data.exists === "no"){
          return(
            <div></div>
          )
        }
        if(data.exists === "not_participant"){
          return(
            <div className="row reply chatstyless">
            <form onSubmit={this.joinChannel}>
  
                
              
              <div className="col-sm-12 col-xs-12 reply-main chatstyless">
              {this.state.isLoading ? (
                        <button type="submit" value="Join Channel" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" disabled><i class="fa fa-spinner fa-spin" ></i></button>
                        ):
                        <input type="submit" value="Join Channel" style={{ background:"#009688"}} className="form-control"  id="chat-message-input" ></input>
                    }
                
              </div>
              
            </form>
            </div>
          )
        }
        if(data.exists === "yes"){
          if(Object.values(this.state.restrict_user).includes(this.props.username)){
            return(
              <div className="row reply chatstyless">
              <form onSubmit={this.sendMessageHandler}>
    
                  
               
                <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                  <textarea style={{color:"red"}} onChange={this.messageChangeHandler} value="you have been restricted from chating in this room" className="form-control" rows="1" id="chat-message-input" required></textarea>
                </div>
                <div className="col-sm-1 col-xs-1 reply-recording chatstyless">
                  <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                </div>
                <div className="col-sm-1 col-xs-1 reply-send chatstyless">
                  <button disabled>
                  <i className="fa fa-send fa-2x" aria-hidden="true" id="chat-message-submit"></i>
                  </button>
                </div>
              </form>
              </div>
            )
          }else{
            return(
              <div className="row reply chatstyless">
              <form onSubmit={this.sendMessageHandler}>
    
                  
                
                <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                  <textarea onChange={this.messageChangeHandler} value={this.state.message} className="form-control" rows="1" id="chat-message-input" required></textarea>
                </div>
                <div className="col-sm-1 col-xs-1 reply-recording chatstyless">
                  <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>
                </div>
                <div className="col-sm-1 col-xs-1 reply-send chatstyless">
                  <button>
                  <i className="fa fa-send fa-2x" aria-hidden="true" id="chat-message-submit"></i>
                  </button>
                </div>
              </form>
              </div>
            )
          }
          
        }

      }






      
    }
     

    render(){
      if(this.props.token){
        const msg = this.state.messages;
        const { isLoading } = this.state;
        return(
          <>
          
            <div className="container app chatstyless">
            <div className="row app-one ">
                
            <Sidepanel history ={this.props.history} />
              <div className="col-sm-8 conversation chatstyless">
              
                {this.state.objectexist && 
                   this.navHeader()
                }
               
          
                <div className="row message chatstyless" id="conversation">
               {this.state.chaterror && 
                       <div className="row message-body chatstyless">
                    
                    
                       <Alert bsStyle="danger">this channel does not exist</Alert>
                       
                     </div>
               }
               {this.state.userNotExists &&
                    <div className="row message-body chatstyless">
                    
                    
                    <Alert bsStyle="danger">This user does not exists</Alert>
                    
                  </div>}
                  {this.state.friendChat &&
                    <div className="row message-body chatstyless">
                    
                    
                    <Alert bsStyle="danger"><strong>Error!!</strong> chat cannot be found </Alert>
                    
                  </div>}



                  <br />
                    {
                    msg && msg.map((m,index) => (
                      <Chathandler key={index} user={this.props.username} {...m} replying={this.replychat} />
                  ))  
                  
                  
                    }
                    
                     <div className="row message-body chatstyless">
                <div className="col-sm-12 message-main-sender chatstyless">
                  <div className="">
                    
                    <div className="message-text">
                    <div ref={this.messagesEndRef} />
                    </div>
                    
                  </div>
                </div>
              </div>
              
                </div>


              


                {this.state.replyChat && 
                <div className="row reply chatstyless">
                
                <div className="col-sm-9 col-xs-9 reply-main chatstyless">
                  <strong>{this.state.replyAuthor}</strong>
                  <p  className="replydisplay" >{this.state.replyChat.length <= 50 ? (this.state.replyChat) :
                  <>{this.state.replyChat.slice(0,70)}...</>
                  }</p>
                  </div>
                  <div className="col-sm-3 col-xs-3 text-right reply-send chatstyless"><button onClick={()=>this.setState({replyChat:null,replyAuthor:null,replyChatID:null})} className=''><i className="fa fa-close fa-2x" aria-hidden="true" id="chat-message-submit"></i></button></div>
                
                  
           
            </div>
                }
                 
                    {this.sendMesaageRender(this.state)}
               
              </div>
            </div>
          </div>
            
            
           
          
          <Modal
                  show={this.state.chatModal}
                  onHide={()=>this.setState({chatModal:false,cropedImage:null,isLoading: false})}
                  container={this}
                  aria-labelledby="contained-modal-title"
                  bsSize = "sm"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                      Edit channel
                    </Modal.Title>
                  </Modal.Header>
                  {isLoading ? (
                      <>
                      <ModalBody >
                    
                    <div className='row'>
                      <div className='col-xs-3'>
                      <div className="heading-avatar-icon chatstyless">
                       
                      {this.state.cropedImage? 
                        <>
                        <img src={`${this.state.cropedImage}`} />
                        <a href='#' className='text-danger float-start'>Delete photo</a>
                        </>
                        
                        :
                        <>
                        {this.state.navImage? 
                          <>
                          <img src={`${this.state.navImage}`} />
                         <a href='#' className='text-danger float-start'>Delete photo</a>
                          </>
                        :
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                        }
                        </>
                        
                         
                          
                       
                        }
                        
                       
                        
                        
                        
                      </div>
                      
                      </div>
                      
                      <div className='col-xs-9'>
                      <div className="form-group">
                          <label htmlFor="usr">Channels Name:</label>
                          <input type="text" onChange={(e)=>this.setState({chat_name:e.target.value})} value={this.state.chat_name} className="form-control" id="usr" required disabled/>
                        </div>
                      <label htmlFor="fileInput" className="custom-file-upload">
                        <input id="fileInput" onChange={this.handleCropChangeChannel}  type="file" disabled/>
                        
                      </label>
                      </div>
                      
                    </div>
                  
                  </ModalBody>
                  <Modal.Footer>
                 
                    <form onSubmit={this.uploadChannelProfile} >
                    <button type='submit' className='btn btn-primary' disabled><i class="fa fa-spinner fa-spin" ></i></button>
                 
                     </form>    
                  </Modal.Footer></>
                    ):
                    <>
                    <ModalBody >
                  
                  <div className='row'>
                    <div className='col-xs-3'>
                    <div className="heading-avatar-icon chatstyless">
                     
                    {this.state.cropedImage? 
                      <>
                      <img src={`${this.state.cropedImage}`} />
                      <a href='#' className='text-danger float-start'>Delete photo</a>
                      </>
                      
                      :
                      <>
                      {this.state.navImage? 
                        <>
                        <img src={`${this.state.navImage}`} />
                       <a href='#' className='text-danger float-start'>Delete photo</a>
                        </>
                      :
                      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                      }
                      </>
                      
                       
                        
                     
                      }
                      
                     
                      
                      
                      
                    </div>
                    
                    </div>
                    
                    <div className='col-xs-9'>
                    <div className="form-group">
                        <label htmlFor="usr">Channels Name:</label>
                        <input type="text" onChange={(e)=>this.setState({chat_name:e.target.value})} value={this.state.chat_name} className="form-control" id="usr" required />
                      </div>
                    <label htmlFor="fileInput" className="custom-file-upload">
                      <input id="fileInput" onChange={this.handleCropChangeChannel}  type="file" />
                      
                    </label>
                    </div>
                    
                  </div>
                
                </ModalBody>
                <Modal.Footer>
               
                  <form onSubmit={this.uploadChannelProfile} >
                  <button type='submit' className='btn btn-primary'>upload</button>
               
                   </form>    
                </Modal.Footer></>
                    }
                  
              </Modal>

              <Modal
                  show={this.state.listparticipants}
                  onHide={()=>this.setState({listparticipants:false})}
                  container={this}
                  aria-labelledby="contained-modal-title"
                  bsSize = "sm"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                    <div className='row'>
                      <div className='col-xs-3'>
                      <div className="heading-avatar-icon chatstyless">
                       
                     
                        {this.state.navImage? 
                          <>
                          <img src={`${this.state.navImage}`} />
                        
                          </>
                        :
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                        }
                       
                        
                       
                        
                        
                        
                      </div>
                      
                      </div>
                      
                      <div className='col-xs-6'>
                        <small><strong>{this.state.chat_name}</strong></small>
                        
                    
                      </div>
                      
                    </div>
                    </Modal.Title>
                  </Modal.Header>
                  <ModalBody >
                    {this.state.participants_count} Participants
                  <div style={{ maxHeight: 200, overflowY: "scroll" }}>
                  <ListGroup>
                    {this.state.participants &&
                    this.state.participants.map(data=>(
                      <ListGroupItem><div className='row'>
                      <div className='col-xs-3'>
                      <div className="heading-avatar-icon chatstyless">
                       
                     
                        {data["image"]? 
                          <>
                          <img src={`${data["image"]}`} />
                        
                          </>
                        :
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                        }
                       
                        
                       
                        
                        
                        
                      </div>
                      
                      </div>
                      
                      <div className='col-xs-9'>
                        <NavLink to={`/f${data["author"]}/`}>
                        <strong>{data["author"]} {this.state.admins.map(ptp => this.checkAdmin(data["author"],ptp))}</strong>  
                        </NavLink>
                        
                        {this.state.admins.map(ptp => this.restrictUser(data,ptp))}
                    
                      </div>
                      
                    </div></ListGroupItem>
                    ))}
                    
                    
                 </ListGroup>
                 </div>
                  </ModalBody>
                 
              </Modal>
              
      <Modal show={this.state.openCrop} onHide={()=>this.setState({openCrop:false,crop: { x: 0, y: 0 },
          zoom: 1,
          rotation: 0,})} >
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="cropper-body">
        <Cropper
          image={this.state.photoFile}
          crop={this.state.crop}
          zoom={this.state.zoom}
          rotation={this.state.rotation}
          aspect={1}
          onZoomChange={this.setZoom}
          onRotationChange={this.setRotation}
          onCropChange={this.setCrop}
          onCropComplete={this.cropComplete}
          showGrid={false}
        />
      </Modal.Body>
      <Modal.Footer>
      <div className='text-center'>Zoom</div>
                  <input type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={this.state.zoom}
                    onChange={(_,zoom)=>this.setState({zoom:_.target.value})}
                     />
                    <div className='text-center'>Rotation</div>
                  <input type="range"
                    min={0}
                    max={360}
                    value={this.state.rotation}
                    onChange={(_,rotation)=>this.setState({rotation:_.target.value})}
                     />
                    <br />
                   
        <Button variant="secondary" onClick={()=>this.setState({openCrop:false,crop: { x: 0, y: 0 },
          zoom: 1,
          rotation: 0,})}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={this.cropImage}
        >
          crop
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal
        show={this.state.exitGroupModal}
        onHide={()=>this.setState({exitGroupModal:false,isLoading: false})}
        container={this}
        aria-labelledby="contained-modal-title"
        bsSize = "sm"
      >
                 
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              are you sure you want to exit group
            </Modal.Title>
          </Modal.Header>
          {isLoading ? (
                    <ModalBody >
            
                    <button onClick={()=>this.setState({exitGroupModal:false})} className='btn btn-success' disabled>NO</button>  <button onClick={this.exitChanel} className='btn btn-secondary' disabled><i class="fa fa-spinner fa-spin" ></i></button>
                  </ModalBody>
                  ):
                  <>
          <ModalBody >
            
            <button onClick={()=>this.setState({exitGroupModal:false})} className='btn btn-success'>NO</button>  <button onClick={this.exitChanel} className='btn btn-secondary'>YES</button>
          </ModalBody>
          </>
          }
                  
                 
    </Modal>
    
    <Modal
                  show={this.state.restrictUserModal}
                  onHide={()=>this.setState({restrictUserModal:false,isLoading: false})}
                  container={this}
                  aria-labelledby="contained-modal-title"
                  bsSize = "sm"
                >
                 
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                      are you sure you want to Restrict <strong>{this.state.userToRestrict}</strong>? 
                    </Modal.Title>
                  </Modal.Header>
                  {isLoading ? (
                       <ModalBody >
                   
                       <button onClick={()=>this.setState({restrictUserModal:false})} className='btn btn-secondary' disabled>NO</button>  <button onClick={this.sendRestrictrequest} className='btn btn-success ' disabled><i class="fa fa-spinner fa-spin" ></i></button>
                      </ModalBody>
                    ):
                    <>
                  <ModalBody >
                   
                   <button onClick={()=>this.setState({restrictUserModal:false})} className='btn btn-secondary'>NO</button>  <button onClick={this.sendRestrictrequest} className='btn btn-success '>YES</button>
                  </ModalBody>
                    </>
                  }
                  
                 
    </Modal>

    <Modal
        show={this.state.unrestrictUserModal}
        onHide={()=>this.setState({unrestrictUserModal:false,isLoading: false})}
        container={this}
        aria-labelledby="contained-modal-title"
        bsSize = "sm"
        >
       
            <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            are you sure you want to Unrestrict <strong>{this.state.userToRestrict}</strong>? 
          </Modal.Title>
        </Modal.Header>
        {isLoading ? (
          <ModalBody >
          
          <button onClick={()=>this.setState({unrestrictUserModal:false})} className='btn btn-secondary' disabled>NO</button>  <button onClick={this.sendUnRestrictrequest} className='btn btn-success ' disabled><i class="fa fa-spinner fa-spin" ></i></button>
        </ModalBody>
        ):
        <>
        <ModalBody >
          
          <button onClick={()=>this.setState({unrestrictUserModal:false})} className='btn btn-secondary'>NO</button>  <button onClick={this.sendUnRestrictrequest} className='btn btn-success '>YES</button>
        </ModalBody>
        </>
        }
                     
    </Modal>
    
    <Modal
        show={this.state.blockUserModal}
        onHide={()=>this.setState({blockUserModal:false,isLoading:false})}
        container={this}
        aria-labelledby="contained-modal-title"
        bsSize = "sm"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            are you sure you want to block this user
          </Modal.Title>
        </Modal.Header>
        {isLoading ? (
          <ModalBody >
          
          <button onClick={()=>this.setState({blockUserModal:false})} className='btn btn-secondary' disabled>NO</button>  <button onClick={this.sendBlockUserrequest} className='btn btn-success ' disabled><i class="fa fa-spinner fa-spin" ></i></button>
        </ModalBody>
        ):
        <ModalBody >
          
        <button onClick={()=>this.setState({blockUserModal:false})} className='btn btn-secondary'>NO</button>  <button onClick={this.sendBlockUserrequest} className='btn btn-success '>YES</button>
      </ModalBody>
        }
       
                 
    </Modal>
    <Modal
        show={this.state.unblockUserModal}
        onHide={()=>this.setState({unblockUserModal:false})}
        container={this}
        aria-labelledby="contained-modal-title"
        bsSize = "sm"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            are you sure you want to unblock this user
          </Modal.Title>
        </Modal.Header>
        {isLoading ? (
          <ModalBody >
          
          <button onClick={()=>this.setState({unblockUserModal:false})} className='btn btn-secondary' disabled>NO</button>  <button onClick={this.sendunBlockUserrequest} className='btn btn-success ' disabled><i class="fa fa-spinner fa-spin" ></i></button>
        </ModalBody>
        ):
        <ModalBody >
          
        <button onClick={()=>this.setState({unblockUserModal:false})} className='btn btn-secondary'>NO</button>  <button onClick={this.sendunBlockUserrequest} className='btn btn-success '>YES</button>
      </ModalBody>
        }
       
                 
    </Modal>
          </>
           
        )
      }else{
        this.props.history("/login/")
      }
        
         /*
        const renderChat = this.state.messages.map(msg => {
            return <Chathandler key={msg.id} {...msg} />
        })
        */
        //<Addchat isVissible={false} close={()=> this.props.hideChatpopup()} /> 
        
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
      hideChatpopup: () => dispatch(actions.closeAddChat()),
      
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chat);







/*
{isLoading ? (
  <div className="spinner-overlay">
    <div className="spinner" />
  </div>
):
}
*/