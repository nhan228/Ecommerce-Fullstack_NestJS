import pictures from '@/pictures'
import React, { useState } from 'react'
import { Modal, Input, message } from 'antd'
import BtnLoading from '@/components/BtnLoading'
import api from '@services/apis'
import { loginWithGoogle } from '@services/firebase'

export default function SignIn({ toggleSwitchForm }: any) {
  const [showHelp, setShowHelp] = useState<boolean>(true)
  const [load, setLoad] = useState<boolean>(false)

  // sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginInfo = (e.target as any).loginInfo.value
      const password = (e.target as any).password.value

      // check emty
      if (!loginInfo || !password) {
        message.warning("Please fill all fields!")
        return
      }

      // data
      let loginData = {
        loginInfo,
        password
      }
      setLoad(true)
      let result = await api.userApi.login(loginData)

      // Success
      if (result.status == 200) {
        (e.target as any).loginInfo.value = "";
        (e.target as any).password.value = "";

        localStorage.setItem("token", result.data.data)

        message.success("Login successfuly! Return homepage in a few second")

        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } catch (err: any) {
      setLoad(false)
      Modal.error({
        title: "Logged in failed!",
        content: err.response?.data?.message.join(" ") || 'Please try again in a few minutes',
      })
    }
  }

  // sign in with google
  const handleSignInWithGoogle = async () => {
    setLoad(true)
    try {
      const result = await loginWithGoogle()
      if (!(result as any).user.accessToken) {
        setLoad(false)
        return
    }
      const data = {
        googleToken: (result as any).user.accessToken,
        user: {
          email: (result as any).user.email,
          avatar: (result as any).user.photoURL,
          firstName: (result as any)._tokenResponse?.firstName,
          lastName: (result as any)._tokenResponse?.lastName,
          phoneNumber:(result as any).user?.phoneNumber,
          userName: String(Math.ceil(Date.now() * Math.random())),
          password: String(Math.ceil(Date.now() * Math.random())),
        },
      }
      console.log('usser',data.user);
      
      console.log(result);
      
      const resultApi = await api.userApi.loginWithGoogle(data);
      localStorage.setItem('token', resultApi.data.token);
      Modal.success({
        title: 'Notification',
        content: resultApi.data.message,
        onOk: () => {
          window.location.href = '/';
        },
        cancelText: null,
      })
    } catch (err: any) {
      setLoad(false)
      Modal.error({
        title: 'Error',
        content: err.response?.data.message || 'Unknown error, please contact the administrator for assistance!',
      });
    }
  }

  return (
    <div>
      {load && <BtnLoading />}
      {/* --AUTHEN BODY-- */}
      <div className='authen-body'>
        {/* LOGO */}
        <div className='authen-logo' onClick={() => {
          window.location.href = '/'
        }}>
          <img src={pictures.signLogo} alt="logo" />
        </div>

        <div className='authen-container sign-in'>
          {/* TITLE */}
          <div className='title-box'>
            <h2>Sign In</h2>

            <button className="google" onClick={handleSignInWithGoogle}>
              <div className="oauthButton">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
                Sign in with Google
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { handleSignIn(e) }} className="authen-form signIn">
            {/* userid or email */}
            <div className='user-id'>
              <p>Email or User ID</p>
              <Input
                type='text'
                name='loginInfo'
                placeholder="Enter username or email here..."
                autoFocus
              />
            </div>

            {/* password */}
            <div className='password'>
              <p>Password</p>
              <Input
                type="password"
                name='password'
                placeholder="Enter password here..."
              />
            </div>

            {/* button */}
            <button type='submit' className='authen-button sign-in'>
              <span className='authen-btn-text'>Continue</span>
            </button>
          </form>

          {/* Legal */}
          <div className='legalText'>
            By continuing, you agree to Amazon's
            <a href="#" >Conditions of Use</a>
            and
            <a href="#">Privacy Notice</a>.
          </div>

          {/* Help */}
          <div className='help-container'>
            <div className='help-box'>
              <a onClick={() => setShowHelp(!showHelp)}>
                <i className={`fa-solid fa-caret-${showHelp ? 'right' : 'down'}`} />
                <span>Need help?</span>
              </a>
              <ul className={`help-content ${showHelp ? '' : 'show'}`}>
                <li className='issue'>Forgot your password?</li>
                <li className='issue'>Other issues with Sign-In</li>
              </ul>
            </div>

            <hr />

            <div className='bussiness-contact'>
              <h3>Buying for work?</h3>
              <div className='chat-shop'>Shop on Amazon Bussiness</div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className='divider'>
          <h5>New to Amazon?</h5>
        </div>

        {/* BUTTON REF */}
        <div className='ref-box'>
          <button className='ref-button create' onClick={toggleSwitchForm}>Create your Amazon account</button>
        </div>
      </div>

      {/* --AUTHEN FOOTER-- */}
      <div className='authen-footer'>
        <div className='footer-container'>
          <div className='footer-item'>
            <a> Conditions of Use </a>
            <a>Privacy Notice </a>
            <a> Help </a>
          </div>

          <div className='footer-copyright'>
            © 2024, design by Nhan
          </div>
        </div>
      </div>
    </div>
  )
}
