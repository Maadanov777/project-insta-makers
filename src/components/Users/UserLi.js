import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { followerContext } from '../Contexts/FollowerContext';
import './UserLi.css'

const UserLi = ({ user }) => {

  const { followUser, unFollowing } = useContext(followerContext);
  const [checked, setChecked] = useState(false);

  const toFollow = () => {
    followUser(user).then(() => setChecked(true))
  }

  const unFollow = () => {
    unFollowing(user).then(() => setChecked(false))
  }

  return (
    <div key={user.email} className="userList-li">
      <div>
        <Link style={{ textDecoration: 'none', color: 'black' }} to={`user/profile/${user.email}`} >
          <div id='rec'>
            <img src={user?.image ? user.image : 'https://uoks.ru/sites/default/files/2020-12/zero.jpg'} id='img-userLI' />
            <div id='rec' style={{ marginLeft: '10px' }}>
              <p id="rec-name">{user.name}</p>
            </div>
          </div>
        </Link>
      </div>
      <div id='rec'>
        {
          !checked ? (
            <button onClick={toFollow} id="subscribe"> Подписаться </button>
          ) : (
            <button onClick={unFollow} id="unsubscribe"> Отписаться </button>
          )
        }
      </div>
    </div>
  );
};

export default UserLi;