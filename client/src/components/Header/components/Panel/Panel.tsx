import { Store } from "@/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./panel.scss";

export default function Panel({ toggleSidebar }: any) {
  const productStore = useSelector((store: Store) => store.productStore)
  console.log('productStore', productStore);
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  console.log('categoryStore', categoryStore);
  const brandStore = useSelector((store: Store) => store.brandStore)
  console.log('brandStore', brandStore)
  const navigate = useNavigate()

  let icon: any = [
    {
      title: "Laptop",
      icon: "fa-solid fa-laptop"
    },
    {
      title: "PC",
      icon: "fa-solid fa-computer"
    },
    {
      title: "Phone",
      icon: "fa-solid fa-mobile-screen"
    },
    {
      title: "Audio equipments",
      icon: "fa-solid fa-volume-high"
    },
    {
      title: "Accessory",
      icon: "fa-regular fa-keyboard"
    }
  ]

  return (
    <div className="panel">
      <div className="panel-all border-amazon" onClick={toggleSidebar} style={{cursor:'pointer'}}>
        <i className="fa-solid fa-bars" />
        <span >All</span>
      </div>
      <div className="black"></div>

      <nav className="panel-links">
        {
          categoryStore.data?.map((item: any) => {
            if (item.status == 'active') {
              return (
                <div style={{ zIndex: 100 }}
                  className={`item ${item.codeName && "sup"} border-amazon`} key={Date.now() * Math.random()}
                  onClick={() => {
                    navigate(`/category/${item.title}/all`)
                  }}
                >
                  <i style={{ color: '#fff' }} className={icon.find((currentIcon: any) => currentIcon.title == item.title) ? icon.find((currentIcon: any) => currentIcon.title == item.title).icon : "game-controller-outline"}></i>
                  <div
                    style={{ zIndex: 9999 }}
                  >
                    <span style={{ color: '#fff' }}>{item.title}</span>
                  </div>

                  {
                    brandStore.data && (
                      <div className='sup_menu'>
                        {
                          brandStore.data.map(supItem => {
                            try {
                              if (productStore.data?.find(currentProduct => currentProduct.categoryId == item.id && currentProduct.brandId == supItem.id) && supItem.status) {
                                return (
                                  <div onClick={() => {
                                    navigate(`/category/${item.title}/${supItem.title}`)
                                    console.log(supItem.title);
                                  }}
                                    key={Date.now() * Math.random()}
                                    className='sup_menu_item'>
                                    {supItem.title}
                                  </div>
                                )
                              }
                            } catch (err) {
                              console.log(err);
                            }
                          }
                          )
                        }
                      </div>
                    )
                  }
                </div>
              )
            }
          })
        }
      </nav>
    </div>
  )
}
