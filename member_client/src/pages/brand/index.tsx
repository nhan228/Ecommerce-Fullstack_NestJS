import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '@/store'
import CreateForm from './create-form'
import api from '@services/apis'
import { AvailableStatus, brandAction } from '@/store/slices/brand.slice'
import { Modal, message } from 'antd'

import './brand.scss'

export default function BrandList() {
  const [formCreate, setFormCreate] = useState<boolean>(false)
  const memberStore = useSelector((store: Store) => store.memberStore)
  const brandStore = useSelector((store: Store) => store.brandStore)
  const dispatch = useDispatch()

  const handleUpdate = async (id: number, currentStatus: AvailableStatus) => {
    const newStatus = currentStatus == 'active' ? 'inactive' : 'active'

    api.brandApi.update(id, { status: newStatus })
      .then((res: any) => {
        if (res.status == 200) {
            dispatch(brandAction.update(res.data.data))
            message.success("Update status brand successfully!")
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

  const handleOpenCreateForm = () => {
    setFormCreate(!formCreate)
  }

  // get data
  useEffect(() => {
    api.brandApi.findMany()
      .then(res => {
        if (res.status == 200) {
          dispatch(brandAction.setData(res.data.data))
        }
      })
      .catch(err => {
        console.log('err:', err);
      })
  }, [])

  return (
    <div className='body-brand'>
      <div className='brand-title'>
        <h2>Brand list</h2>
        {
          memberStore.data?.permission.includes('c:brand') && (
            <button onClick={handleOpenCreateForm}><i className="fa-solid fa-plus" /> Create brand</button>
          )
        }
      </div>

      {/* brand TABLE */}
      <div className='brand-table'>
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
              brandStore.data?.map((item, index) => (
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
                    memberStore?.data?.permission.includes('u:brand' && 'd:brand') ? (
                      <td>
                        <div className='load-contanier'>
                          <div className='load-group'>
                            <button type='button' className='change-btn' onClick={() => handleUpdate(item.id, item.status)}>
                              Change status</button>
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
