import { useState, useEffect } from 'react'
import { Table, Modal, Button } from 'react-bootstrap';
import { Modal as AntdModal } from 'antd'
import api from '@services/apis'
import { useSelector, useDispatch } from 'react-redux';
import UserCreateForm from './components/create-form';
import { userAction } from '@slices/user.slice';
import { useNavigate } from 'react-router-dom';
import UserEditForm from './components/edit-form';
import { Store } from '@/store'
import { receiptAction } from '@/store/slices/receipt.slice';
import { addressAction } from '@/store/slices/address.slice';

import './userList.scss'

export default function UserList() {
  const memberStore = useSelector((store: Store) => store.memberStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userStore = useSelector((store: Store) => store.userStore)
  const [showAddress, setShowAddress] = useState(false);
  const [updateData, setupdateData] = useState({
    id: Number,
    user_ip_list: [],
    address: [],
    receipts: []
  })
  const [showIp, setShowIp] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [display, setDisplay] = useState(false)
  const [currentRecreipt, setCurrentRecreipt] = useState<any>(null)
  const [show, setShow] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRecycle, setShowRecycle] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [getUser, setGetUser] = useState(false);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }

  function convertToVND(num: number) {
    var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    return vnd;
  }

  console.log('data', updateData);

  const handleConfirm = async () => {
    try {
      let result = await api.userApi.update(Number(updateData?.id), { status: false });
      console.log('re', result);

      if (result.status == 200) {
        dispatch(userAction.update(result.data.data));
      }
    } catch (err: any) {
      console.log('err', err);
      window.alert(`${err.response.data.message}`)
    }
    setShow(false);
  }

  const handleCancel = () => {
    setShow(false);
  }

  useEffect(() => {
    try {
      api.userApi.findMany()
        .then(async (res: any) => {
          dispatch(userAction.setList(res.data.data))
        })
        .catch((err: any) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [getUser])

  // address
  useEffect(() => {
    try {
      api.addressApi.findMany()
        .then(res => {
          dispatch(addressAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  // receipt
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    try {
      api.receiptApi.findMany()
        .then(res => {
          let cart = null;
          let receipt = [];
          for (let i in res.data.data) {
            if (res.data.data[i].status == "shopping") {
              cart = res.data.data[i]
            } else {
              receipt.push(res.data.data[i])
            }
          }
          dispatch(receiptAction.setCart(cart))
          dispatch(receiptAction.setReceipt(receipt))
        })
        .catch(err => { })
    } catch (err) { }
  }, [])

  return (
    <div className='user-box'>
      {
        userStore.addModal && <UserCreateForm dispatch={dispatch} />
      }
      {
        showEdit && <UserEditForm showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} />
      }
      <div className='user-title'>
        <h2>User List</h2>
        {
          memberStore.data?.permission.includes('d:user' && 'u:user') && (
            <button className='ban-list' onClick={() =>
              navigate('/user/banlist')
            }><i className="fa-solid fa-ban" /> Ban List</button>
          )
        }
      </div>

      <div className='user-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Create At</th>
              <th>Update At</th>
              <th>Address</th>
              <th>Ip list</th>
              <th>Receipts</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              userStore.list.map((item: any, index) => {
                if (item.status) {
                  return (
                    <tr key={Date.now() * Math.random()}>
                      <td>{index + 1}</td>
                      <td >{item.userName}</td>
                      <td >{item.email}</td>
                      <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', (options as any)) : "updating..."}</td>
                      <td >{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', (options as any)) : "updating..."}</td>
                      <td >
                        <button
                          onClick={() => {
                            setShowAddress(!showAddress)
                            setupdateData(item)
                          }}
                          className="btn btn-primary">Show
                        </button>
                      </td>
                      <td >
                        <button
                          onClick={() => {
                            setShowIp(!showIp)
                            setupdateData(item)
                          }}
                          className="btn btn-primary">View
                        </button>
                      </td>
                      <td >
                        <button
                          onClick={() => {
                            setShowReceipt(!showReceipt)
                            setupdateData(item)
                          }}
                          className="btn btn-primary">View</button>
                      </td>

                      <td>
                        <button
                          onClick={() => {
                            setShowEdit(!showEdit)
                            setupdateData(item)
                          }}
                          className="btn btn-primary" style={{ marginRight: 5 }}>Edit</button>
                        <button
                          onClick={() => {
                            setShow(true)
                            setupdateData(item)
                          }}
                          className="btn btn-danger"
                        ><i className="fa-solid fa-lock"></i> Block</button>
                      </td>
                    </tr>
                  )
                }
              })
            }
          </tbody>

          {/* block */}
          <Modal show={show} onHide={handleCancel}>
            <Modal.Header closeButton>
              <Modal.Title><i style={{ color: '#ffce08', fill: "#000" }} className="fa-solid fa-triangle-exclamation"></i> Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you really want to block this person?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel} style={{ color: '#000', backgroundColor: '#ccc', outline: 'none', border: 'none', fontWeight: '600' }}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirm} style={{ backgroundColor: 'red', outline: 'none', border: 'none', fontWeight: '600' }}>Block</Button>
            </Modal.Footer>
          </Modal>

        </table >
      </div>
      {
        showAddress && <div className='table_container'>
          <div className='table_content'>
            <div className='btn_box'>
              <span>Address</span>
              <button onClick={() => {
                setShowAddress(!showAddress)
              }} type='button' className='btn btn-danger'>X</button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>Postal code</th>
                </tr>
              </thead>
              <tbody>
                {
                  updateData.address?.map((item: any, index: number) => {
                    return (
                      <tr key={Date.now() * Math.random()}>
                        <td>{index + 1}</td>
                        <td >{item.title}</td>
                        <td >{item.provineId}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table >
          </div>
        </div>
      }

      {
        showIp && <div className='table_container'>
          <div className='table_content'>
            <div className='btn_box'>
              <span>IP list</span>
              <button onClick={() => {
                setShowIp(!showIp)
              }} type='button' className='btn btn-danger'>X</button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>IP</th>
                  <th>Device Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  updateData.user_ip_list?.map((item: any, index: number) => {
                    console.log('dat', item);

                    return (
                      <tr key={Date.now() * Math.random()}>
                        <td>{index + 1}</td>
                        <td >{item.ip}</td>
                        <td >{item.deviceName}</td>
                        <td style={{ color: item.status ? "green" : "red" }}>{item.status ? "Active" : "Block"}</td>
                      </tr>
                    )

                  })
                }
              </tbody>
            </Table >
          </div>
        </div>
      }

      {
        showReceipt && <div className='table_container '>
          <div className='table_content table_receipt'>
            <div className='btn_box'>
              <h4>Receipts List</h4>
              <button onClick={() => {
                setShowReceipt(!showReceipt)
              }} type='button' className='btn btn-danger'>X</button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pay Status</th>
                  <th>Pay At</th>
                  <th>Pay Method</th>
                  <th>Status</th>
                  <th>Pending At</th>
                  <th>Accept At</th>
                  <th>Shipping At</th>
                  <th>Done At</th>
                  <th>Total Price</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {
                  updateData.receipts?.map((item: any, index: number) => {
                    if (item.status != "delete") {
                      return (
                        <tr key={Date.now() * Math.random()}>
                          <td>{item.id || "none"}</td>

                          <td>{item.paid ? "Paid" : "Unpaid"}</td>
                          <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.payMode || "none"}</td>
                          <td>{item.status || "none"}</td>
                          <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.doneAt ? (new Date(Number(item.doneAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{convertToVND(item.total) || "none"}</td>
                          <td>
                            <button style={{ marginRight: "10px" }}
                              onClick={() => {
                                setDisplay(true);
                                setCurrentRecreipt(item)
                              }}
                              className="btn btn-primary">View
                            </button>

                            {
                              item.status == "pending" &&
                              <button style={{ marginRight: "10px" }}
                                onClick={() => {
                                  setCurrentRecreipt(item)
                                  setShowAccept(!showAccept)
                                }}
                                className="btn btn-success">Accept
                              </button>
                            }

                            {
                              item.status == "pending" &&
                              <button style={{ marginRight: "10px" }}
                                onClick={() => {
                                  setCurrentRecreipt(item)
                                  setShowAccept(!showAccept)
                                }}
                                className="btn btn-success">Accept
                              </button>
                            }
                            {
                              item.status == "accepted" &&
                              <button style={{ marginRight: "10px" }}
                                onClick={() => {
                                  setCurrentRecreipt(item)
                                  setShowShipping(!showAccept)
                                }}
                                className="btn btn-success">Update
                              </button>
                            }

                            {
                              item.status == "shipping" &&
                              <button style={{ marginRight: "10px" }}
                                onClick={() => {
                                  setCurrentRecreipt(item)
                                  setShowDone(!showAccept)
                                }}
                                className="btn btn-success">Done
                              </button>
                            }

                            {
                              (item.status == 'pending' || item.status == 'done') &&
                              <button
                                onClick={() => {
                                  setCurrentRecreipt(item)
                                  setShowDelete(!showDelete)
                                }}
                                className="btn btn-danger">Delete
                              </button>
                            }
                          </td>
                        </tr>
                      )
                    }
                  })
                }
              </tbody>
            </Table >
            <h5 style={{ color: "#fff", backgroundColor: 'red', padding: '10px', textAlign: 'center' }}>Deleted Receipts</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Total Price</th>
                  <th>Pay Status</th>
                  <th>Pay At</th>
                  <th>Pay Method</th>
                  <th>Status</th>
                  <th>Pending At</th>
                  <th>Accept At</th>
                  <th>Shipping At</th>
                  <th>Delete At</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {
                  updateData.receipts?.map((item: any) => {
                    if (item.status == "delete") {
                      return (
                        <tr key={Date.now() * Math.random()}>
                          <td>{item.id || "none"}</td>
                          <td>{convertToVND(item.total) || "none"}</td>
                          <td>{item.paid ? "Paid" : "UnPaid"}</td>
                          <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.payMode || "none"}</td>
                          <td style={{ color: 'red', fontWeight: '600', textTransform: 'uppercase' }}>{item.status + 'd' || "none"}</td>
                          <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', (options as any)) : "none"}</td>
                          <td>
                            <button onClick={() => {
                              setDisplay(true);
                              setCurrentRecreipt(item)
                            }}
                              className="btn btn-primary" style={{ fontWeight: '600' }}><i className="fa-regular fa-eye"></i> View
                            </button>

                            <button
                              onClick={() => {
                                setCurrentRecreipt(item)
                                setShowRecycle(!showRecycle)
                              }}
                              className="btn btn-warning" style={{ fontWeight: '600', marginLeft: '10px' }}><i className="fa-solid fa-rotate-left"></i> Recycle
                            </button>
                          </td>
                        </tr>
                      )
                    }


                  })
                }
              </tbody>
            </Table >
          </div>

          {/* display */}
          <Modal
            show={display}
            onHide={() => setDisplay(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Invoice information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {
                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )

                }
                )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setDisplay(false)}>OK</Button>
            </Modal.Footer>
          </Modal>

          {/* Accept */}
          <Modal
            show={showAccept}
            onHide={() => setShowAccept(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Accept this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {
                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )
                }
                )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(Number(currentRecreipt.id), {
                    acceptAt: String(Date.now()),
                    status: "accepted"
                  })

                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notification',
                      content: 'This order has been accepted!',
                      onOk: () => setShowAccept(false)
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("errr!")
                }
                setShowDelete(false)
              }}>Yes</Button>
            </Modal.Footer>
          </Modal>
            
          <Modal
            show={showAccept}
            onHide={() => setShowAccept(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Accept this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {
                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )
                }
                )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(Number(currentRecreipt.id), {
                    acceptAt: String(Date.now()),
                    status: "accepted"
                  })

                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notification',
                      content: 'This order has been accepted!',
                      onOk: () => setShowAccept(false)
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("errr!")
                }
                setShowDelete(false)
              }}>Yes</Button>
            </Modal.Footer>
          </Modal>
          {/* Shipping */}
          <Modal
            show={showShipping}
            onHide={() => setShowShipping(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Shipping status for this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {
                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )
                }
                )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(currentRecreipt.id, {
                    shippingAt: String(Date.now()),
                    status: "shipping"
                  })

                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notificatiom',
                      content: 'This order is being shipped!',
                      onOk: () => setShowAccept(false)
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("err!")
                }
                setShowShipping(false)
              }}>OK</Button>
            </Modal.Footer>
          </Modal>

          {/* Done */}
          <Modal
            show={showDone}
            onHide={() => setShowDone(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Complete this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {
                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )
                }
                )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(currentRecreipt.id, {
                    paid: true,
                    paidAt: String(Date.now()),
                    status: "done",
                    doneAt: String(Date.now())
                  })

                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notification',
                      content: 'This order is being shipped!',
                      onOk: () => setShowDone(false)
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("err")
                }
                setShowDelete(false)
              }}>SAVE</Button>
            </Modal.Footer>
          </Modal>

          {/* delete */}
          <Modal
            show={showDelete}
            onHide={() => setShowDelete(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to cancel this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {

                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )
                }
                )
              }
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(currentRecreipt.id, { status: "delete" })
                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notification',
                      content: 'Cancel order successfully!'
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("Err!")
                }
                setShowDelete(false)
              }}>OK</Button>
            </Modal.Footer>
          </Modal>

          {/* recycle */}
          <Modal
            show={showRecycle}
            onHide={() => setShowRecycle(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to return this order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='item_container_title'>
                <p>Image</p>
                <p>Name product</p>
                <p>Price</p>
                <p>Quantity</p>
              </div>
              {
                currentRecreipt?.detail?.map((item: any) => {

                  return (
                    <div className='item_container'>
                      <img src={item?.product.avatar} />
                      <p>{item.product.name}</p>
                      <p>{convertToVND(item.product.price)}</p>
                      <p>{item.quantity}</p>
                    </div>
                  )

                }
                )
              }
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={async () => {
                try {
                  let result = await api.receiptApi.updateReceipt(currentRecreipt.id, { status: "done" })
                  if (result.status == 200) {
                    dispatch(receiptAction.update(result.data.data))
                    let newReceipt = updateData.receipts.map((item: any) => {
                      if (item.id == result.data.data.id) {
                        return result.data.data
                      } else {
                        return item
                      }
                    })
                    setupdateData({ ...updateData, receipts: newReceipt })
                    setGetUser(!getUser)
                    AntdModal.success({
                      title: 'Notification',
                      content: 'Order completed successfully!',
                      onOk: () => setShowRecycle(false)
                    })
                  }
                } catch (err) {
                  console.log('err', err);
                  window.alert("Err!")
                }
                setShowDelete(false)
              }}>OK</Button>
            </Modal.Footer>
          </Modal>

        </div>
      }
    </div>
  )
}