import React, { useContext, useEffect } from 'react';
import MainRoutes from "./MainRoutes";
import './App.css'
import AuthContextProvider from "./components/Contexts/AuthContext";
import PostContextProvider from "./components/Contexts/PostContext";
import FollowerContextProvider from "./components/Contexts/FollowerContext";
import ChatContextProvider from './components/Contexts/ChatContext';

function App() {

  return (
    <div className="App">
      <AuthContextProvider> 
        <FollowerContextProvider>
          <PostContextProvider>
            <ChatContextProvider>
              <MainRoutes/>
            </ChatContextProvider>
          </PostContextProvider>
        </FollowerContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
