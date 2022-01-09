import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import Header from './components/Header/Header'
import history from './history'
import Home from './components/HomePage/Home'
import Auth from './components/Auth/Auth'
import UserProfile from './components/UserProfile/UserProfile'
import MyProfile from './components/MyProfile/MyProfile'
import AddPost from './components/AddPost/AddPost'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import CircularProgress from '@mui/material/CircularProgress';
import instaBlack from './assets/images/instablack.jpeg'
import Chat from './components/Direct/Chat'


const MainRoutes = () => {
  const auth = getAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true)
      setLoading(false)
    } else {
      setLoggedIn(false)
      setLoading(false)
    }
  })

  if (loading) {
    return (
      <div style={{background: 'black', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <div>
              <img src={instaBlack} style={{height: '70px', width: 'auto', marginBottom: '10px'}} />
            </div>
            <div style={{marginBottom: '10px'}} >
              <CircularProgress disableShrink />;
            </div>
            <div style={{color: 'white'}} >
              logging...
            </div>
          </div>
      </div>
    )
  }

  return (
      <Router location={history.location} navigator={history}>
        <div style={{marginBottom: '60px'}} >
          <Header loggedIn={loggedIn} />
        </div>
        {
          loggedIn ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats/:email" element={<Chat />} />
            <Route path="/user/profile/:email" element={<UserProfile />} />
            <Route path='/my/profile' element={<MyProfile/>}/>
            <Route path='/addPost' element={<AddPost/>}/>
            <Route
              path="*"
              element={<Home />}
            />
          </Routes>
          ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="*"
              element={<Auth/>}
            />
          </Routes>
          )
        }
        
      </Router>
  )
}

export default MainRoutes
