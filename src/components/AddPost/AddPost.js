import React, { useContext, useEffect, useState } from 'react';
import './AddPost.css'
import ImageUploading from 'react-images-uploading'
import { postContext } from '../Contexts/PostContext';
import { authContext } from '../Contexts/AuthContext';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../../fire';

const AddPost = () => {
let {posts, getPosts, addNewPost} = useContext(postContext)
const {user, currentUser} = useContext(authContext)
const [myPost, setMyPost] = useState([])
const [image, setImage] = useState('')
const [text, setText] = useState('')
const postsCollection = collection(db, 'posts')


useEffect(() => {
    getPosts(currentUser)
},[])

function getMyPost() {
    let myPosts = posts.filter(item => item.email === user.email)
    setMyPost(myPosts)
 }

 useEffect(() => {
    getMyPost()
 }, [posts])

function handleAdd() {
    let obj = {
        image,
        comments:[],
        likes: [],
        date: Date.now(),
        email: user.email,
        name: currentUser.name,
        text,
        userAvatar: currentUser.image
    }
    addDoc(postsCollection, obj)
}
    return (
       <div>
           <input placeholder='IMAGE' name="image" onChange={(e) => setImage(e.target.value)}/>
           <input name="text" onChange={(e) => setText(e.target.value)}/>
           <button onClick={handleAdd}>ADD</button>
       </div>
    );
};

export default AddPost;