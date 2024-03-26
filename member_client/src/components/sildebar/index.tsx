import { Modal } from 'antd'
import { member, memberAction } from '@/store/slices/member.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Store } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import './sidebar.scss'

export default function Sidebar({ menuState, setMenuState, data, socket, setSocket }: {
  menuState: boolean
  setMenuState: any,
  data: member,
  socket: Socket | null,
  setSocket: any
}) {
  const location = useLocation()
  const memberStore = useSelector((store: Store) => store.memberStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menus, setMenus] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  // check per and log
  useEffect(() => {
    if (memberStore.data?.permission) {
      let menu = []

      /* Home Menu */
      let homeMenu = {
        title: 'Home',
        icon: 'bxs-dashboard',
        link: '/',
      }
      menu.push(homeMenu)

      /* Log Menu */
      if ((memberStore.data.role == 'admin' || memberStore.data.role == 'master') && memberStore.data.permission.includes('r:log')) {
        let logMenu = {
          title: 'Logs',
          icon: 'bx-data',
          link: 'log/all',
        }
        menu.push(logMenu)
      }

      /* Member Menu */
      if ((memberStore.data.role == 'admin' && memberStore.data.permission.includes('r:member') || memberStore.data.role == 'master')) {
        let memberMenu: any = {
          title: 'Members',
          icon: 'bx-check-shield',
          link: 'member/list',
        }
        menu.push(memberMenu)
      }

      /* User Menu */
      if (memberStore.data.role == 'admin' && memberStore.data.permission.includes('r:user') || memberStore.data.role == 'master') {
        let UserMenu: any = {
          title: 'Users',
          icon: 'bx-group',
          link: 'user/list',
        }
        menu.push(UserMenu)
      }

      /* Brand Menu */
      if (memberStore.data.permission.includes('r:brand')) {
        let brandMenu: any = {
          title: 'Brands',
          icon: 'bx-git-branch',
          link: 'brand/list',
        }
        menu.push(brandMenu)
      }

      /* Category Menu */
      if (memberStore.data.permission.includes('r:category')) {
        let categoryMenu: any = {
          title: 'Categories',
          icon: 'bxs-component',
          link: 'category/list',
        }
        menu.push(categoryMenu)
      }

      /* Product Menu */
      if (memberStore.data.permission.includes('r:banner')) {
        let ProductMenu: any = {
          title: 'Products',
          icon: 'bx-store-alt',
          link: 'product/list',
        }
        menu.push(ProductMenu)
      }

      /* Banner Menu */
      if (memberStore.data.permission.includes('r:banner')) {
        let BannerMenu: any = {
          title: 'Banners',
          icon: 'bx-image-add',
          link: 'banner/list',
        }
        menu.push(BannerMenu)
      }

      /* Vocher Menu */
      if (memberStore.data.permission.includes('r:vocher')) {
        let vocherMenu: any = {
          title: 'Vochers',
          icon: 'bx-purchase-tag-alt',
          link: 'vocher/list',
        }
        menu.push(vocherMenu)
      }

      /* Setting Menu */
      let settingMenu: any = {
        title: 'Settings',
        icon: 'bx-cog',
        link: 'setting',
      }
      menu.push(settingMenu)

      setMenus(menu)
    }
  }, [memberStore.data])

  // menu Click
  const handleMenuClick = (index: number, link: any) => {
    setActiveIndex(index)
    localStorage.setItem('activeIndex', index.toString())
    navigate(link)
  }

  // logout
  const handleLogout = () => {
    Modal.confirm({
      title: "NOTIFICATION",
      content: "Do you really want to logout?",
      onOk: () => {
        window.localStorage.removeItem("tokenAdmin")
        dispatch(memberAction.setData(null))
        socket?.close()
        setSocket(null)
        window.location.href = "/member/authen"
      }
    })
  }

  // active menus
  useEffect(() => {
    const index = menus.findIndex(menu => menu.link == location.pathname);
    if (index != -1) {
      setActiveIndex(index);
    }
  }, [location.pathname, menus])

  // menus active get item
  useEffect(() => {
    const storedActiveIndex = localStorage.getItem('activeIndex');
    if (storedActiveIndex) {
      setActiveIndex(parseInt(storedActiveIndex))
    }
  }, [])

  // active box sidebar
  useEffect(() => {
    localStorage.setItem('activeSideBar', JSON.stringify(menuState))
  }, [menuState])

  return (
    <div className={`sidebar ${menuState && 'close'}`}>
      <div className="logo">
        <i className='bx bx-shield-quarter' />
        <div className="logo-name">
          <span>AMA</span>ZON
        </div>
      </div>

      {/* SIDE MENU RENDER */}
      <ul className="side-menu">
        {
          menus.map((item, index) => (
            <li key={Date.now() * Math.random()} className={index == activeIndex ? 'active' : ''}>
              <div onClick={() => {
                handleMenuClick(index, item.link)
              }}>
                <i className={`bx ${item.icon}`} />
                {item.title}
              </div>
            </li>
          ))
        }
      </ul>

      {/* LOGOUT */}
      <ul className="side-menu">
        <li>
          <div className="logout" onClick={handleLogout}>
            <i className="bx bx-log-out-circle" />
            Logout
          </div>
        </li>
      </ul>
    </div>
  )
}
