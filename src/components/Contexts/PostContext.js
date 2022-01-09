import { arrayUnion, collection, doc, getDocs, onSnapshot, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import React, {useEffect, useReducer, useState, createContext, useContext} from "react";
import { db } from "../../fire";
import { authContext } from "./AuthContext";
import { followerContext } from "./FollowerContext";

export const postContext = createContext();
const INIT_STATE = {
  posts: [],
  userPosts: [],
  like: {}
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'GET_POSTS':
        return { ...state, posts: action.payload }
    case 'GET_USER_POSTS':
      return { ...state, userPosts: action.payload}
    case 'GET_LIKE':
      return { ...state, like: action.payload}
    default:
      return state;
  }
};



const PostContextProvider = ({ children }) => {
const { user, currentUser } = useContext(authContext)
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  async function getPosts (currUser) {
    if (currUser?.email) {
      const posts = []
      if(currUser.follow.length > 0) {
      let followedUser = []; 
      currUser.follow.forEach((u, index) => {
        if (index > 9){
          return;
        }
        followedUser.push(u.email)
      });
      
      let q = await query(collection(db, "posts"), where("email", "in",  followedUser));
      const data = await getDocs(q) 
      data.forEach(item => posts.push({ ...item.data(), id: item.id }))
      console.log(posts)
      dispatch({
          type: 'GET_POSTS',
          payload: posts
      })
    }
      }
}

async function getUserPosts (email) {
  if (email) {
    const userPosts = []
    const q = await query(collection(db, "posts"), where("email", "==", email));
    const data = await getDocs(q) 
    data.forEach(item => userPosts.push({ ...item.data(), id: item.id }))
    dispatch({
        type: 'GET_USER_POSTS',
        payload: userPosts
    })
  }
}

const commentAdd = (comment, post) => {
   return updateDoc(doc(db, "posts", post.id), {
    comments: arrayUnion({ 
      email: currentUser.email,
      image: currentUser.image,
      comment: comment,
      name: currentUser.name
    })
  })
}

const addLike = (post) => {
  updateDoc(doc(db, "posts", post.id), {
    likes: arrayUnion({ 
      email: currentUser.email,
      image: currentUser.image,
      name: currentUser.name,
      id: currentUser.id
    })
  })
}

const removeLike = (post) => {
  updateDoc(doc(db, "posts", post.id), {
    likes: post.likes.filter(item => item.email !== currentUser.email)
  })
}

const getLikeUser = async (id) => {
  let postLike = await state.posts.filter(item => item.id === id)
  let im = await postLike[0].likes.filter(item => item.email === currentUser.email)
  dispatch({
    type: 'GET_LIKE',
    payload: im
  })
}


  const values = {
    getPosts,
    getUserPosts,
    userPosts: state.userPosts,
    posts: state.posts,
    user,
    commentAdd,
    addLike,
    getLikeUser,
    like: state.like,
    removeLike
  };

  return <postContext.Provider value={values}>{children}</postContext.Provider>;
};

export default PostContextProvider;
