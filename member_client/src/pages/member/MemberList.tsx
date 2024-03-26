import { Store } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import AddForm from './components/addForm/AddForm'
import { member, memberAction } from '@/store/slices/member.slice';
import api from '@services/apis';
import { useNavigate } from 'react-router-dom';

import './memberList.scss'

export default function MemberList() {
  const dispatch = useDispatch();
  const memberStore = useSelector((store: Store) => store.memberStore);
  const permissionItems = ["c", "r", "u", "d"];
  const permissionNames = ["log", "member", "category", "banner", "product", "brand", "user", "vocher"]
  const [memberSelectData, setMemberSelectData] = useState<null | member>(null)
  const navigate = useNavigate()

  function checkPer(tableName: string, perName: string, memberPerString: string) {
    let memberPer = (JSON.parse(memberPerString) as string[]);

    let perCheck = memberPer.find(item => item.split(':')[0] == perName && item.split(':')[1] == tableName);
    if (!perCheck) return false
    return true
  }

  function handleAddMember() {
    dispatch(memberAction.setDisplayAddForm())
  }

  useEffect(() => {
    if (!memberStore.list) return
    setMemberSelectData(memberStore.list.find(item => item.id == memberSelectData?.id) || null)
  }, [memberStore.list])

  return (
    <div className='member_app_box'>
      <div className='member-title'>
        <h2>Member List</h2>
        {
          memberStore.data?.role == 'master' && (
            <button className='online-list' onClick={() => navigate('/member/online-list')}><i className="fa-regular fa-eye" /> View Online List</button>
          )
        }
       
        {
          memberStore.data?.permission.includes('c:member') && (
            <button className='add-button' onClick={handleAddMember}>
              <i className="fa-solid fa-plus" /> Add new member
            </button>
          )
        }
      </div>

      {/* MEMBER LIST TABLE */}
      <div className='member-list-box'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Login Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Email Status</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Permission</th>
            </tr>
          </thead>

          <tbody>
            {
              memberStore.list?.map(item => (
                <tr key={Date.now() * Math.random()}>
                  <td>{item.id}</td>
                  <td>{item.loginId}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                  <td>{item.emailConfirm.toString()}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.role}</td>
                  <td>
                    <button className='button-show' onClick={() => setMemberSelectData(item)}>Show</button>
                  </td>
                </tr>
              ))
            }

            <Modal open={memberSelectData != null} onOk={() => setMemberSelectData(null)} onCancel={() => setMemberSelectData(null)}>
              {
                memberSelectData &&
                <>
                  <div className='change-per-table'>
                    <h3>Member Permissions </h3>
                    {/* Permission */}
                    <table>
                      <thead>
                        <tr>
                          <th>Table</th>
                          <th>Create</th>
                          <th>Read</th>
                          <th>Update</th>
                          <th>Delete</th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          permissionNames.map(tableName => (
                            <tr key={Date.now() * Math.random()}>
                              <td>{tableName}</td>
                              {permissionItems.map((perName) => (
                                <td onClick={() => {
                                  let data = {
                                    permission: !checkPer(tableName, perName, memberSelectData.permission) ?
                                      JSON.stringify([...(JSON.parse(memberSelectData.permission)), `${perName}:${tableName}`]) :
                                      JSON.stringify((JSON.parse(memberSelectData.permission)).filter((item: any) => item != `${perName}:${tableName}`))
                                  }
                                  api.memberApi.changePermission(memberSelectData.id, data)
                                    .then(res => {
                                      if (res.status == 200) {
                                        message.success("Permission changed success")
                                        dispatch(memberAction.updateList(res.data.data))
                                      }
                                    })
                                    .catch(err => {
                                      console.log("err", err)
                                    })
                                }} style={{ cursor: "pointer" }} key={Date.now() * Math.random()}>{
                                    checkPer(tableName, perName, memberSelectData.permission) ? '✅' : '❌'
                                  }
                                </td>
                              ))}
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </>
              }
            </Modal>

          </tbody>
        </table>
      </div>
      {
        memberStore.displayAddForm && <AddForm />
      }
    </div>
  )
}