import api from '@services/apis'
import { Modal, message } from 'antd'
import BtnLoading from '@/components/BtnLoading'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Store } from '@/store'

import './changePassword.scss'
import pictures from '@/pictures'

export default function FirstLogin() {
    const memberStore = useSelector((store: Store) => store.memberStore)
    const [load, setLoad] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newPassword = (e.target as any).newPassword.value;
            const confirmPassword = (e.target as any).confirmPassword.value;

            // check emty
            if (!newPassword || !confirmPassword) {
                message.warning("Please fill all fields!")
                return
            }
            // check password length
            if (newPassword.length < 3) {
                message.warning("Password must be at least 3 characters long!")
                return
            }

            // check duplicates pass 
            if (newPassword != confirmPassword) {
                Modal.warning({
                    title: 'Notification',
                    content: "The password does not match!"
                })
                setLoad(false)
                return
            }

            setLoad(true)
            let res = await api.memberApi.changePassword(Number(memberStore.data?.id), { password: newPassword })
            localStorage.setItem("tokenAdmin", res.data.tokenAdmin)
            message.success("Password changed successfully")
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        } catch (err: any) {
            setLoad(false);
            Modal.warning({
                title: "Notification",
                content: err?.response?.data?.message || "Unknown error! Please contact to master to get help!"
            });
        }
    }

    return (
        <div className="first-login-container">
            <form className="card" onSubmit={handleChangePassword}>
                {load && <BtnLoading />}
                <div className='first-login-logo'>
                    <img src={pictures.blackLogo} alt="logo" />
                </div>
                <div className="box-title">
                    <div className='title'>Change Password</div>
                    <div className='sub-title'>*On your first login attempt, please change your password</div>
                </div>

                <div className="inputBox newpass">
                    <input
                        type="password"
                        name='newPassword'
                        required autoFocus
                    />
                    <span>New password</span>
                </div>
                <div className="inputBox confirm">
                    <input
                        type="password"
                        name='confirmPassword'
                        required
                    />
                    <span>confirm password</span>
                </div>
                <button type='submit' className="enter">continue</button>
            </form>
        </div>

    )
}