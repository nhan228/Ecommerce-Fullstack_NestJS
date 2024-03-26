import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import api from '@services/apis'
import { Modal, message } from 'antd'
import { Store } from "@/store"
import { receiptAction } from '@slices/receipt.slice'
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit'
import pictures from '@/pictures'

import './productinfo.scss'

export default function ProductInfo() {
  const computerType = ['Laptop', 'PC']
  const phoneType = ['Phone']
  let product: any = null
  let detail: any = null

  const productStore = useSelector((store: Store) => store.productStore)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  let { id } = useParams()

  product = productStore.data?.filter(item => item.id == Number(id))
  detail = JSON.parse(product[0].detail)

  const [mainImage, setMainImage] = useState(product[0]?.pictures[0]?.url)
  const [showInfo, setShowInfo] = useState(false)
  const handleThumbnailHover = (thumbnailPath: any) => {
    setMainImage(thumbnailPath)
  }

  const dispatch = useDispatch()
  const { categoryName } = useParams()

  function convertToVND(num: number) {
    var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    return vnd;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [])

  useEffect(() => {

  }, [categoryName])

  // add to cart
  async function handleAddToCart(productId: number, quantity: any) {
    try {
      if (!isLoggedIn) {
        Modal.warning({
          title: 'Notification',
          content: 'Login to continue shopping!',
          onOk: () => {
            window.location.href = '/authen'
          },
        })
        return
      }
      let item = {
        productId,
        quantity
      }
      let result = await api.receiptApi.addToCart(item);
      console.log('r',result);
      
      dispatch(receiptAction.setCart(result.data.data))
      message.success({
        content: 'The product has been added to your cart!',
      })
    } catch (err) {
      alert("An error occurred while adding to cart")
      console.log('err', err);
    }
  }

  return (
    <div className='product_info_container'>
      <div className='product_info'>
        <div className='product_info_img'>
          <div className='img_show'>
            <div className="image-gallery">
              <div className="main-image">
                <img src={mainImage} alt="Main Image" />
              </div>
              <div className="thumbnail-images">
                {product[0]?.pictures?.map((item: any) => {
                  return (
                    <div className="thumbnail" onMouseEnter={() => handleThumbnailHover(item.url)}>
                      <img src={item.url} alt="Thumbnail 1" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          <div className='img_info'>
            <h4>Product Introduction: </h4>
            <p>{product[0]?.des}</p>
          </div>
        </div>

        <div className='info_detail'>
          <div className='name'>
            <h4>{product[0]?.name}</h4>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>

          <div className='detail'>
            <p>Color:</p>
            <button>Color</button>
            <h5>{convertToVND(product[0]?.price)}</h5>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          <div className='checkout'>
            <div className='policy'>
              <h5>Sales policy:</h5>
              <i className="fa-solid fa-truck-fast"></i><span>Free delivery for orders of 5 million or more</span><br />
              <i className="fa-solid fa-check-to-slot"></i><span>Commitment to 100% genuine products </span><br />
              <i className="fa-solid fa-comments-dollar"></i><span>Easy payment</span><br />
              <i className="fa-solid fa-headset"></i><span>Enthusiastic support 24/7</span>
            </div>

            <button className="CartBtn" onClick={() => {
              handleAddToCart(product[0]?.id, 1)
            }}>
              <span className="IconContainer">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="#fff" className="cart"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
              </span>
              <p className="text">Add to cart</p>
            </button>
          </div>

        </div>
      </div>

      <div className='info'>
        <div className='company'>
          <img src={pictures.detail}></img>
          <p>AMAZON</p>
          <svg
            fill="currentColor"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 477.867 477.867"
            className="css-1ptts6n"
            color="green"
            height={14}
            width={14}
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: 8, marginBottom: 4 }}
          >
            <g>
              <g>
                <path
                  d="M238.933,0C106.974,0,0,106.974,0,238.933s106.974,238.933,238.933,238.933s238.933-106.974,238.933-238.933
			C477.726,107.033,370.834,0.141,238.933,0z M370.466,165.666L199.799,336.333c-6.665,6.663-17.468,6.663-24.132,0l-68.267-68.267
			c-6.78-6.548-6.968-17.352-0.42-24.132c6.548-6.78,17.352-6.968,24.132-0.42c0.142,0.138,0.282,0.277,0.42,0.42l56.201,56.201
			l158.601-158.601c6.78-6.548,17.584-6.36,24.132,0.419C376.854,148.567,376.854,159.052,370.466,165.666z"
                />
              </g>
            </g>
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
          </svg>
        </div>

        <div className='detail_product_info'>
          <h5>Details</h5>
          <MDBTable striped>
            <MDBTableBody>
              {detail.brand &&
                <tr>
                  <th scope='row'>Brand</th>
                  <td>{detail.brand}</td>
                </tr>}
              {detail.category &&
                <tr>
                  <th scope='row'>Category</th>
                  <td>{detail.category}</td>
                </tr>}
              {detail.name &&
                <tr>
                  <th scope='row'>Name</th>
                  <td>{detail.name}</td>
                </tr>}
              {detail.guarantee &&
                <tr>
                  <th scope='row'>Guarantee</th>
                  <td>{detail.guarantee}</td>
                </tr>}
              {detail.warrantyDes &&
                <tr>
                  <th scope='row'>Warranty Describle</th>
                  <td>{detail.warrantyDes}</td>
                </tr>}
              {detail.series &&
                <tr>
                  <th scope='row'>Series</th>
                  <td>{detail.series}</td>
                </tr>}
              {detail.partNum &&
                <tr>
                  <th scope='row'>Part-number</th>
                  <td>{detail.partNum}</td>
                </tr>}

            </MDBTableBody>
          </MDBTable>
          <div className='product_more_container'>
            <div className='product_info_more' onClick={() => {
              setShowInfo(!showInfo)
            }}>See more content <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>
      
      {
        showInfo &&
        <div className='product_info_container' >
          <div className='product_info_background'></div>

          <div className='product_info_content'>
            <div className='close' onClick={() => { setShowInfo(!showInfo) }}>X</div>
            <h5 style={{ position: 'sticky', top: '0', width: '95%' }}>Detailed configuration</h5>
            {
              computerType.find(item => item == product[0]?.category.title) && <MDBTable striped>
                <MDBTableBody>
                  {detail.brand &&
                    <tr>
                      <th scope='row'>Brand</th>
                      <td>{detail.brand}</td>
                    </tr>}
                  {detail.category &&
                    <tr>
                      <th scope='row'>Category</th>
                      <td>{detail.category}</td>
                    </tr>}
                  {detail.name &&
                    <tr>
                      <th scope='row'>Name</th>
                      <td>{detail.name}</td>
                    </tr>}
                  {detail.guarantee &&
                    <tr>
                      <th scope='row'>Guarantee</th>
                      <td>{detail.guarantee}</td>
                    </tr>}
                  {detail.warrantyDes &&
                    <tr>
                      <th scope='row'>Warranty Describle</th>
                      <td>{detail.warrantyDes}</td>
                    </tr>}
                  {detail.series &&
                    <tr>
                      <th scope='row'>Series</th>
                      <td>{detail.series}</td>
                    </tr>}
                  {detail.partNum &&
                    <tr>
                      <th scope='row'>Part-number</th>
                      <td>{detail.partNum}</td>
                    </tr>}
                  {detail.color &&
                    <tr>
                      <th scope='row'>Color</th>
                      <td>{detail.color}</td>
                    </tr>}
                  {detail.demand &&
                    <tr>
                      <th scope='row'>Demand</th>
                      <td>{detail.demand}</td>
                    </tr>}
                  <tr>
                    <th colSpan={2}>Detailed configuration</th>

                  </tr>
                  {detail.CPUgen &&
                    <tr>
                      <th scope='row'>CPU generation</th>
                      <td>{detail.CPUgen}</td>
                    </tr>}
                  {detail.CPU &&
                    <tr>
                      <th scope='row'>CPU</th>
                      <td>{detail.CPU}</td>
                    </tr>}
                  {detail.graphic &&
                    <tr>
                      <th scope='row'>Graphics chips</th>
                      <td>{detail.graphic}</td>
                    </tr>}
                  {detail.RAM &&
                    <tr>
                      <th scope='row'>RAM</th>
                      <td>{detail.RAM}</td>
                    </tr>}
                  {detail.screen &&
                    <tr>
                      <th scope='row'>Screen</th>
                      <td>{detail.screen}</td>
                    </tr>}
                  {detail.storage &&
                    <tr>
                      <th scope='row'>Storage</th>
                      <td>{detail.storage}</td>
                    </tr>}
                  {detail.storagePort &&
                    <tr>
                      <th scope='row'>Maximum number of storage ports</th>
                      <td>{detail.storagePort}</td>
                    </tr>}
                  {detail.M2Port &&
                    <tr>
                      <th scope='row'>M.2 slot type supported</th>
                      <td>{detail.M2Port}</td>
                    </tr>}
                  {detail.outputPort &&
                    <tr>
                      <th scope='row'>Output port</th>
                      <td>{detail.outputPort}</td>
                    </tr>}
                  {detail.connector &&
                    <tr>
                      <th scope='row'>Connector</th>
                      <td>{detail.connector}</td>
                    </tr>}
                  {detail.wireless &&
                    <tr>
                      <th scope='row'>Wireless Connectivity</th>
                      <td>{detail.wireless}</td>
                    </tr>}
                  {detail.keyboard &&
                    <tr>
                      <th scope='row'>Keyboard</th>
                      <td>{detail.keyboard}</td>
                    </tr>}
                  {detail.system &&
                    <tr>
                      <th scope='row'>Operating system</th>
                      <td>{detail.system}</td>
                    </tr>}
                  {detail.size &&
                    <tr>
                      <th scope='row'>Size</th>
                      <td>{detail.size}</td>
                    </tr>}
                  {detail.battery &&
                    <tr>
                      <th scope='row'>The battery</th>
                      <td>{detail.battery}</td>
                    </tr>}
                  {detail.mass &&
                    <tr>
                      <th scope='row'>Mass</th>
                      <td>{detail.mass}</td>
                    </tr>}
                  <tr>
                    <th colSpan={2}>Other information</th>

                  </tr>
                  <tr>
                    <th colSpan={2}>Size information</th>

                  </tr>
                </MDBTableBody>
              </MDBTable>
            }
            {
              phoneType.find(item => item == product[0]?.category.title) && <MDBTable striped>
                <MDBTableBody>
                  {detail.brand &&
                    <tr>
                      <th scope='row'>Brand</th>
                      <td>{detail.brand}</td>
                    </tr>}
                  {detail.category &&
                    <tr>
                      <th scope='row'>Category</th>
                      <td>{detail.category}</td>
                    </tr>}
                  {detail.name &&
                    <tr>
                      <th scope='row'>Name</th>
                      <td>{detail.name}</td>
                    </tr>}
                  {detail.guarantee &&
                    <tr>
                      <th scope='row'>Guarantee</th>
                      <td>{detail.guarantee}</td>
                    </tr>}
                  {detail.warrantyDes &&
                    <tr>
                      <th scope='row'>Warranty Describle</th>
                      <td>{detail.warrantyDes}</td>
                    </tr>}
                  {detail.series &&
                    <tr>
                      <th scope='row'>Series</th>
                      <td>{detail.series}</td>
                    </tr>}
                  {detail.color &&
                    <tr>
                      <th scope='row'>Color</th>
                      <td>{detail.color}</td>
                    </tr>}

                  <tr>
                    <th colSpan={2}>Screen</th>

                  </tr>
                  {detail.screen &&
                    <tr>
                      <th scope='row'>Screen</th>
                      <td>{detail.screen}</td>
                    </tr>}
                  {detail.resolution &&
                    <tr>
                      <th scope='row'>Resolution</th>
                      <td>{detail.resolution}</td>
                    </tr>}

                  <tr>
                    <th colSpan={2}>Configuration</th>
                  </tr>

                  {detail.chip &&
                    <tr>
                      <th scope='row'>Chips</th>
                      <td>{detail.chip}</td>
                    </tr>}
                  {detail.storage &&
                    <tr>
                      <th scope='row'>Storage</th>
                      <td>{detail.storage}</td>
                    </tr>}
                  {detail.system &&
                    <tr>
                      <th scope='row'>Operating system</th>
                      <td>{detail.system}</td>
                    </tr>}
                  {detail.battery &&
                    <tr>
                      <th scope='row'>The battery</th>
                      <td>{detail.battery}</td>
                    </tr>}
                  {detail.batteryTech &&
                    <tr>
                      <th scope='row'>Battery technology</th>
                      <td>{detail.batteryTech}</td>
                    </tr>}
                  {detail.chargPort &&
                    <tr>
                      <th scope='row'>Charging port</th>
                      <td>{detail.chargPort}</td>
                    </tr>}
                  {detail.sim &&
                    <tr>
                      <th scope='row'>Sim type</th>
                      <td>{detail.sim}</td>
                    </tr>}

                  {detail.mobileNet &&
                    <tr>
                      <th scope='row'>Mobile network</th>
                      <td>{detail.mobileNet}</td>
                    </tr>}

                  <tr>
                    <th colSpan={2}>Camera</th>
                  </tr>

                  {detail.rearCam &&
                    <tr>
                      <th scope='row'>Rear camera</th>
                      <td>{detail.rearCam}</td>
                    </tr>}

                  {detail.fontCam &&
                    <tr>
                      <th scope='row'>Front camera</th>
                      <td>{detail.fontCam}</td>
                    </tr>}

                  <tr>
                    <th colSpan={2}>Connect</th>
                  </tr>

                  {detail.WIFI &&
                    <tr>
                      <th scope='row'>WIFI</th>
                      <td>{detail.WIFI}</td>
                    </tr>}

                  {detail.GPS &&
                    <tr>
                      <th scope='row'>GPS</th>
                      <td>{detail.GPS}</td>
                    </tr>}

                  {detail.bluetooth &&
                    <tr>
                      <th scope='row'>Bluetooth</th>
                      <td>{detail.bluetooth}</td>
                    </tr>}

                  {detail.headjack &&
                    <tr>
                      <th scope='row'>Headphone jack</th>
                      <td>{detail.headjack}</td>
                    </tr>}

                  <tr>
                    <th colSpan={2}>Connect</th>
                  </tr>
                  {detail.size &&
                    <tr>
                      <th scope='row'>Size</th>
                      <td>{detail.size}</td>
                    </tr>}
                  {detail.mass &&
                    <tr>
                      <th scope='row'>Mass</th>
                      <td>{detail.mass}</td>
                    </tr>}
                  <tr>
                    <th colSpan={2}>Other information</th>

                  </tr>
                  <tr>
                    <th colSpan={2}>Size information</th>

                  </tr>
                </MDBTableBody>
              </MDBTable>
            }
          </div>
        </div>
      }
    </div>
  )
}
