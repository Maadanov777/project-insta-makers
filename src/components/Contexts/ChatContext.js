import { useReducer, createContext, useEffect, useState } from "react";
import { 
  collection, doc, 
  getDocs, updateDoc, 
  onSnapshot, addDoc, 
  query, where, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../fire";

export const chatContext = createContext();
const INIT_STATE = {
  messages: [],
  user1: '',
  user2: '',
  id: '',
  myChats: []
};

const reducer = (state = INIT_STATE, action) => {
  switch(action.type) {
    case 'GET_MESSAGES': {
      return {...state, id: action.payload.id, messages: action.payload.messages, user1: action.payload.user1, user2: action.payload.user2}
    }
    case 'GET_MY_CHATS': {
      return {...state, myChats: action.payload}
    }
  }
};

const ChatContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const getChatDoc = async (query) => {
    let result = null
    const querySnapshot = await getDocs(query)
    querySnapshot.forEach(doc => {
      result = {id: doc.id, ...doc.data()}
    })

    if (result) {
      dispatch({
        type: 'GET_MESSAGES',
        payload: result
      })
    }
    return result;
  }

  const checkChatRoom = async (currentUser, email) => {
    const q1 = query(collection(db, "chat"), where("user1", "==", currentUser), where("user2", "==", email));
    const q2 = query(collection(db, "chat"), where("user1", "==", email), where("user2", "==", currentUser));
    let result = await getChatDoc(q1) 
    if (!result) {
      result = await getChatDoc(q2)
    } 

    if (!result) {
      const addedDocRef = await addDoc(collection(db, "chat"), {
        messages: [],
        user1: currentUser,
        user2: email
      });

      dispatch({
        type: 'GET_MESSAGES',
        payload: {
          messages: [],
          user1: currentUser,
          user2: email,
          id: addedDocRef.id
        }
      })
    }
  }

  const sendMessage = async (msg, currentUser) => {
    const chatRef = doc(db, "chat", state.id);
    await updateDoc(chatRef, {
        messages: arrayUnion({
          message: msg,
          author: currentUser,
          date: new Date(),
          msgId: Date.now() + '' + currentUser + '' + msg
        })
    });
  }
  useEffect(() => {
    let unsub = () => console.log('start listening');
    if (state.id) {
      unsub = onSnapshot(doc(db, "chat", state.id), (doc) => {
        console.log("new new new data: ", doc.data());
        dispatch({
          type: 'GET_MESSAGES',
          payload: {id: state.id, ...doc.data()}
        })
      });
    }
    return (() => {
      unsub()
    })
  }, [state.id])

  const getUsersChats = async (currentUser) => {
    const q1 = query(collection(db, "chat"), where("user1", "==", currentUser));
    const q2 = query(collection(db, "chat"), where("user2", "==", currentUser));
    let res1 = await getDocs(q1);
    let res2 = await getDocs(q2);
    let result = [];
    res1.forEach(doc => {
      result.push({id: doc.id,...doc.data()})
    })
    res2.forEach(doc => {
      result.push({id: doc.id,...doc.data()})
    })
    dispatch({
      type: 'GET_MY_CHATS',
      payload: result
    })
  }

  const values = {
    checkChatRoom,
    sendMessage,
    messages: state.messages,
    myChats: state.myChats,
    getUsersChats
  }

  return <chatContext.Provider value={values}>{children}</chatContext.Provider>
}

export default ChatContextProvider
