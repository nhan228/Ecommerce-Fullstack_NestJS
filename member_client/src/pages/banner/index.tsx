import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '@/store'
import CreateForm from './create-form'
import UpdateForm from './update-form'
import api from '@services/apis'
import { Banners, bannerAction } from '@/store/slices/banner.slice'

import './banner.scss'

export default function BannerList() {
  const [formCreate, setFormCreate] = useState<boolean>(false)
  const [formUpdate, setFormUpdate] = useState<boolean>(false)
  const [selectedBanner, setSelectedBanner] = useState<null | Banners>(null)
  const memberStore = useSelector((store: Store) => store.memberStore)
  const bannerStore = useSelector((store: Store) => store.bannerStore)
  const dispatch = useDispatch()

  const handleOpenCreateForm = () => {
    setFormCreate(!formUpdate)
  }

  // get data
  useEffect(() => {
    api.bannerApi.find()
      .then(res => {
        if (res.status == 200) {
          dispatch(bannerAction.setData(res.data.data))
        }
      })
      .catch(err => {
        console.log('lỗi:', err);
      })
  }, [])

  return (
    <div className='body-banner'>
      <div className='banner-title'>
        <h2>Banner list</h2>
        {
          memberStore.data?.permission.includes('c:banner') && (
            <button onClick={handleOpenCreateForm}><i className="fa-solid fa-plus" /> Create Banner</button>
          )
        }
      </div>

      {/* BANNER TABLE */}
      <div className='banner-table'>
        <table>
          {/* header */}
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Image</th>
              <th>Status</th>
              <th>Create At</th>
              <th>Update At</th>
              <th>Tools</th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {
              bannerStore.data?.map((item, index) => (
                <tr key={Date.now() * Math.random()}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>
                    <img src={import.meta.env.VITE_SERVER + "/" + item.img} style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%"
                    }} />
                  </td>
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

                  <td>
                    {`${(new Date(item.createAt)).getDate()}/${(new Date(item.createAt)).getMonth() + 1}/${(new Date(item.createAt)).getFullYear()} - ${(new Date(item.createAt)).getHours()}h : ${String((new Date(item.createAt)).getMinutes()).padStart(2, '0')}'`}
                  </td>

                  {
                    item.updateAt ? (
                      <td>
                        {`${(new Date(item.updateAt)).getDate()}/${(new Date(item.updateAt)).getMonth() + 1}/${(new Date(item.updateAt)).getFullYear()} - ${(new Date(item.updateAt)).getHours()}h : ${String((new Date(item.updateAt)).getMinutes()).padStart(2, '0')}'`}
                      </td>
                    ) : (
                      <td></td>
                    )
                  }

                  {
                    memberStore?.data?.permission.includes('u:banner' && 'd:banner') ? (
                      <td>
                        {
                          memberStore.data.permission?.includes('u:banner') && (
                            <button type='button' onClick={() => {
                              setSelectedBanner(item)
                              setFormUpdate(!formUpdate)
                            }} className='update-btn'>Update</button>
                          )
                        }
                        {
                          memberStore.data.permission?.includes('d:banner') && (
                            <button type='button' className='delete-btn'>Delete</button>
                          )
                        }
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
      {/* upadate */}
      {
        formUpdate && <UpdateForm selectedBanner={selectedBanner} setFormUpdate={setFormUpdate} />
      }
    </div>
  )
}
