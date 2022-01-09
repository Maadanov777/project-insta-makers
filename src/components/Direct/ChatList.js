import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../Contexts/AuthContext';
import { chatContext } from '../Contexts/ChatContext';
import ChatListLi from './ChatListLi';

const ChatList = ({email, setIndex}) => {

  const { currentUser, userList } = useContext(authContext);
  const { messages, myChats, getUsersChats, checkChatRoom } = useContext(chatContext)
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    if (currentUser?.email){
      getUsersChats(currentUser.email)
    }
  }, [currentUser.email])

  return (
    <div style={{background: 'white'}} >
      <div className='chatRoom-header' style={{borderLeft: '0.1px solid rgb(214, 214, 214)', borderTop: '0.1px solid rgb(214, 214, 214)', marginBottom: '0px'}}>
          <div className='chatRoom-header-email' style={{display: 'flex', alignItems: 'center'}}>
               <img src={currentUser ? currentUser.image : ''}  style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} /> 
               <p style={{paddingLeft: '10px'}} >{currentUser?.email}</p>
          </div>
      </div>
      <div style={{borderLeft: '0.1px solid rgb(214, 214, 214)',   borderBottom: '0.1px solid rgb(214, 214, 214)', height: '83.5vh', overflowY: 'scroll'}} > 
      {
        myChats.map(item => (
          <div onClick={() => {
            setIndex ? setIndex(1) : console.log('here')
          }} key={item.id} style={{padding: '15px', backgroundColor: (item.user1 === currentUser.email ? item.user2 : item.user1) === email ? '#ececec' : '' }} >
            <Link style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black'}} to={`/chats/${item.user1 === currentUser.email ? item.user2 : item.user1}`} > 
              <img src={userList?.length > 0 && userList.find(r => r.email === (item.user1 === currentUser.email ? item.user2 : item.user1)).image} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px'}}  /> 
               <p>{item.user1 === currentUser.email ? item.user2 : item.user1}
                  <ChatListLi chat={item} />
               </p>
            </Link>
          </div>
        ))
      }
      </div>

    </div>
  );
};

export default ChatList;