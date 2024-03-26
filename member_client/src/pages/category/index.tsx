import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '@/store'
import CreateForm from './create-form'
import api from '@services/apis'
import { AvailableStatus, categoryAction } from '@/store/slices/category.slice'
import { Modal, message } from 'antd'

import './category.scss'

export default function CategoryList() {
  const [formCreate, setFormCreate] = useState<boolean>(false)
  const memberStore = useSelector((store: Store) => store.memberStore)
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const dispatch = useDispatch()

  const handleOpenCreateForm = () => {
    setFormCreate(!formCreate)
  }

  const handleUpdate = async (id: number, currentStatus: AvailableStatus) => {
    const newStatus = currentStatus == 'active' ? 'inactive' : 'active'

    api.categoryApi.update(id, { status: newStatus })
      .then((res: any) => {
        if (res.status == 200) {
            dispatch(categoryAction.updateCategory(res.data.data))
            message.success("Update status category successfully!")
        }
      })
      .catch((err: any) => {
        Modal.warning({
          title: 'Warning',
          content: `${err.response?.data?.err}`,
          onOk() {
          }
        })
      })
  }

  // get data
  useEffect(() => {
    api.categoryApi.findMany()
      .then(res => {
        if (res.status == 200) {
          dispatch(categoryAction.setData(res.data.data))
        }
      })
      .catch(err => {
        console.log('err:', err);
      })
  }, [])

  return (
    <div className='body-category'>
      <div className='category-title'>
        <h2>Category list</h2>
        {
          memberStore.data?.permission.includes('c:category') && (
            <button onClick={handleOpenCreateForm}><i className="fa-solid fa-plus" /> Create Category</button>
          )
        }
      </div>

      {/* CATEGORY TABLE */}
      <div className='category-table'>
        <table>
          {/* header */}
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>CodeName</th>
              <th>Status</th>
              <th>Tools</th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {
              categoryStore.category?.map((item, index) => (
                <tr key={Date.now() * Math.random()}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.codeName}</td>
                  {
                    item.status == "active" ? (
                      <td>
                        <div className='status-container'>
                          <div className='status-box'>
                            <div className='active'>ACTIVE</div>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td>
                        <div className='status-container'>
                          <div className='status-box'>
                            <div className='inactive'>INACTIVE</div>
                          </div>
                        </div>
                      </td>
                    )
                  }

                  {
                    memberStore?.data?.permission.includes('u:category' && 'd:category') ? (
                      <td>
                        <div className='load-contanier'>
                          <div className='load-group'>
                            <button type='button' onClick={() => handleUpdate(item.id, item.status)} className='change-btn'>Change status</button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td>
                        <span>Permission Denied</span>
                      </td>
                    )
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {/* create */}
      {
        formCreate && <CreateForm setFormCreate={setFormCreate} />
      }
    </div>
  )
}
