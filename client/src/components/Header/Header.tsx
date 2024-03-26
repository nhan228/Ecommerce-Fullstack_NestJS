import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Panel from './components/Panel/Panel'
import Sidebar from './components/Sidebar/Sidebar'

import './header.scss'

export default function Header() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  };

  return (
    <div>
      <Navbar />
      <Panel toggleSidebar={toggleSidebar} />
      <Sidebar toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
    </div>
  )
}
