
import React from 'react'
import '../App.css';

import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../store/actions/nav';
import * as actionsauth from '../store/actions/auth'
import Addchat from './Popup';
import Cropper from 'react-easy-crop';
import {Modal,Button,ModalBody} from 'react-bootstrap'
import getCroppedImg  from './utils/cropimage'


class Sidepanel extends React.Component{
    constructor(props){
        super(props)
        this.state ={
          chats:[],
          friends:[],
          userContact:[],
          unreadChannelmsg:null,
          openModal:false,
          openCrop:false,
          photoFile:null,
          crop: { x: 0, y: 0 },
          zoom: 1,
          rotation: 0,
          croppedAreaPixels:null,
          cropedImage:null,
          cropedImagefile:null,
          imageShow:false,
          imageDimension:{height:50,width:50},
          profilechatimage:false,
          imagechat:null,
          chatname:null

        }

    }

delteimagerequest = (username,token)=>{
      
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.headers = {
        "Content-Type":"multipart/form-data",
        Authorization: `Token ${token}`
      };
      axios.delete(`http://3.92.68.71/chat/deleteProfileImage/${username}/`)
      .then(res =>{
        
        console.log(res.data)
        this.setState({openModal:false})
        window.location.reload();
        
       
      })
      .catch(e=>{
        console.log(e.response)
      })
    }


deleteProfileImage =()=>{
  this.delteimagerequest(this.props.username,this.props.token)
}

    uploadimagerequest = (username,token)=>{
      const {cropedImagefile} = this.state
      let newImage = new File([cropedImagefile],cropedImagefile.name,{type:cropedImagefile.type});
      let formData = new FormData();
      console.log(newImage)
      formData.append('image',newImage);
      console.log(formData)
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.headers = {
        "Content-Type":"multipart/form-data",
        Authorization: `Token ${token}`
      };
      axios.put(`http://3.92.68.71/chat/updateprofile/${username}/`,formData)
      .then(res =>{
        
        console.log(res.data)
        this.setState({openModal:false})
        window.location.reload();
        
       
      })
      .catch(e=>{
        console.log(e.response)
      })
    }
  
    uploadProfileImage = (e)=>{
      e.preventDefault();
      this.uploadimagerequest(this.props.username,this.props.token)
    }

    handleCropChange = (e) => {
      const file = e.target.files[0];
      console.log(file)
      
      if (file) {
        this.setState({photoFile:URL.createObjectURL(file)})
        this.setState({openCrop:true})
      }
    };


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

    
    getUserChats = (username,token)=>{
        axios.defaults.headers = {
          "Content-Type":"application/json",
          Authorization: `Token ${token}`
        }
        axios.get(`http://3.92.68.71/chat/?username=${username}`)
        .then(res =>{
          console.log(res.data)
          this.setState({
            chats:res.data
          })
        })
    }

    getUserFriends = (username,token)=>{
      axios.defaults.headers = {
        "Content-Type":"application/json",
        Authorization: `Token ${token}`
      }
      axios.get(`http://3.92.68.71/chat/friends/?username=${username}`)
      .then(res =>{
        
        this.setState({
          friends:res.data
        })
      })
      .catch(e=>{
        console.log(e)
      }
        )
  }


  getUserProfile = (username,token)=>{
      axios.defaults.headers = {
        "Content-Type":"application/json",
        Authorization: `Token ${token}`
      }
      axios.get(`http://3.92.68.71/chat/getprofileimage/${username}`)
      .then(res =>{
        console.log(res.data)
        const img = new Image();
        img.src = `${res.data['image']}`
        
        img.onload=()=>{
          console.log(img.height,img.width)
          this.setState({
          imageDimension:{height:img.height,width:img.width}
        })
        }
        img.onerror=(err)=>{
          console.log(err)
        }
        this.setState({
          userContact:res.data
        })
      })
      .catch(e=>{
        console.log(e)
      }
        )
  }

  getunreadChannelmessage = (username,token)=>{
    axios.defaults.headers = {
      "Content-Type":"application/json",
      Authorization: `Token ${token}`
    }
    axios.get(`http://3.92.68.71/chat/unreadchatmessage/${username}/`)
    .then(res =>{
      
      this.setState({
        unreadChannelmsg:res.data.unreadChat
      })
    })
    .catch(e=>{
      console.log(e)
    }
      )
}
  
   inerval=setInterval(() => {
        this.getunreadChannelmessage(localStorage.getItem("username"),localStorage.getItem("token"))
      }, 3000);

  renderUnreadmsgNo = (num)=>{
    if(num>0){
      return(
        <span className="time-meta pull-right chatstyle"><span className='badge' style={{background:"#00bfa5"}}>{num}</span></span>
        
      )
    }
  }

  acceptsFriendRequest = (username,token,sender)=>{
        
      
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type":"application/json",
      Authorization: `Token ${token}`
    };
    axios.put(`http://3.92.68.71/chat/acceptrequest/f${sender}/`,{
      "currentuser": username,
     /*
      "messages": [],
      "chat_name": this.state.channelName,
      "chat_slug": ""
    */
    })
    .then(res =>{
      
      this.props.history(`/${res.data.slug}/`)
      
     
    })
    .catch(e=>{
      console.log(e.response)
    })
  }


  acceptsRequest(sender){
    return event =>{
      event.preventDefault();
      this.acceptsFriendRequest(this.props.username,this.props.token,sender)
    }
  }

  

rejectFriendRequest = (username,token,sender)=>{
        
      
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.headers = {
    "Content-Type":"application/json",
    Authorization: `Token ${token}`
  };
  axios.post(`http://3.92.68.71/chat/rejectrequest/f${sender}/`,{
    "currentuser": username,
   /*
    "messages": [],
    "chat_name": this.state.channelName,
    "chat_slug": ""
  */
  })
  .then(res =>{
    
    this.props.history(`/`)
    
   
  })
  .catch(e=>{
    console.log(e.response)
  })
}

rejectingRequest(sender){
  return event =>{
    event.preventDefault();
    this.rejectFriendRequest(this.props.username,this.props.token,sender)
  }
}


    componentDidMount(){
      if(this.props.username != null && this.props.token != null){
        this.getUserProfile(this.props.username,this.props.token)
        this.getUserChats(this.props.username,this.props.token)
        this.getUserFriends(this.props.username,this.props.token)

      }
    }
    componentWillReceiveProps(newProps){
      if(newProps.username != null && newProps.token != null){
        this.getUserProfile(newProps.username,newProps.token)
        this.getUserChats(newProps.username,newProps.token)
        this.getUserFriends(newProps.username,newProps.token)

      }
    }
   
    openChatPopup(){
      this.props.addChat();
    }
    closeChatPopup(){
      this.props.hideChatpopup();
    }
    dislpayFriends= (data,index)=>{  
        if(data.accepted){
            if(data.sender["user"] !== this.props.username ){
              
              return(
                <div key={data.id} className="row sideBar-body chatstyless">
                <div className="col-sm-3 col-xs-3 sideBar-avatar chatstyless">
                  <div className="avatar-icon chatstyless">
                    {data.sender["image"]? 
                  <img onClick={()=>this.setState({chatname:data.sender["user"],imagechat:data.sender["image"],profilechatimage:true})} src={data.sender["image"]} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
                  
                  </div>
                </div>
                
                <div className="col-sm-9 col-xs-9 sideBar-main chatstyless">
                  <div className="row chatstyless">
                  
                    <div className="col-sm-8 col-xs-8 sideBar-name chatstyless">
                    <NavLink key={data.id} to={`/${data.slug}/`} >
                      <span className="name-meta chatstyle">{data.sender["user"]}
                    </span>
                    </NavLink>
                    <div className="row">
                    
                    </div>
                    </div>
                    
                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time chatstyless">
                    {this.state.unreadChannelmsg && this.renderUnreadmsgNo(this.state.unreadChannelmsg["friend"][index][data.slug])}
                    
                    
                    
                    
                    </div>
                  </div>
                 
                </div>
              </div>
              )
            }else{
              
              return(
                <div key={data.id} className="row sideBar-body chatstyless">
                <div className="col-sm-3 col-xs-3 sideBar-avatar chatstyless">
                  <div className="avatar-icon chatstyless">
                  {data.reciever["image"]? 
                  <img onClick={()=>this.setState({chatname:data.reciever["user"],imagechat:data.reciever["image"],profilechatimage:true})} src={data.reciever["image"]} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
                  
                  </div>
                </div>
                
                <div className="col-sm-9 col-xs-9 sideBar-main chatstyless">
                  <div className="row chatstyless">
                  
                    <div className="col-sm-8 col-xs-8 sideBar-name chatstyless">
                    <NavLink key={data.id} to={`/${data.slug}/`} >
                      <span className="name-meta chatstyle">{data.reciever["user"]}
                    </span>
                    </NavLink>
                    <div className="row">
                    
                      
                    </div>
                    </div>
                    
                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time chatstyless">
                   
                    
                    {this.state.unreadChannelmsg && this.renderUnreadmsgNo(this.state.unreadChannelmsg["friend"][index][data.slug])}
                    
                    </div>
                  </div>
                 
                </div>
              </div>
              )
            }
        }else{
          if(data.sender["user"] !== this.props.username ){
           
            return(
              <div key={data.id} className="row sideBar-body chatstyless">
              <div className="col-sm-3 col-xs-3 sideBar-avatar chatstyless">
                <div className="avatar-icon chatstyless">
                {data.sender["image"]? 
                  <img onClick={()=>this.setState({chatname:data.sender["user"],imagechat:data.sender["image"],profilechatimage:true})} src={data.sender["image"]} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
                </div>
              </div>
              
              <div className="col-sm-9 col-xs-9 sideBar-main chatstyless">
                <div className="row chatstyless">
                
                  <div className="col-sm-8 col-xs-8 sideBar-name chatstyless">
                  <NavLink key={data.id} to={`/f${data.sender["user"]}/`} >
                    <span className="name-meta chatstyle">{data.sender["user"]}
                  </span>
                  </NavLink>
                  <div className="row">
                  
                  <div className="col-xs-6" ><form onSubmit={this.rejectingRequest(data.sender["user"])}><button className='btn btn-link' type='submit'><i className="fa fa-thumbs-down fa-2x  pull-right"  aria-hidden="true"></i></button></form></div>
                      <div className="col-xs-6" ><form onSubmit={this.acceptsRequest(data.sender["user"])}><button className='btn btn-link' type='submit' ><i className="fa fa-thumbs-up fa-2x  pull-right"  aria-hidden="true"></i></button></form></div>
                    
                  </div>
                  </div>
                  
                  <div className="col-sm-4 col-xs-4 pull-right sideBar-time chatstyless">
                    <span className="time-meta pull-right chatstyle">
                  </span>
                  
                  
                  
                  </div>
                </div>
               
              </div>
            </div>
            )
          }
        }
    }
   
    
    render(){
        const chats= this.state.chats
        const friend= this.state.friends
       
        console.log(this.state.unreadChannelmsg)
        
        
        return(
          <>
          
          <div className="col-sm-4 side  ">
          
          <div className="side-one ">
            <div className="row heading chatstyless">
              <div className="col-sm-3 col-xs-3 heading-avatar chatstyless">
                <div className="heading-avatar-icon chatstyless">
                  {this.state.userContact['image']? 
                  <img onClick={()=>this.setState({imageShow:true})} src={`${this.state.userContact['image']}`} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                   }
                  
                </div>
              </div>
              <div className="col-sm-1 col-xs-1  heading-dot  pull-right chatstyless">
                <div className="dropdown">
                    <button className="" type="button" data-toggle="dropdown"><i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i></button>
                    <ul className="dropdown-menu">
                      <li><a onClick={()=>this.setState({openModal:true})} href="#">Edit profile</a></li>
                      <li><a onClick={()=>this.props.logout()}>logout</a></li>
                      
                    </ul>
                </div>
                
              </div>
              <div className="col-sm-2 col-xs-2 heading-compose  pull-right chatstyless">
                <i className="fa fa-comments fa-2x  pull-right" onClick={()=> this.openChatPopup()} aria-hidden="true"></i>
              </div>
            </div>
    
            <div className="row searchBox chatstyless">
              <div className="col-sm-12 searchBox-inner chatstyless">
                <div className="form-group has-feedback chatstyless">
                  <input id="searchText" type="text" className="form-control" name="searchText" placeholder="Search" />
                  <span className="glyphicon glyphicon-search form-control-feedback chatstyless"></span>
                </div>
              </div>
            </div>
            
           
            <div className="row sideBar chatstyless">
              
              { chats && 
              this.state.chats.map((res,index) => (
                
                <div key={res.id} className="row sideBar-body chatstyless">
                  <div className="col-sm-3 col-xs-3 sideBar-avatar chatstyless">
                    <div className="avatar-icon chatstyless">
                    {res.image? 
                  <img onClick={()=>this.setState({chatname:res.chat_name,imagechat:res.image,profilechatimage:true})} src={res.image} />
                  :
                  <img src="https://www.pngitem.com/pimgs/m/148-1489698_the-main-group-group-chat-group-chat-icon.png" />  
                  }
                    </div>
                  </div>
                  
                  <div className="col-sm-9 col-xs-9 sideBar-main chatstyless">
                    <div className="row chatstyless">
                    
                      <div className="col-sm-8 col-xs-8 sideBar-name chatstyless">
                      <NavLink key={res.id} to={`/${res.chat_slug}/`} >
                        <span className="name-meta chatstyle">{res.chat_name}
                      </span>
                      </NavLink>
                      <div className="row">
                     
                      </div>
                      </div>
                      
                      <div className="col-sm-4 col-xs-4 pull-right sideBar-time chatstyless">
                        {this.state.unreadChannelmsg && this.renderUnreadmsgNo(this.state.unreadChannelmsg["channel"][index][res.chat_slug])}
                      
                      
                      
                      
                      </div>
                    </div>
                   
                  </div>
                </div>
                
               
              ))
              }

              { friend && 
              this.state.friends.map((res,index)=>this.dislpayFriends(res,index))

              

              }
             
             
             <Addchat showaddchat={this.props.showaddchat} hide={()=> this.closeChatPopup()} history={this.props.history} />
             <Modal
                  show={this.state.openModal}
                  onHide={()=>this.setState({openModal:false,cropedImage:null})}
                  container={this}
                  aria-labelledby="contained-modal-title"
                  bsSize = "sm"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                      {this.props.username}
                    </Modal.Title>
                  </Modal.Header>
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
                         {this.state.userContact['image']? 
                         <>
                          <img  src={`${this.state.userContact['image']}`} />
                          <a onClick={this.deleteProfileImage} className='text-danger float-start'>Delete photo</a>
                          </>
                          :
                          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                          }
                          </>
                        }
                         
                        
                        
                      </div>
                      
                      </div>
                      
                      <div className='col-xs-9'>
                      
                      <label htmlFor="fileInput" className="custom-file-upload">
                        <input id="fileInput" onChange={this.handleCropChange} type="file" />
                        
                      </label>
                      </div>
                      
                    </div>
                  
                  </ModalBody>
                  <Modal.Footer>
                  {this.state.cropedImage && 
                    <form onSubmit={this.uploadProfileImage}>
                    <button type='submit' className='btn btn-primary'>upload</button>
                    </form>
                     }         
                  </Modal.Footer>
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

{this.state.userContact['image'] && 
                                                                           
<Modal show={this.state.imageShow} onHide={()=>this.setState({imageShow:false})} bsSize = "sm" centered>
  <Modal.Header closeButton>Profile Image</Modal.Header>
       <Modal.Body>
          <img src={`${this.state.userContact['image']}`} alt="Profile" style={{ width: '100%', height: '100%' }} />
        </Modal.Body>
      
    </Modal>
}

<Modal show={this.state.profilechatimage} onHide={()=>this.setState({profilechatimage:false})} bsSize = "sm" centered>
  <Modal.Header closeButton>{this.state.chatname}</Modal.Header>
       <Modal.Body>
          <img src={`${this.state.imagechat}`} alt="Profile" style={{ width: '100%', height: '100%' }} />
        </Modal.Body>
      
    </Modal>




              <Modal
                  show={false}
                 
                  container={this}
                  aria-labelledby="contained-modal-title"
                  bsSize = "sm"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                      {this.props.username}
                    </Modal.Title>
                  </Modal.Header>
                  <ModalBody bsClass={{
                    background: '#333',
                    position: 'relative',
                    height: 400,
                    width: 'auto',
                    minWidth: { sm: 500 },
                  }}>
                  <div className="Appss">
                     <div className="crop-container">
                      
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
                    />

                  </div>
                  </div>
                  
                    
                  </ModalBody>
          
              </Modal>
            </div>
          </div>
    
         
        </div>
          </>
         
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
      addChat: () => dispatch(actions.openAddChat()),
      hideChatpopup: () => dispatch(actions.closeAddChat()),
      logout: () => dispatch(actionsauth.authlogout())
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(Sidepanel);
