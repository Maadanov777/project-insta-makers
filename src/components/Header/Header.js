import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, doc, getDocs, updateDoc, query, where, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../../fire";
import { authContext } from '../Contexts/AuthContext';

import './Header.css'

const Header = ({loggedIn}) => {
    const { pathname } = useLocation();
    const [ searchText, setSearchText ] = useState('');
    const [ searchResult, setSearchResult ] = useState([]);
    const { handleLogOut, user, currentUser, userList } = React.useContext(authContext);

    const handleSearch = (e) => { 
        setSearchText(e.target.value);
        if (e.target.value === ''){
            setSearchResult([]);
            return 
        }
        const regex =  new RegExp(e.target.value,'g');
        const result = [];
        userList.forEach((user) => {
            if(regex.test(user.name)){
                result.push(user)
            }
        })
        if (result.length === 0) {
            setSearchResult([]);
            return;
        }
        setSearchResult(result);
    }
    
    return (
        <div className="header">
            <div className="header-container">
                <div className="header-icon">
                    <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png' width='100'/>
                </div>
                <div className='search-container'>
                   { loggedIn && <input className={'header-search'} placeholder='Search' value={searchText} onChange={handleSearch} required='search'/> }
                   
                    { searchResult.length > 0 ? (
                        <div className='search-modal' >
                            {searchResult.map(user => (
                                <Link onClick={() => setSearchResult([])} key={user.email} to={`/user/profile/${user.email}`} style={{textDecoration: 'none'}} >
                                    <div className='search-li' >
                                        <img  src={user?.image ? user.image : 'https://uoks.ru/sites/default/files/2020-12/zero.jpg'} id='img-userLI'/>
                                        <div style={{color: 'black'}} >
                                            {user.name}
                                            <div style={{fontSize: '12px', color: 'gray'}} >{user.email}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : <></>  }
                   
                </div>
                <div className='header-navigate'>
                    {
                        loggedIn ? (
                            <>
                            <Link to='/'>
                                {
                                    pathname === '/' ? (
                                        <svg aria-label="Home" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z" ></path></svg>
                                    ) : (
                                        <svg aria-label="Home" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path></svg>
                                    )
                                }
                            </Link>


                                <svg aria-label="Messenger" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path><path d="M17.79 10.132a.659.659 0 00-.962-.873l-2.556 2.05a.63.63 0 01-.758.002L11.06 9.47a1.576 1.576 0 00-2.277.42l-2.567 3.98a.659.659 0 00.961.875l2.556-2.049a.63.63 0 01.759-.002l2.452 1.84a1.576 1.576 0 002.278-.42z" fill-rule="evenodd"></path></svg>
                            
                            <Link to="/addPost">
                                {
                                    pathname === '/addPost' ? (
                                        <svg aria-label="New Post" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 5.545l-.117.006-.112.02a1 1 0 00-.764.857l-.007.117V11H6.544l-.116.007a1 1 0 00-.877.876L5.545 12l.007.117a1 1 0 00.877.876l.116.007h4.457l.001 4.454.007.116a1 1 0 00.876.877l.117.007.117-.007a1 1 0 00.876-.877l.007-.116V13h4.452l.116-.007a1 1 0 00.877-.876l.007-.117-.007-.117a1 1 0 00-.877-.876L17.455 11h-4.453l.001-4.455-.007-.117a1 1 0 00-.876-.877zM8.552.999h6.896c2.754 0 4.285.579 5.664 1.912 1.255 1.297 1.838 2.758 1.885 5.302L23 8.55v6.898c0 2.755-.578 4.286-1.912 5.664-1.298 1.255-2.759 1.838-5.302 1.885l-.338.003H8.552c-2.754 0-4.285-.579-5.664-1.912-1.255-1.297-1.839-2.758-1.885-5.302L1 15.45V8.551c0-2.754.579-4.286 1.912-5.664C4.21 1.633 5.67 1.05 8.214 1.002L8.552 1z"></path></svg>
                                    ) : (
                                        <svg aria-label="New Post" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                                    )
                                }
                                
                            </Link>

                                <svg aria-label="Find People" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M13.173 13.164l1.491-3.829-3.83 1.49zM12.001.5a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012.001.5zm5.35 7.443l-2.478 6.369a1 1 0 01-.57.569l-6.36 2.47a1 1 0 01-1.294-1.294l2.48-6.369a1 1 0 01.57-.569l6.359-2.47a1 1 0 011.294 1.294z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.739"></path></svg>
                            
                            <Link to="/my/profile">
                                <img style={{height: 24, borderRadius: '50%'}} src={currentUser?.image ? currentUser.image : 'https://uoks.ru/sites/default/files/2020-12/zero.jpg'} alt={'avatar'} />
                            </Link>
                                <img onClick={handleLogOut} src="https://www.svgrepo.com/show/21304/logout.svg" intrinsicsize="512 x 512" width="23" height="22" srcset="https://www.svgrepo.com/show/21304/logout.svg 4x" alt="Logout SVG Vector" title="Logout SVG Vector"></img>
                            </>
                        ) : (
                            <button onClick={handleLogOut} >login</button>
                        )
                    }
                    
                </div>
            </div>
        </div>
    );
};

export default Header;