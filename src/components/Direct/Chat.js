import React, { useState, useEffect } from 'react';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';
import { useParams } from 'react-router-dom';

const Chat = () => {
  let email = useParams().email
  const [width, setWidth] = useState(window.innerWidth);
  const [index, setIndex] = useState(0);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });

  return (

    <div>
      {
        width > 860 ? (
          <div  style={{ display: 'flex', width: '55%', justifyContent: 'space-around', margin: '0 auto' }}  >
            <div style={{width: '60%', margin: '10px 0px'}} >
              <ChatList email={email} />
            </div>
            <div style={{width: '100%', margin: '10px 0px'}}>
              <ChatRoom email={email} width={width} />
            </div>
            </div>
        ) : (
          <>

            {index === 0 ? <ChatList setIndex={setIndex} email={email} /> : <ChatRoom setIndex={setIndex} email={email} width={width} /> }
          </>
        )
      }

    </div>
  );
};

export default Chat;