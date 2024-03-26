import { useState, useEffect, useContext } from 'react'
import { Store } from '@/store'
import { useSelector } from 'react-redux'
import { OnlineList } from '@/store/slices/member.slice'
import { SocketContext } from '@/pages/home'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import './memberOnlineList.scss'

export default function MemberOnlineList() {
    const socket = useContext(SocketContext)
    const memberStore = useSelector((store: Store) => store.memberStore)
    const [list, setList] = useState<OnlineList[]>([])
    const navigate = useNavigate()

    // login time
    function getLoginTime(loginTime: number) {
        const now = Date.now()
        const duration = now - loginTime
        const hours = Math.floor(duration / 1000 / 60 / 60)
        const minutes = Math.floor(duration / 1000 / 60) % 60
        const seconds = Math.floor(duration / 1000) % 60

        return `${hours} hour ${minutes} minute ${seconds} second`
    }

    useEffect(() => {
        setList(memberStore.onlineList || [])
    }, [memberStore.onlineList])

    useEffect(() => {
        const interval = setInterval(() => {
            const updateMember = list.map(member => {
                return {
                    ...member,
                    loginTime: getLoginTime(Number(member.loginAt))
                }
            })
            setList(updateMember)
        }, 1000)

        return () => clearInterval(interval)
    }, [list])

    // kick
    const handleKick = (client: OnlineList) => {
        const reason = window.prompt("Enter reason?", "");

        if (reason && reason.trim() != "") {
            socket?.emit("masterKick", {
                reason: reason,
                socketId: client.socketId,
                targetMember: client.data
            });
        } else {
            message.warning("Reason cannot be empty");
        }
    }

    return (
        <div className='online-list-box'>
            <div className='online-title'>
                <h2>Member Online List</h2>
                <button onClick={()=> navigate('/member/list')}><i className="fa-solid fa-rotate-left"/> All Member</button>
            </div>

            <div className='online-table'>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Login Time</th>
                            <th>Role</th>
                            <th>Tools</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            list.map((member, index) => (
                                <tr key={Date.now() * Math.random()}>
                                    <td>{index + 1}</td>
                                    <td>{member.data.firstName + ' ' + member.data.lastName}</td>
                                    <td>{member.data.loginId}</td>
                                    <td>{member.data.email}</td>
                                    <td>{member.loginTime}</td>
                                    <td>{member.data.role}</td>
                                    <td>
                                        <button onClick={() => handleKick(member)} className='kick-button'>Kick</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}
