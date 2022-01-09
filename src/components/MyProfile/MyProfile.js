import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../Contexts/AuthContext';
import { postContext } from '../Contexts/PostContext';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';
import './MyProfile.css'


const MyProfile = () => {
    const {posts, getPosts, userPosts, getUserPosts} = useContext(postContext)
    const {user, currentUser, getUser} = useContext(authContext)
    const [followersModal, setFollowersModal] = useState(false);
    const [followingModal, setFollowingModal] = useState(false);

    useEffect(() => {
        getPosts(currentUser)
        getUserPosts(user.email)
     }, [user])

    return (
            <div style={{position: 'relative'}} >
                <div className="userProfile__header">
                    <div className='container'>
                        <div className="userProfile__header">
                            <div className="userProfile__img">
                                    <img id="img-profile" src={currentUser?.image ? currentUser.image : 'https://uoks.ru/sites/default/files/2020-12/zero.jpg'}></img>
                            </div>
                            <div>
                                <div className="userProfile__header-name">
                                    <p>{currentUser?.name}</p>
                                    <div className="userProfile__header-button">
                                        <button id="follow">Редактировать</button>
                                        <button id="details">...</button>
                                    </div>
                                </div>
                                <div className="userProfile__header-follow">
                                    <p><span>{userPosts.length} </span>публикаций</p>
                                    <p onClick={() => setFollowersModal(true)} ><span>{currentUser?.followers ? currentUser.followers.length : null}</span> подписчиков</p>
                                    <p onClick={() => setFollowingModal(true)}><span>{currentUser?.follow ? currentUser.follow.length : null}</span> подписок</p>
                                </div>
                                <div className="userProfile__header-info">
                                    <p>Cristiano Ronaldo</p>
                                    <p>www.cristianoronaldo.com</p>
                                </div>
                            </div>
                        </div>
                        
                            <div className="userProfile__publication-p">
                            {userPosts?userPosts.map(elem => (
                                <div className="userProfile__publication-img">
                                    <img src={elem.image}></img>
                                 </div>
                            )): null}
                            </div>
                        </div>
                </div>

                {
                    followersModal && <FollowerList followersModal={followersModal} setFollowersModal={setFollowersModal} followers={currentUser?.followers} />
                }
                {
                    followingModal && <FollowingList followingModal={followingModal} setFollowingModal={setFollowingModal} following={currentUser?.follow} />

                }
               
            </div>);
};

export default MyProfile;