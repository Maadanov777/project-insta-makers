import React, { useContext, useEffect, useState } from 'react';
import Modal from "@material-ui/core/Modal";
import './PostCard.css'
import { Link } from 'react-router-dom'
import InputEmoji from 'react-input-emoji'

import SaveIcon from '../PostCard/cards-icons/save-icon.png'
import SendIcon from '../PostCard/cards-icons/send-icon.png'
import Heart from '../../../assets/images/heart.png'
import HeartLike from '../../../assets/images/heart-like.png'
import CommentsIcon from '../PostCard/cards-icons/comments-icon.png'
import { postContext } from '../../Contexts/PostContext';
import { authContext } from '../../Contexts/AuthContext';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { Button, Typography } from '@mui/material';
import { borderRadius, Box } from '@mui/system';
import { followerContext } from '../../Contexts/FollowerContext';

const PostCard = ({ post }) => {
    const { commentAdd, addLike, getLikeUser, like, getPosts, removeLike } = useContext(postContext)
    const { unFollowing, followUser } = useContext(followerContext);
    const { currentUser, getRecommends, getUser } = useContext(authContext)
    const [comment, setComment] = useState('')
    const [userLike, setuserLike] = useState(like)
    const [commentOpen, setCommentOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [followList, setFollowList] = useState([]);
    const [postComments, setPostComments] = useState(post.comments);
    const [likeModal, setLikeModal] = useState(false)
    const [liked, setLiked] = useState(false);

    async function handleLike(id) {
        await addLike(post)
        await getLikeUser(id)
        getPosts(currentUser)
    }

    async function handleUnlike(id) {
        await removeLike(post);
        getPosts(currentUser)
    }

    const toUnfollow = async (user) => {
        await unFollowing(user).then(async () => {
            getUser().then(() => {
                setOpen(false);
            })
        })
    }

    useEffect(() => {
        getPosts(currentUser);
        setFollowList(currentUser.follow)
        getRecommends();
    }, [currentUser])

    const unFollowInLike = async (userObject) => {
        await unFollowing(userObject).then(async () => {
            const arr = [];
            followList.forEach(item => {
                if (item.email !== userObject.email) {
                    arr.push(item);
                }
            })
            setFollowList(arr);
        })
    }

    const toFollowUser = async (userObject) => {
        await followUser(userObject).then(() => {
            const arr = [...followList];
            arr.push(userObject)
            setFollowList(arr);
        })
    }

    const handleSendComment = (comment, post) => {
        commentAdd(comment, post).then((result) => {
            const arr = [...postComments];
            arr.push({
                email: currentUser.email,
                image: currentUser.image,
                comment: comment,
                name: currentUser.name
            })
            setPostComments(arr)
            setComment('')
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        backgroundColor: 'white',
        borderRadius: 3,
        outline: 'none',
    };
    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%',
        height: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        backgroundColor: 'white',
        borderRadius: 3,
        outline: 'none',
        display: 'flex'
    }
    return (
        <div className="postCard" key={post.date}>
            <div className="postCard__header">
                <div className='postCard__photo-user'>
                    <img src="https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG98ZW58MHx8MHx8&w=1000&q=80" />
                    <p>{post.name}</p>
                </div>
                <div onClick={() => setOpen(true)} className="postCard__options">
                    <svg aria-label="More options" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                </div>
            </div>
            <div className="postCard-img">
                <img src={post.image} />
            </div>
            <div className="postCard-like">
                <div className="postCard-like-buttons">
                    {post.likes.some(item => item.email === currentUser.email) ? (
                        <svg  onClick={() => handleUnlike(post.id)} aria-label="Unlike" class="_8-yf5 " color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                    )
                     : (
                        <svg  onClick={() => handleLike(post.id)} aria-label="Like" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
                    ) 
                    }
                    <svg onClick={() => setCommentOpen(true)} aria-label="Comment" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>

                    <svg aria-label="Share Post" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                </div>
                <div className="postCard-like-favorites">
                <svg aria-label="Save" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                </div>
            </div>
            <div className="postCard-comments">
                <div className="count-likes" onClick={() => setLikeModal(true)} >
                    <p><span>{post.likes.length} </span>отметок "Нравится"</p>
                </div>
                <div className="" >
                    <p style={{fontWeight: '100', color: 'rgb(48,48,48)'}} ><span style={{fontWeight: 'bold', color: 'black'}} >{post.name} </span>{post.text}</p>
                </div>
                <div style={{cursor: 'pointer'}} >
                    { post.comments.length > 0 ? <p onClick={() => setCommentOpen(true)} style={{color: 'gray'}} >Посмотреть все комментарии ({post.comments.length}) </p>  : <></>}
                </div>
                <div className="postCard-comments-text">
                    {postComments[postComments.length - 1]?.name ? <> <span>{postComments[postComments.length - 1]?.name}: </span><span>{postComments[postComments.length - 1]?.comment}</span> </> : null}
                </div>
                <div className="time-post">
                    <p style={{fontSize: '15px', color: 'gray'}} >{new Date(post.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
            </div>
            <div className="postCard-addComments">
                <div className="comment-input">
                    {/* <input
                        type="text"
                        placeholder="Add comment..."
                    /> */}
                    <InputEmoji
                        value={comment}
                        onChange={(e) => setComment(e)}
                        cleanOnEnter
                        placeholder="Добавьте комментарий..."
                        borderColor='white'
                    />
                    {
                        comment ? (
                            <button id='commentSetButton' onClick={() => handleSendComment(comment, post)}>
                                Опубликовать
                            </button>
                        ) : (
                            <button id='commentSetButton' style={{color: '#0094f67c'}}>
                                Опубликовать
                            </button>
                        )
                    }
                   
                </div>
            </div>
            <div>
                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <Box sx={style} >
                        <Typography style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 50px', borderBottom: '0.1px solid rgb(189, 189, 189)' }} id="modal-modal-description" sx={{ mt: 1 }}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`user/profile/${post?.email}`} >
                                Профиль
                            </Link>
                        </Typography>
                        <Typography style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 50px', borderBottom: '0.1px solid rgb(189, 189, 189)' }} id="modal-modal-description" sx={{ mt: 1 }}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`chats/${post?.email}`} >
                                Сообщения
                            </Link>
                        </Typography>
                        <Typography style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold', textAlign: 'center', padding: '12px 50px', borderBottom: '0.1px solid rgb(189, 189, 189)' }} id="modal-modal-description" sx={{ mt: 1 }}>
                            <div onClick={() => toUnfollow(post)} >
                                Отписаться
                            </div>
                        </Typography>
                        <Typography style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 50px' }} onClick={() => setOpen(false)} id="modal-modal-description" sx={{ mt: 1 }}>
                            Отмена
                        </Typography>
                    </Box>
                </Modal>
            </div>
            <div>
                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal
                    open={likeModal}
                    onClose={() => setLikeModal(false)}
                >
                    <Box id='boxModal' sx={style} >
                        <Typography style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 50px', borderBottom: '0.1px solid rgb(189, 189, 189)' }} id="modal-modal-description" sx={{ mt: 1 }}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`user/profile/${post?.email}`} >
                                Отметки "Нравится"
                            </Link>
                        </Typography>
                        <div style={{ maxHeight: '300px', overflowY: 'scroll' }} >
                            {
                                post.likes.map((like, i) => (
                                    <div className='like-container' key={like.email} >
                                        <div className='user-like' >
                                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`user/profile/${like.email}`} >
                                                <img className={'img-user-like'} src={like.image} />
                                            </Link>
                                            <div style={{ paddingLeft: '10px' }} >
                                                <Link style={{ textDecoration: 'none', color: 'black' }} to={`user/profile/${like.email}`} >
                                                    {like.name}
                                                    <div style={{ fontSize: '14px', color: 'rgb(150, 150, 150)' }} >{like.email} </div>
                                                </Link>
                                            </div>
                                        </div>
                                        {/* { currentUser.email === like.email ? <></> : followList.find(user => user.email === like.email ) ? <button onClick={() => unFollowInLike(like)} className='like-user-follow' >Отписаться</button> : <button onClick={() => toFollowUser(like)} className='like-user-follow' >Подписаться</button> } */}
                                    </div>
                                ))
                            }
                        </div>
                    </Box>
                </Modal>
            </div>
            <div>
                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal
                    open={commentOpen}
                    onClose={() => setCommentOpen(false)}
                >
                    <Box id='commentModalBox' sx={style1} >
                        <img src={post.image} className={'post-modal-image'}  />
                        <div id={'commentBoxWidth'}  >
                            <div >
                                <Typography style={{ cursor: 'pointer', padding: '10px', borderBottom: '0.1px solid rgb(189, 189, 189)' }} id="modal-modal-description" sx={{ mt: 1 }}>
                                    <Link style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center' }} to={`user/profile/${post?.email}`} >
                                         <img src={post.userAvatar} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} /> 
                                         <div style={{paddingLeft: '10px'}} >
                                             {post.name}
                                             <div style={{fontSize: '13px', color: 'gray'}} >
                                                 {post.email}
                                             </div>
                                        </div>
                                    </Link>
                                </Typography>
                            </div>
                            <div id='commentSectionBox' style={{padding: ' 0px 15px', overflowY: 'scroll'}} >
                                {postComments.map((item, i) => (
                                    <p key={item.comment + ' ' + i} style={{display: 'flex', alignItems: 'center'}} > <img src={item.image} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />  <span>
                                        <div style={{paddingLeft: '10px'}} >
                                             <span style={{marginRight: '20px', fontWeight: 'bold'}} > {item.name} </span> <span  > {item.comment} </span>
                                             {/* <div style={{fontSize: '13px', color: 'gray'}} >
                                                 {item.email}
                                             </div> */}
                                        </div>
                                    </span></p>
                                ))}
                            </div>

                            <div className="postCard-like">
                                <div className="postCard-like-buttons">
                                    {liked ? (
                                        <>
                                            <svg onClick={() => { 
                                                handleUnlike(post.id) 
                                                setLiked(false)
                                            }} aria-label="Unlike" class="_8-yf5 " color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                        </>
                                    )
                                    : (
                                        <>
                                            <svg onClick={() => {
                                                handleLike(post.id)
                                                setLiked(true)
                                            }} aria-label="Like" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
                                        </>
                                    ) 
                                    }
                                    <svg onClick={() => setCommentOpen(true)} aria-label="Comment" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>

                                    <svg aria-label="Share Post" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                                </div>
                                <div className="postCard-like-favorites">
                                <svg aria-label="Save" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                                </div>
                            </div>
                            <div style={{padding: '0px 12px'}} >
                                <div className="count-likes" onClick={() => setLikeModal(true)} >
                                    <p><span>{post.likes.length} </span>отметок "Нравится"</p>
                                </div>
                                <div className="time-post">
                                    <p style={{fontSize: '15px', color: 'gray'}} >{new Date(post.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="postCard-addComments" >
                                <div className="comment-input">
                                    <InputEmoji
                                        value={comment}
                                        onChange={(e) => setComment(e)}
                                        cleanOnEnter
                                        placeholder="Добавьте комментарий..."
                                        borderColor='white'
                                    />
                                    {
                                        comment ? (
                                            <button id='commentSetButton' onClick={() => handleSendComment(comment, post)}>
                                                Опубликовать
                                            </button>
                                        ) : (
                                            <button id='commentSetButton' style={{color: '#0094f67c'}}>
                                                Опубликовать
                                            </button>
                                        )
                                    }
                                
                                </div>
                            </div>
                            {/* <Typography style={{ cursor: 'pointer', textAlign: 'center', padding: '12px 50px' }} onClick={() => setCommentOpen(false)} id="modal-modal-description" sx={{ mt: 1 }}>
                                Отмена
                            </Typography> */}
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>


    );
};

export default PostCard;