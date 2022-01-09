import axios from "axios";
import React, {useEffect, useReducer, useState, createContext} from "react";
import { db } from "../../fire";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where
} from "firebase/firestore";

export const authContext = createContext();

const INIT_STATE = {
  userId: "",
  userList: [],
  currentUser: {},
  recommends: [],
  userDetail: {}
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "GET_USERS": 
      return { ...state, currentUser: action.payload.currentUser, userList: action.payload.userList }
    case "GET_RECOMMENDS": 
      return { ...state, recommends: action.payload }
    case "GET_USER_DETAIL":
      return {...state, userDetail: action.payload}
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState("");
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  const auth = getAuth();
  const usersCollection = collection(db, "users");

  const admins = ["maadanov01@gmail.com"];

  async function getRecommends(){
    if (state.currentUser?.email) {
      let recommendedUser = [];
      state.currentUser.follow.forEach((user, index) => {
        if (index > 8) {
          return
        }
        recommendedUser.push(user.email);
      })
      const q = await query(collection(db, "users"), where('email', 'not-in', [state.currentUser.email, ...recommendedUser]));
      let data = await getDocs(q);
      let arr = await data.docs.map(doc =>{
        return {...doc.data(), id: doc.id} 
      })
      dispatch({
        type: 'GET_RECOMMENDS',
        payload: arr
      })
    }
  }

  async function getUser() {
    if (user) {
      console.log(user)
      let data = await getDocs(usersCollection);
      const userList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const currentUser = userList.filter((item) => item.email === user.email)[0];
      console.log(userList)
      dispatch({
        type: "GET_USERS",
        payload: {userList, currentUser}
      })
    } 
  }

  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    getRecommends()
  }, [state.currentUser])

function setUserData(){
    let obj = {
        followers: [],
        follow: [],
        image: '',
        name: userName,
        email,
    }
    addDoc(usersCollection, obj).catch(err => console.log(err))
 }

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogIn = () => {
    clearErrors();
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setEmailError(error.message);
          break;
        case "auth/wrong-password":
          setPasswordError(error.message);
          break;
        default:
          return;
      }
    });
  };



  const handleSignUp = () => {
    clearErrors();
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      switch (error.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          console.log('oldu 1')
          setEmailError(error.message);
          break;
        case "auth/weak-password":
          console.log('oldu 2')
          setPasswordError(error.message);
          break;
        default:
          return;
      }
    });
    setUserData()
  };

  const handleLogOut = () => {
    console.log('logged out')
    signOut(auth).then(err => console.log(err, ' then')).catch(err => console.log(err))
  };

  const authListener = async () => {
    let loggedin = false;
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        clearInputs()
        setUser(user)
        for (let adminEmail of admins) {
          if (user.email === adminEmail) {
            setIsAdmin(true)
            loggedin = true
          }
        }
      } else {
        setUser('')
        setIsAdmin(false)
        loggedin = false
      }
    })
    return loggedin
  }

  useEffect(() => {
    authListener()
  }, [])

  function resetPassword() {
    return sendPasswordResetEmail(auth, email)
    .then(() => {
      alert( 'Проверьте почту')
    })
    .catch((e) => {
      alert('Неправильный e-mail')
    })
  }

  const getByID = async (email) => {
    const userDetail = await state.userList.filter(item => item.email === email)
    setUserDetail(userDetail[0])
  }



  const values = {
    email,
    user,
    password,
    userName,
    setUserName,
    handleLogOut,
    handleLogIn,
    handleSignUp,
    setEmail,
    setPassword,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
    favorites: state.favorites,
    // userId: state.userId,
    isAdmin,
    // addProductToFavorites,
    // getProductToFavorites,
    // removeFavorites,
    resetPassword,
    authListener,
    currentUser: state.currentUser,
    userList: state.userList,
    getUser,
    recommends: state.recommends,
    getByID,
    userDetail,
    getRecommends
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export default AuthContextProvider;
