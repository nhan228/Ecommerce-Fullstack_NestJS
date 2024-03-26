import pictures from '@/pictures'
import React, { useState } from 'react'
import { message, Modal, Input } from 'antd'
import BtnLoading from '@/components/BtnLoading'
import api from '@services/apis'

export default function SignUp({ toggleSwitchForm }: any) {
    const [load, setLoad] = useState<boolean>(false)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const firstName = (e.target as any).firstName.value
            const lastName = (e.target as any).lastName.value
            const userName = (e.target as any).userName.value
            const email = (e.target as any).email.value
            const password = (e.target as any).password.value
            const confirmPassword = (e.target as any).confirmPassword.value

            // is not emty
            if (!firstName || !lastName || !userName || !email || !password || !confirmPassword) {
                message.warning({
                    content: 'Please fill all fields!'
                })
                return
            }

            // check type email
            if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
                message.error({
                    content: 'Email is not valid!'
                });
                return;
            }

            // check pass
            if (password.length < 6) {
                message.error({
                    content: 'Password must be at least 6 characters long!'
                })
                return
            }

            // check confirm pass
            if (password != confirmPassword) {
                message.error({
                    content: 'Confirm password not match!'
                })
                return
            }

            const newUser = {
                firstName,
                lastName,
                userName,
                email,
                password
            }
            setLoad(true)
            let res = await api.userApi.register(newUser)

            // Success
            if (res.status == 200) {
                Modal.success({
                    title: "Sign Up successfully",
                    content: "Please check your email for confirmation ^^",
                    onOk: () => {
                        (e.target as any).firstName.value = '';
                        (e.target as any).lastName.value = '';
                        (e.target as any).userName.value = '';
                        (e.target as any).email.value = '';
                        (e.target as any).password.value = '';
                        (e.target as any).confirmPassword.value = '';
                        setLoad(false)
                        toggleSwitchForm()
                    }
                })
            }
        } catch (err: any) {
            setLoad(false)
            Modal.error({
                title: "Register failed!",
                content: err.response?.data?.message || "Please try again in a few minutes!"
            })
        }
    }
    return (
        <div>
            {load && <BtnLoading />}
            {/* --AUTHEN BODY-- */}
            <div className='authen-body'>
                {/* LOGO */}
                <div className='authen-logo border' onClick={() => {
                    window.location.href = '/'
                }}>
                    <img src={pictures.signLogo} alt="logo" />
                </div>

                <div className='authen-container sign-up'>
                    {/* TITLE */}
                    <h2>Create Account</h2>

                    {/* Form */}
                    <form onSubmit={(e) => { handleSignUp(e) }} className="authen-form signUp">

                        {/* yourname */}
                        <div className='yourname'>
                            <div className='firstname'>
                                <p>First Name</p>
                                <Input
                                    type='text'
                                    name='firstName'
                                    placeholder="First Name..."
                                    autoFocus
                                />
                            </div>
                            <div className='lastname'>
                                <p>Last Name</p>
                                <Input
                                    type='text'
                                    name='lastName'
                                    placeholder="Last Name..."
                                />
                            </div>
                        </div>

                        {/* userid */}
                        <div className='user-id'>
                            <p>User ID</p>
                            <Input
                                type='text'
                                name='userName'
                                placeholder="Enter userName here..."
                            />
                        </div>

                        {/* email */}
                        <div className='email'>
                            <p>Email</p>
                            <Input
                                type='text'
                                name='email'
                                placeholder="Enter email here..."
                            />
                        </div>

                        {/* password */}
                        <div className='password'>
                            <p>Password</p>
                            <Input
                                type="password"
                                name='password'
                                placeholder="At least 6 characters."
                            />
                            <i className="fa-solid fa-info"></i>
                            <small>Passwords must be at least 6 characters.</small>
                        </div>

                        {/* re password */}
                        <div className='re-password'>
                            <p>Re-enter Password</p>
                            <Input
                                type="password"
                                name='confirmPassword'
                                placeholder="Enter re-password here..."
                            />
                        </div>

                        {/* button */}
                        <button type='submit' className='authen-button sign-up'>
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
                        <hr />
                        <div className='bussiness-contact'>
                            <h3>Buying for work?</h3>
                            <div className='chat-shop'>Create a free business account</div>
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className='divider'>
                    <h5>Already have an account?</h5>
                </div>

                {/* BUTTON REF */}
                <div className='ref-box'>
                    <button className='ref-button login' onClick={toggleSwitchForm}>Sign in <i className="fa-solid fa-caret-right"></i></button>
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
