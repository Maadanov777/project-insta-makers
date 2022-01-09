import React, { useEffect, useState } from 'react';
import { 
  collection, doc, 
  getDocs, updateDoc, 
  onSnapshot, addDoc, 
  query, where, arrayUnion, getDoc } from "firebase/firestore";
  import { db } from "../../fire";

const ChatListLi = ({chat}) => {

  const [msgs, setMsgs] = useState(chat.messages);

  useEffect(() => {
    let unsub = () => console.log('start listening');
    if (chat?.id) {
      unsub = onSnapshot(doc(db, "chat", chat.id), (doc) => {
        setMsgs(doc.data().messages)
      });
    }
    return (() => {
      unsub()
    })
  }, [chat.id])


  return (
    <div style={{paddingTop: '10px', fontSize: '13px', color: 'gray'}} >
      {msgs.length > 0 && msgs[msgs.length - 1].message}
    </div>
  );
};

export default ChatListLi;