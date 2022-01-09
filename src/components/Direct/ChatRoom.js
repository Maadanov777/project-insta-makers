import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authContext } from '../Contexts/AuthContext';
import { chatContext } from '../Contexts/ChatContext';
import './ChatRoom.css'
import InputEmoji from 'react-input-emoji'

const ChatRoom = ({email, width, setIndex}) => {
    const [msg, setMsg] = useState('');
    const { currentUser, userList } = useContext(authContext);
    const { checkChatRoom, sendMessage, messages } = useContext(chatContext);
    const ref = useRef(null)
    const scroll = (x) => {
        ref.current.scrollTop = 10000
        console.dir(ref.current);
    }
    let user = useParams().email

    useEffect(() => {
      if (currentUser.email) {
        checkChatRoom(currentUser.email, email)
      }
    }, [currentUser, user])
   
    const handleInput = (msg) => {
      setMsg(msg)
    } 

    const [friend, setFriend] = useState(false);

    useEffect(() => {
        if(userList?.length > 0) {
            const currFriend = userList.find(item => item.email === user)
            setFriend(currFriend)
        }
    }, [userList])

    return (
        <div className='chatRoom1'>
            <div ref={ref} className='chatRoom' style={{width: '100%', height: '85vh', overflowX: 'scroll'}}>
            <div className='chatRoom-header'>
            { width < 860 ? (
                <p style={{marginRight: '25px'}} onClick={() => setIndex(0)} > Назад </p>
            ) : (
                <></>
            ) }
                        <div className='chatRoom-header-email' style={{display: 'flex', alignItems: 'center'}}>
                             <img src={friend ? friend.image : ''}  style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} /> 
                             <p style={{paddingLeft: '10px'}} >{user}</p>
                        </div>
            </div>
                {
                    messages.map(msg => (
                        <div key={msg.date} style={{width: '100%'}}> 
                            {currentUser.email === msg.author ? 
                            <div style={{width: '100%'}}>
                                <div style={{display: 'flex', justifyContent: 'right'}}>
                                        <div className="friend-text-container">
                                            <div className="my-text">{msg.message}</div>
                                        </div>
                                </div>
                            </div>
                             :  <div key={msg.date} style={{width: '100%'}}>
                             <div style={{display: 'flex', justifyContent: 'left'}}>
                                     <div className="my-text-container">
                                            <div className ="friend-text">{msg.message}</div>
                                     </div>
                             </div>
                         </div>}
                        </div>
                    ))
                }
            </div>
            <div className="chatRoom-input ">
                <input
                    value={msg}
                    onChange={(e) => handleInput(e.target.value)}
                />
                {
                    msg ? (
                        <button className="chatRoom-button" onClick={async() => {
                            await sendMessage(msg, currentUser.email)
                            scroll(300)
                            setMsg('')
                        }}>Отправить</button>
                    ) : (
                        <button className="chatRoom-button" style={{color: 'gray'}} >Отправить</button>
                    )
                }
                
            </div>
        </div>
        
    );
};

export default ChatRoom;

