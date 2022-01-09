import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { followerContext } from '../Contexts/FollowerContext';
import { authContext } from '../Contexts/AuthContext';
import UserLi from './UserLi';

const UserList = () => {
  const { followUser } = useContext(followerContext);
  const { recommends } = useContext(authContext);

  return (
    <div className={'userListContainer'} >
      {
        recommends?.length > 0 ?<h3>Рекомендации для вас</h3> : ''
      }
      
      {recommends?.length > 0 ? (
        recommends.map(user => <UserLi user={user} />)
      ) : (
        <div>

        </div>
      )
      }
      <p style={{ fontSize: '12px', color: 'rgba(228,227,227)' }} >
        About Help Press API Jobs Privacy Terms Locations Top Accounts Hashtags Language
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(228,227,227)' }} >
        © 2022 INSTAGRAM FROM META
      </p>
    </div>
  );
};

export default UserList;