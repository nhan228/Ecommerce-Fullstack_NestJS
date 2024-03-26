import pictures from '@/pictures'
import { Store } from '@/store'
import { userAction } from '@/store/slices/user.slice'
import MultiLanguage from '@components/MultiLangue/MultiLang'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const userStore = useSelector((store: Store) => store.userStore)
  const receiptStore = useSelector((store: Store) => store.receiptStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation();

  return (
    <nav className='navbar-amazon'>
      {/* Logo */}
      <div className="nav-logo border-amazon" onClick={() => {
        window.location.href = "/"
      }}>
        <div className="logo ">
        </div>
      </div>

      {/* Delivery  */}
      <div className="nav-address border-amazon mobile-hidden">
        <div className='left'>
          <i className="fa-solid fa-location-dot"></i>
        </div>
        <div className='right'>
          <div className='content'>Delivery to</div>
          <div className="location">VietNam</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <div className="select-box">
          <select>
            <option value="All">All</option>
          </select>
        </div>
        <div className="search-input">
          <input type="text" placeholder="Search Amazon" />
        </div>
        <div className="search-icon">
          <i className="fa-solid fa-magnifying-glass" />
        </div>
      </div>

      {/* Langue */}
      <div className="language-box border-amazon mobile-hidden">
        <MultiLanguage />
      </div>

      {/* User */}
      {/* Have user data */}
      {
        userStore.data ? (
          <>
            <div className='dropdown-amazon nav-same-format border-amazon mobile-hidden'>
              <div className="account-box">
                <p>
                  <span>Hello,
                    {
                      userStore.data.firstName ? (
                        <span className='store-name' style={{ color: '#febd69' }}> {userStore.data.firstName}</span>
                      ) : (
                        <span className='store-name' style={{ color: '#febd69' }}>{userStore.data.email.split('@')[0].replace(/\d+/g, '')}</span>
                      )
                    }
                  </span>
                </p>
                <p>
                  Account &amp; Lists
                  <i className="fa-solid fa-caret-down" />
                </p>
              </div>
              <div className='arrow'></div>

              <div className='dropdown-amazon-menu'>
                <div onClick={() => {
                  window.location.href = "/receipts"
                }}>Receipts</div>
                <div onClick={() => {
                  Modal.confirm({
                    title: "Notification",
                    content: "Are you sure you want to log out?",
                    onOk: async () => {
                      localStorage.removeItem("token")
                      dispatch(userAction.setData(null))
                    }
                  })
                }}>Logout
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="account-box nav-same-format border-amazon mobile-hidden" onClick={() => {
              window.location.href = '/authen';
            }}>
              <p>
                <span>Hello, sign in</span>
              </p>
              <p>
                Account &amp; Lists
                <i className="fa-solid fa-caret-down" />
              </p>
            </div>
          </>
        )
      }

      {/* Order  */}
      <div className="return-box nav-same-format border-amazon mobile-hidden">
        <p>Returns</p>
        <span>&amp; Orders</span>
      </div>

      {/* Cart  */}
      <div className="cart-box border-amazon" onClick={() => {
        navigate("/cart")
      }}>

        <span className="total-item">
          {
            (() => (receiptStore.cart?.detail?.reduce((total: number, cur: any) => total + cur.quantity, 0) || 0))()
          }
        </span>
        <img src={pictures.cart} />
        <p>Cart</p>
      </div>
    </nav >
  )
}
