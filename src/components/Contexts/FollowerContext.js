import React, { useEffect, useReducer, useState, createContext, useContext } from "react";
import { collection, doc, getDocs, updateDoc, query, where, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../../fire";
import { authContext } from "./AuthContext";

export const followerContext = createContext();
const INIT_STATE = {
  followers: [],
  follow: []
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'GET_FOLLOWERS':
      return { ...state, followers: action.payload.followers, follow: action.payload.follow }
  }
}

const FollowerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const { user, currentUser } = useContext(authContext);
  useEffect(() => {
    if (user?.email) {
      getFollowing()
    }
  }, [user])

  const getFollowing = async () => {
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let user = doc.data()
      dispatch({
        type: 'GET_FOLLOWERS',
        payload: user
      })
    });
  };

  const followUser = async (userToFollow) => {
    try {
      updateDoc(doc(db, "users", currentUser.id), {
        follow: arrayUnion({
          email: userToFollow.email,
          image: userToFollow.image,
          name: userToFollow.name
        })
      })

      updateDoc(doc(db, "users", userToFollow.id), {
        followers: arrayUnion({
          email: currentUser.email,
          image: currentUser.image,
          name: currentUser.name
        })
      })
      return true
    } catch (err) {
      console.log(err, ' error from firebase')
    }
  }

  const removeFollower = async (userObject) => {
    let newFollowers = currentUser.followers.filter(item => item.email != userObject.email);
    const usersRef = doc(db, 'users', currentUser.id);
    await setDoc(usersRef, { followers: newFollowers }, { merge: true });

    const q = query(collection(db, "users"), where("email", "==", userObject.email));
    let user;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      user = { ...doc.data(), id: doc.id }
    });
    let hisFollowers = user.follow.filter(item => item.email != currentUser.email);

    const userToRemove = doc(db, 'users', user.id);
    setDoc(userToRemove, { follow: hisFollowers }, { merge: true });
  }


  const unFollowing = async (userObject) => {
    let newFollowers = currentUser.follow.filter(item => item.email != userObject.email);
    const usersRef = doc(db, 'users', currentUser.id);
    await setDoc(usersRef, { follow: newFollowers }, { merge: true });


    const q = query(collection(db, "users"), where("email", "==", userObject.email));
    let user;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      user = { ...doc.data(), id: doc.id }
    });
    let hisFollowers = user.followers.filter(item => item.email != currentUser.email);

    const userToRemove = doc(db, 'users', user.id);
    return await setDoc(userToRemove, { followers: hisFollowers }, { merge: true });
  }



  const values = {
    followers: state.followers,
    follow: state.follow,
    getFollowing,
    followUser,
    removeFollower,
    unFollowing,
  };

  return <followerContext.Provider value={values}>{children}</followerContext.Provider>
}

export default FollowerContextProvider;