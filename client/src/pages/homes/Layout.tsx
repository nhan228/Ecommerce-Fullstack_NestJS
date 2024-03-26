import Header from "@/components/Header/Header";
import Footer from "@/components/Footers";
import Product from './components/product'
import { useLocation } from 'react-router-dom'
import Carousel from './components/carousel'
import { Store } from "@/store"
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './layout.scss'

export default function Layout() {
    const productStore = useSelector((store: Store) => store.productStore)
    const location = useLocation()
    const isHomePage = location.pathname == '/'

    // Back to top
    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    return (
        <div className="layout_container">
            <div className="header_container" style={{position:'sticky', top:'0', zIndex:'100'}}>
                <Header />
            </div>
            <div className='home_page_body'>
                {isHomePage && <Carousel />}
                {isHomePage && <Product productStore={productStore} />}
                <div className='body_content'>
                    <Outlet />
                </div>
            </div>
            <Footer handleBackToTop={handleBackToTop}/>
        </div>
    )
}
