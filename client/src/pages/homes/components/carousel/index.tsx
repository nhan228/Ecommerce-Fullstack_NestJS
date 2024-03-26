import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Store } from '@/store'

import './carousel.scss'
import pictures from '@/pictures'

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const bannerStore = useSelector((store: Store) => store.bannerStore)
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  console.log('categoryStore', categoryStore);
  const brandStore = useSelector((store: Store) => store.brandStore)
  console.log('brandStore', brandStore)

  const images: any[] = []
  bannerStore.data?.map((item: any) => {
    if (item.status == 'active') {
      images.push(import.meta.env.VITE_SERVER_REAL + "/" + item.img)
    }
  })

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex == images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex == 0 ? images.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    if (!isHovered) {
      const newTimer = setInterval(() => {
        goToNextSlide()
      }, 10000)
      setTimer(newTimer)
    } else {
      clearInterval(timer)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isHovered])

  return (
    <div className="hero-section">
      <div className="hero-image">
        <div className="click prev-icon mobile-hidden" onClick={goToPrevSlide}>
          <i className="fa-solid fa-angle-left" />
        </div>

        <img src={images[currentIndex]} alt='banner' />

        <div className="click next-icon mobile-hidden" onClick={goToNextSlide}>
          <i className="fa-solid fa-angle-right" />
        </div>
      </div>

      <div className='hero-category'>
        <div className="shopping-category" >

          <div className="row">

            <div className="col">
              <h2>Deals in PCs</h2>
              <div className="gallery-single-image">
                <img src='https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2023/EBF23/Fuji_Desktop_Single_image_EBF_2x_v1._SY608_CB573698005_.jpg' />
              </div>
              <p>
                <a href="#">See all deals</a>
              </p>
            </div>

            <div className="col">
              <h2>Shop deals in Fashion</h2>
              <div className="gallery-two-image">
                <div>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmB49pvOzIEybqvgJzWkCmByF6i4ByULMRnXXayzIjc8KUvlFrON6oXQ9bMX2GLxxRE8I&usqp=CAU" style={{objectFit:'fill'}} />
                </div>
                <div>
                  <img style={{objectFit:'fill'}} src="https://i2.wp.com/passionatepennypincher.com/wp-content/uploads/2024/03/amazon-spring-sale.jpg" />
                </div>
              </div>
              <p>
                <a href="#">See all deals</a>
              </p>
            </div>

            <div className="col">
              <h2>Gaming accessories</h2>
              <div className="gallery-three-image">
                <div>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdSJMTIuuZb6oX4N2_QzLPnW6qp27n1htE7DvWW1DAuoOsm9wnBpROCDa0XoTb2GmP8Ss&usqp=CAU" style={{objectFit:'fill'}} />
                </div>
                <div>
                  <img src="https://cdn-images.kiotviet.vn/imbastore/db91594fdfed4d529666ab53353c7af3.jpg" />
                </div>
                <div>
                  <img src="https://product.hstatic.net/1000288298/product/10526_pc_59b7e7328709415d8c9034b0fb98a3ba_master.jpg" />
                </div>
              </div>
              <p><a href="#">See more</a></p>
            </div>

            <div className="col">
              <h2>Spring deals by category</h2>
              <div className="gallery-four-image">
                <div>
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BSS/Homepage_DO_DesktopQuadCards_372x232_Camera_12b._SY232_CB579733640_.jpg" />
                </div>
                <div>
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BSS/Homepage_DO_DesktopQuadCards_372x232_DIYGarden_12b._SY232_CB579733640_.jpg" />
                </div>
                <div>
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BSS/Homepage_DO_DesktopQuadCards_372x232_Mobile_12b._SY232_CB579733640_.jpg" />
                </div>
                <div>
                  <img src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BSS/Homepage_DO_DesktopQuadCards_372x232_OfficeSchool_12b._SY232_CB579733640_.jpg" />
                </div>
              </div>
              <p><a href="#">See more</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
