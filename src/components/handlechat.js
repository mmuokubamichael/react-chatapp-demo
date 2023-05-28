import React from 'react'


const Chathandler = (props)=>{

  const chatTime = new Date(props.timestamp);
  const currentTime = new Date();
  const timeDiff = (currentTime.getTime() - chatTime.getTime()) / 1000; // convert to seconds

  let timeString = '';
  if (timeDiff < 60) {
    timeString = `${Math.round(timeDiff)} seconds ago`;
  } else if (timeDiff < 60 * 60) {
    timeString = `${Math.round(timeDiff / 60)} minutes ago`;
  } else if (timeDiff < 60 * 60 * 24) {
    timeString = `${Math.round(timeDiff / (60 * 60))} hours ago`;
  } else if (timeDiff < 60 * 60 * 24 * 7) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    timeString = daysOfWeek[chatTime.getDay()];
  } else {
    timeString = chatTime.toLocaleDateString();
  }
    
  
  if (props.author === props.user){
      return(
        
      <div className="row message-body chatstyless">
        
        <div className="col-sm-12 message-main-sender chatstyless">
        
        <div className="sender chatstyless">
        
          <div className="message-text chatstyless" style={{color: 'green'}} >
              <strong>you</strong>
          </div>
          {props.repliedChatUser && 
                <div style={{color:"#3d4e03",background:"#d1cdcd"}} className="message-reply">
                <strong>{props.repliedChatUser}</strong>
                <p>{props.repliedChat.length <= 100 ? (props.repliedChat) :
                  <span >{props.repliedChat.slice(0,100)}...</span>
                  }</p>
            </div>
          }
          <div style={{color:"#3d4e03"}} className="message-text chatstyless">
            {props.content}
          </div>
          <span className="message-time pull-right chatstyless">
            {timeString}
          </span>
          <i onClick={()=>props.replying(props.content,"you",props.id)} className="fa fa-reply fa-1x"></i>
        </div>
        
      </div>
        
      <br />
    </div>
    
    
      )
      
  }else{
      return(<>
 <div className="row message-body chatstyless">
      <div className="col-sm-12 message-main-receiver chatstyless">
      
        <div className="receiver chatstyless">
          <div className="message-text chatstyless" style={{color: 'green'}} >
              <div className="heading-avatar-icon chatstyless">
              {props.prof_image? 
                  <img src={`${props.prof_image}`} />
                  :
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />  
                  }
                  <strong>{props.author}</strong>
                </div>
              
          </div>
          {props.repliedChatUser && 
                <div style={{color:"#3d4e03",background:"#d1cdcd"}} className="message-reply">
                <strong>{props.repliedChatUser}</strong>
                <p>{props.repliedChat.length <= 100 ? (props.repliedChat) :
                  <span >{props.repliedChat.slice(0,100)}...</span>
                  }</p>
            </div>
          }
          
          <div style={{color:"#3d4e03"}} className="message-text chatstyless">
              {props.content}
          </div>
          <span className="message-time pull-right chatstyless">
          {timeString}
          </span>
          <i onClick={()=>props.replying(props.content,props.author,props.id)} className="fa fa-reply fa-1x"></i>
        </div>
       
      </div>
      
    </div>
    <br />
      </>
         
      )
      

      
      
  }
          
           /*
            return(
                <div className="row message-body">
                <div className="col-sm-12 message-main-sender">
                  <div className="sender">
                    <div className="message-text" style={{color: 'green'}} >
                        you
                    </div>
                    <div className="message-text">
                      mjjjjjjjjj
                    </div>
                    <span className="message-time pull-right">
                      Sun
                    </span>
                  </div>
                </div>
              </div>
                )
                */
    
        }
export default Chathandler;