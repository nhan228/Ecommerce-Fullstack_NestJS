import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '@/store'
import ProductCreateForm from './component/create-form'
import DetailShow from './component/detail'
import ProductEdit from './component/update-form'
import { Modal } from 'antd'
import api from '@services/apis'
import { productAction } from '@/store/slices/product.slice'
import { useNavigate } from 'react-router-dom'
import { categoryAction } from '@/store/slices/category.slice'
import { brandAction } from '@/store/slices/brand.slice'

import './product.scss'

export default function ProductList() {
  const dispatch = useDispatch()
  const productStore = useSelector((store: Store) => store.productStore)
  const memberStore = useSelector((store: Store) => store.memberStore)
  const [updateData, setUpdateData] = useState({})
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const navigate = useNavigate()

  function convertToVND(num: number) {
    var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    return vnd;
  }

  // product
  useEffect(() => {
    try {
      api.productApi.findMany()
        .then(async (res) => {
          dispatch(productAction.setProduct(res.data.data))
          console.log("products", res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  // category
  useEffect(() => {
    try {
      api.categoryApi.findMany()
        .then(res => {
          dispatch(categoryAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  // brand
  useEffect(() => {
    try {
      api.brandApi.findMany()
        .then(res => {
          dispatch(brandAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  return (
    <div className='product-box'>
      <div className='product-title'>
        <h2>Product List</h2>
        {/* create */}
        {
          memberStore.data?.permission.includes('c:product') && (
            <button className='button-create' onClick={() =>
              dispatch(productAction.loadModal())
            }><i className="fa-solid fa-plus" /> Create New Product</button>
          )
        }

        {/* recycle */}
        {
          memberStore.data?.permission.includes('r:product' && 'u:product' && 'd:product') && (
            <button className='recycle' onClick={() =>
              navigate('/product/recycle')
            }><i className="fa-solid fa-recycle"></i> Recycle bin</button>
          )
        }

      </div>
      {
        productStore.addModal && <ProductCreateForm dispatch={dispatch} updateData={updateData} setUpdateData={setUpdateData}/>
      }
      {
        showDetail && <DetailShow showDetail={showDetail} setShowDetail={setShowDetail} updateData={updateData} setUpdateData={setUpdateData} />
      }
      {
        showEdit && <ProductEdit showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} setUpdateData={setUpdateData} />
      }
      {/* PRODUCT TABLE */}
      <div className='product-table'>
        <table>
          {/* header */}
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              {
                memberStore?.data?.permission.includes('u:product') && (
                  <th>Detail</th>
                )
              }
              <th>Tools</th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {
              productStore.data?.map((product, index) => {
                if (product.status) {
                  return (
                    <tr key={Date.now() * Math.random()}>
                      <td>{index + 1}</td>
                      <td>
                        <img src={product.avatar} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{product.category?.title}</td>
                      <td>{product.brand?.title}</td>
                      <td>{convertToVND(Number(product.price))}</td>
                      {
                        memberStore?.data?.permission.includes('u:product') && (
                          <td>
                            <button
                              onClick={() => {
                                setShowDetail(!showDetail);
                                setUpdateData({ id: product.id, category: product.category, detail: JSON.parse(product.detail) })
                              }}
                              className='btn btn-success'>Update
                            </button>
                          </td>
                        )
                      }
                      <td>
                        <button
                          onClick={() => {
                            setShowEdit(!showEdit);
                            setUpdateData({ product })
                          }}
                          className='btn btn-primary' style={{ marginRight: 5 }}>Edit</button>
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Do you want to delete this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.productApi.updateDes(Number(product.id), { status: false })

                                    if (result.status == 200) {
                                      dispatch(productAction.update(result.data.data))
                                    }
                                  } catch (err) {
                                    console.log('err', err);
                                  }
                                },
                                onCancel: () => { }

                              })
                            }}
                            className="btn btn-danger"
                          >Delete</button>
                        }
                      </td>
                    </tr>
                  )
                }
              })
            }
          </tbody>
        </table >
      </div>
    </div>
  )
}
