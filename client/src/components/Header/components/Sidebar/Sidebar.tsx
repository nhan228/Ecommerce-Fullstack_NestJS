import { useSelector } from 'react-redux'
import './sidebar.scss'
import { Store } from '@/store'

export default function Sidebar({ toggleSidebar, showSidebar }: { toggleSidebar: any, showSidebar: boolean }) {
    const userStore = useSelector((store: Store) => store.userStore)

    return (
        <>
            <div className={`sidebar-container ${showSidebar ? 'show' : ''}`}>
                <div className="black-background">
                    {/* MENU */}
                    <div className={`menu ${showSidebar ? 'active' : ''}`}>
                        {
                            userStore.data ? (
                                <>
                                    <div className='sign-in'>
                                        <div className='box-left'>
                                            <img className="avatar" src={userStore.data.avatar} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        </div>
                                        <div className='box-right'>
                                            <span className='hi'>Hello,</span>
                                            {
                                                userStore.data.lastName ? (
                                                    <span className='user-name token' style={{ color: '#febd69' }}> {userStore.data.lastName} {userStore.data.firstName}</span>
                                                ) : (
                                                    <span className='user-name token' style={{ color: '#febd69' }}>{userStore.data.email.split('@')[0]}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='sign-in'>
                                        <div className='box-left'>
                                            <i className='bx bx-user-circle'/>
                                        </div>
                                        <div className='box-right'>
                                            <span className='hi'>Hello,</span>
                                            <span className='user-name no-token' onClick={() => {
                                                window.location.href = '/authen'
                                            }}>Sign in</span>
                                        </div>
                                    </div>
                                </>
                            )
                        }

                        <div className='scroll-content'>
                        </div>
                    </div>

                    {/* CLOSE */}
                    <div className='close' onClick={toggleSidebar}>
                        <i className="fa-solid fa-x" />
                    </div>
                </div>
            </div>

        </>
    )
}
