import { useEffect, useState } from 'react'
import { createContext } from 'react'
import Navbar from '../../components/navbar'
import MainContent from '../../components/main-content'
import Sidebar from '../../components/sildebar'
import { useDispatch, useSelector } from 'react-redux'
import { memberAction } from '@/store/slices/member.slice'
import { Store } from '@/store'
import { Socket, io } from 'socket.io-client'
import { Modal } from 'antd'
import { logAction } from '@/store/slices/log.slice'
import FirstLogin from '../authen/first-login'
// import Verify from '../authen/verify'

import './admin.scss'

export const SocketContext = createContext<null | Socket>(null)

export default function AdminHomepage() {
    const dispatch = useDispatch()
    const [menuState, setMenuState] = useState<boolean>(false)
    const [display, setDisplay] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [first, setFirst] = useState<boolean>(false)
    const [contactConfirmState, setContactConfirmState] = useState<boolean>(false)

    const memberStore = useSelector((store: Store) => store.memberStore)

    const toggleSwitchBackground = () => {
        setDisplay(!display)
    }

    // socket get tokenAdmin
    useEffect(() => {
        setSocket(io(`${import.meta.env.VITE_SERVER}`, {
            reconnectionDelayMax: 10000,
            auth: {
                token: String(localStorage.getItem("tokenAdmin"))
            }
        }))
    }, [])

    // Authen
    useEffect(() => {
        socket?.on('status', (res: any) => {
            console.log('res', res);

            if (!res.data) {
                console.log(res.message);
                if (res.invalidToken) {
                    localStorage.removeItem("tokenAdmin")
                }
            } else {
                dispatch(memberAction.setData(res.data))
            }
        })

        // all log
        socket?.on('logs', (data: any) => {
            dispatch(logAction.setData(data))
        })

        // all member
        socket?.on('members', (data: any) => {
            dispatch(memberAction.setList(data))
        })

        // online
        socket?.on('online-list', (data: any) => {
            dispatch(memberAction.setOnlineList(data))
        })

        // kick
        socket?.on("kick", (messageStr: string) => {
            Modal.warning({
                title: "Notification",
                content: "You have been logged out by the admin, reason: " + messageStr,
            })
            dispatch(memberAction.setData(null))
            localStorage.removeItem("tokenAdmin")
        })
    }, [socket])

    // first login
    useEffect(() => {
        if (memberStore.data?.firstLoginState) {
            setFirst(true)
        }
    }, [memberStore.data])

    // check confirm email
    useEffect(() => {
        if (!memberStore.data) return
        if (!memberStore.data?.emailConfirm) {
            setContactConfirmState(true)
        }
    }, [memberStore.data])

    // sidebar active get item
    useEffect(() => {
        if (localStorage.getItem('activeSideBar')) {
            setMenuState(JSON.parse(localStorage.getItem('activeSideBar') as string))
        }
    }, [])

    // active darkmode
    useEffect(() => {
        if (localStorage.getItem('activeDarkMode')) {
            setDisplay(JSON.parse(localStorage.getItem('activeDarkMode') as string))
        }
    }, [])
    return (
        <div className='homepage'>
            <SocketContext.Provider value={socket}>
                {
                    (memberStore.data != null && !first && !contactConfirmState) && (
                        <div className={`admin_page ${display ? "dark" : ""}`}>
                            <Sidebar data={memberStore.data} menuState={menuState} setMenuState={setMenuState} setSocket={setSocket} socket={socket} />
                            <div className='content'>
                                <Navbar toggleSwitchBackground={toggleSwitchBackground} menuState={menuState} setMenuState={setMenuState} display={display} data={memberStore.data} />
                                <MainContent />
                            </div>
                        </div>
                    )
                }
                {first && <FirstLogin />}
            </SocketContext.Provider>
        </div>
    )
}