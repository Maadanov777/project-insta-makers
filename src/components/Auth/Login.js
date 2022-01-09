import React, { useContext } from 'react'
import { authContext } from '../Contexts/AuthContext.js'
import './Auth.css'

const Login = () => {
    const {
        email,
        userName,
        setEmail,
        password,
        setUserName,
        setPassword,
        handleLogIn,
        handleSignUp,
        hasAccount,
        setHasAccount,
        emailError,
        passwordError,
        resetPassword
      } = useContext(authContext)
    
  return (
    <>
      <section className="login">
        <div className="loginContainer">
          <label htmlFor="" className="authLabel">
            Login
          </label>
          <input
            type="text"
            className="authInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          {!hasAccount ? 
          <>
            <label htmlFor="" className="NameLabel">
                UserName
            </label>
            <input
                type="text"
                className="nameInput"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoFocus
          />
          </>
          : null}
          <p className="errorMsg">{emailError}</p>
          <label htmlFor="" className="authLabel">
            Password
          </label>
          <input
            type="password"
            className="authInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <p className="errorMsg">{passwordError}</p>
          <div className="btnContainer">
            {hasAccount ? (
              <>
                <div className='reset'>
                    <button onClick={() => resetPassword()}>Reset password</button>
                </div>
                <button className="authButton" onClick={handleLogIn}>
                  Sign In
                </button>
                <p className="authP">
                  Don't have an account?{' '}
                  <span
                    className="authSpan"
                    onClick={() => setHasAccount(!hasAccount)}
                  >
                    Sign Up
                  </span>
                </p>
              </>
            ) : (
              <>
                <button className="authButton" onClick={handleSignUp}>
                  Sign Up
                </button>
                <p className="authP">
                  Have an account?{' '}
                  <span
                    className="authSpan"
                    onClick={() => {
                      setHasAccount(!hasAccount)
                    }}
                  >
                    Sign In
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
