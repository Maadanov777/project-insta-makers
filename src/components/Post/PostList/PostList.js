import React, { useContext, useEffect } from 'react';
import { authContext } from '../../Contexts/AuthContext';
import { followerContext } from '../../Contexts/FollowerContext';
import { postContext } from '../../Contexts/PostContext';
import PostCard from '../PostCard/PostCard';
import './PostList.css'

const PostList = () => {

    const { posts, getPosts } = useContext(postContext);
    const { currentUser } = useContext(authContext);

    useEffect(() => {
        getPosts(currentUser)
    }, [currentUser])

    return (
        <div className="postList">
            <div className="postList-cards">
                {
                    posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard post={post} />
                        ))
                    ) : null
                }
            </div>
        </div>
    );
};

export default PostList;