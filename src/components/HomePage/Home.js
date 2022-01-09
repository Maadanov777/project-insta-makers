import React, { useContext } from 'react';
import { authContext } from '../Contexts/AuthContext';
import PostList from '../Post/PostList/PostList';
import UserList from '../Users/UserList';
import './Home.css'

const Home = () => {

    return (
        <div className="home">
            <div className="home-container">
                <div style={{display: 'flex'}} >
                    <PostList />
                    <div className="userList" >
                        <UserList />
                    </div>
                </div>                
            </div>
        </div>
    );
};

export default Home;
