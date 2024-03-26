import { useState, useEffect } from 'react'
import { Table, Modal, Button } from 'react-bootstrap'
import api from '@services/apis'
import { useSelector, useDispatch } from 'react-redux'
import UserCreateForm from '../create-form'
import { userAction } from '@slices/user.slice'
import { receiptAction } from '@/store/slices/receipt.slice'
import UserEditForm from '../edit-form'
import { Store } from '@/store'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Recycle() {
    const dispatch = useDispatch()
    const memberStore = useSelector((store: Store) => store.memberStore)
    const userStore = useSelector((store: Store) => store.userStore)
    const navigate = useNavigate()
    const [showAddress, setShowAddress] = useState(false);
    const [updateData, setupdateData] = useState({
        id:Number,
        receipts: [],
        detail: [],
    })
    const [showIp, setShowIp] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [display, setDisplay] = useState(false)
    const [currentRecreipt, setCurrentRecreipt] = useState<any>(null)
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [getUser, setGetUser] = useState(false);
    const options: any = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    };
    function convertToVND(num: number) {
        var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        return vnd;
    }
    const handleConfirm = async () => {
        try {
            let result = await api.userApi.update(Number(updateData.id), { status: true });
            console.log('result', result);
            if (result.status == 200) {
                dispatch(userAction.update(result.data.data));
                setGetUser(!getUser)
                message.success("Unblock this user successfully!")
            }
        } catch (err: any) {
            console.log('err', err);
            window.alert(`${err.response.data.message}`)
        }
        setShow(false);
    };

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
    return (
        <div className='user-recycle'>
            {
                userStore.addModal && <UserCreateForm dispatch={dispatch} />
            }
            {
                showEdit && <UserEditForm showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} />
            }
            <div className='user-recycle-title'>
                <h2>Ban List</h2>
                {
                    memberStore.data?.permission.includes('d:user' && 'u:user') && (
                        <button className='back-user-list' onClick={() =>
                            navigate('/user/list')
                        }><i className="fa-solid fa-rotate-left" /> Return User List</button>
                    )
                }
            </div>

            <div className='user-recycle-table'>
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
                            userStore.list.map((item: any, index: number) => {
                                if (!item.status) {
                                    return (
                                        <tr key={Date.now() * Math.random()}>
                                            <td>{index + 1}</td>
                                            <td >{item.userName}</td>
                                            <td >{item.email}</td>
                                            <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', options) : "null"}</td>
                                            <td >{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', options) : "null"}</td>
                                            <td ><button
                                                onClick={() => {
                                                    setShowAddress(!showAddress)
                                                    setupdateData(item)
                                                }}
                                                className="btn btn-primary">Show</button></td>
                                            <td ><button
                                                onClick={() => {
                                                    setShowIp(!showIp)
                                                    setupdateData(item)
                                                }}
                                                className="btn btn-primary">Show & Edit</button></td>
                                            <td ><button
                                                onClick={() => {
                                                    setShowReceipt(!showReceipt)
                                                    setupdateData(item)
                                                }}
                                                className="btn btn-primary">Show & Edit</button></td>

                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setShowEdit(!showEdit)
                                                        setupdateData(item)
                                                    }}
                                                    className="btn btn-primary" style={{ marginRight: 5 }}>Edit</button>
                                                {
                                                    <button
                                                        onClick={() => {
                                                            setShow(true)
                                                            setupdateData(item)
                                                        }}
                                                        className="btn btn-success"
                                                    ><i className="fa-solid fa-unlock"></i> Unblock</button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                    <Modal show={show} onHide={handleCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title><i className ="fa-solid fa-triangle-exclamation" style={{color:'rgb(255, 206, 8)'}}/>Warning</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to Unblock this user?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" style={{fontWeight:'600'}} onClick={handleCancel}>Cancel</Button>
                            <Button variant="danger" style={{fontWeight:'600'}} onClick={handleConfirm}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
                </table>
            </div>
            {
                showAddress && <div className='table_container'>
                    <div className='table_content'>
                        <div className='btn_box'>
                            <span>Address Infomation</span>
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
                            <span>IP list Infomation</span>
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
                                    updateData.user_ip_list?.map((item, index) => {
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
                            <h4>Receipts Infomation</h4>
                            <button onClick={() => {
                                setShowReceipt(!showReceipt)
                            }} type='button' className='btn btn-danger'>X</button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Detail Info</th>
                                    <th>Total Price</th>
                                    <th>Pay Status</th>
                                    <th>Pay At</th>
                                    <th>Pay Method</th>
                                    <th>Status</th>
                                    <th>Pending At</th>
                                    <th>Accept At</th>
                                    <th>Shipping At</th>
                                    <th>Done At</th>
                                    <th>Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.receipts?.map((item: any, index: number) => {
                                        if (item.status != "delete") {
                                            return (
                                                <tr key={Date.now() * Math.random()}>
                                                    <td>{item.id || "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setDisplay(true);
                                                            setCurrentRecreipt(item)
                                                        }}
                                                        className="btn btn-primary">Show!</button></td>
                                                    <td>{convertToVND(item.total) || "null"}</td>
                                                    <td>{item.paid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                    <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.payMode || "null"}</td>
                                                    <td>{item.status || "null"}</td>
                                                    <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.doneAt ? (new Date(Number(item.doneAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setCurrentRecreipt(item)
                                                            setShowDelete(!showDelete)
                                                        }}
                                                        className="btn btn-danger">Delete</button></td>
                                                </tr>
                                            )
                                        }


                                    })
                                }
                            </tbody>
                        </Table >
                        <h5 style={{ color: "red" }}>Deleted Receipts Infomation</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Detail Info</th>
                                    <th>Total Price</th>
                                    <th>Pay Status</th>
                                    <th>Pay At</th>
                                    <th>Pay Method</th>
                                    <th>Status</th>
                                    <th>Pending At</th>
                                    <th>Accept At</th>
                                    <th>Shipping At</th>
                                    <th>Delete At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.receipts?.map((item: any, index: number) => {
                                        if (item.status == "delete") {
                                            return (
                                                <tr key={Date.now() * Math.random()}>
                                                    <td>{item.id || "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setDisplay(true);
                                                            setCurrentRecreipt(item)
                                                        }}
                                                        className="btn btn-primary">Show!</button></td>
                                                    <td>{convertToVND(item.total) || "null"}</td>
                                                    <td>{item.paid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                    <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.payMode || "null"}</td>
                                                    <td style={{ color: "red" }}>{item.status || "null"}</td>
                                                    <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                </tr>
                                            )
                                        }


                                    })
                                }
                            </tbody>
                        </Table >
                    </div>
                    <Modal
                        show={display}
                        onHide={() => setDisplay(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Your billing information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='item_container_title'>
                                <p>Image</p>
                                <p>Product name</p>
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
                                <p>Product Name</p>
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
                                    let result = await api.receipt.updateReceipt(currentRecreipt.id, { status: "delete" })
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
                                        message.success("Delete receipt successfully!")
                                    }
                                } catch (err) {
                                    console.log('err', err);
                                    message.warning("System error, please try again in few second!")
                                }
                                setShowDelete(false)
                            }}>Return</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            }
        </div>
    )
}