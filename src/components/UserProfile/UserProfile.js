import React, { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authContext } from '../Contexts/AuthContext';
import { postContext } from '../Contexts/PostContext';
import './UserProfile.css';

const UserProfile = () => {
    const {userPosts, getUserPosts} = useContext(postContext)
    const {getByID, userDetail, userList} = useContext(authContext)
    let email = useParams().email

    useEffect(() => {
        getUserPosts(email)
    }, [])

    useEffect(() => {
        if (userList.length > 0) {
            getByID(email)
        }
    }, [userList])

    return (
        <>
        {userDetail ? (
            <div className="userProfile__header">
            <div className='container'>
                <div className="userProfile__header">
                    <div className="userProfile__img">
                            <img id='user_avatar' src={userDetail.image}></img>
                    </div>
                    <div>
                        <div className="userProfile__header-name">
                            <p>{userDetail?.name}</p>
                            <div className="userProfile__header-button">
                                <button id="follow">Подписаться</button>
                                <Link to={`/chats/${email}`} id="follow">Сообщения</Link>
                                <button id="details">...</button>
                            </div>
                        </div>
                        <div className="userProfile__header-follow">
                            <p><span>0</span> публикаций</p>
                            <p><span>{userDetail?.followers?.length}</span> подписчиков</p>
                            <p><span>{userDetail?.follow?.length}</span> подписок</p>
                        </div>
                        <div className="userProfile__header-info">
                            <p>{userDetail?.email}</p>
                        </div>
                    </div>
                </div>
                <div className="userProfile__publication">
                    
                </div>
            </div>
        </div>
        ) : (null
        )}
        </>
        );
};

export default UserProfile;