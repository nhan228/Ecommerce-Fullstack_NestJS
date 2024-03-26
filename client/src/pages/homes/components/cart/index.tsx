import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Modal, QRCode } from 'antd'
import { Table, Modal as ModalBootstrap, Button } from 'react-bootstrap';
import api from '@services/apis'
import { Store } from "@/store"
import { receiptAction } from '@/store/slices/receipt.slice'

import './cart.scss'

export default function Cart() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const receiptStore: any = useSelector((store: Store) => store.receiptStore)

    function convertToVND(num: number) {
        var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        return vnd;
    }

    // receipt
    useEffect(() => {
        console.log("receiptStore.receipts", receiptStore.receipts)
    }, [receiptStore.receipts])

    const userStore = useSelector((store: Store) => store.userStore)
    async function handleDelete(itemId: number) {
        try {
            Modal.confirm({
                title: "Confirm!",
                content: "Do you really want to delete the product?",
                onOk: async () => {
                    await api.receiptApi.delete(Number(itemId))
                    dispatch(receiptAction.deleteItem(itemId))
                }
            })
        } catch (err) {
            console.log('err', err);
        }
    }

    let changeTimeout: any = null
    async function handleChangeQuantity(itemId: number, e: any) {
        clearTimeout(changeTimeout)
        changeTimeout = setTimeout(async () => {
            try {
                let quantity = +e.target.value
                await api.receiptApi.update({
                    itemId,
                    quantity
                })
                dispatch(receiptAction.updateItem({
                    itemId,
                    quantity
                }))
            } catch (err) { }
        }, 1000)
    }

    async function cash(payMode = "cash", zaloData: any = null) {
        try {
            let data = {
                total: receiptStore.cart?.detail?.reduce((total: number, cur: any) => {
                    return total += cur.quantity * cur.product.price
                }, 0) || 0,
                payMode
            }
            if (zaloData) {
                data = {
                    ...data,
                    ...zaloData
                }
            }
            console.log('id', receiptStore?.cart.id);
            console.log('d', data)
            let result = await api.receiptApi.pay(receiptStore?.cart.id, data)

            return result.data.data
        } catch (err) {
            console.log('err', err);
            return false
        }
    }

    const [qrData, setQrData] = useState(null)

    // zalo pay
    async function zalo() {
        try {
            let result = await api.receiptApi.zaloReceipt({
                receiptId: receiptStore.cart?.id,
                userName: userStore.data?.email,
                total: receiptStore.cart?.detail?.reduce((total: number, cur: any) => {
                    return total += cur.quantity * cur.product.price
                }, 0) || 0
            })
            setQrData(result.data)
            let zaloPayTimeout: any = null
            let zaloPayInterVal = setInterval(async () => {
                let resultCheck = await api.receiptApi.zaloCheck(result.data.orderId)
                console.log(resultCheck)
                if (resultCheck.data.status) {
                    clearInterval(zaloPayInterVal)
                    clearTimeout(zaloPayTimeout)
                    setQrData(null)
                    let receiptNew = await cash("zalo_pay", {
                        paid: true,
                        paidAt: String(Date.now())
                    })

                    dispatch(receiptAction.setCart(null))
                    dispatch(receiptAction.addReceipt(receiptNew))
                    window.location.href = '/receipts'
                }
            }, 500)

            zaloPayTimeout = setTimeout(() => {
                setQrData(null)
                clearInterval(zaloPayInterVal)
            }, 2 * 60 * 1000)
        } catch (err) {
            return false
        }
    }
    // pay
    async function handlePay(e: any) {
        e.preventDefault()

        // paid
        Modal.confirm({
            title: 'Confirm',
            content: 'Order Confirmation?',
            okText: 'Pay',
            cancelText: 'Cancel',
            onOk: async () => {
                let payMode = e.target.payMode.value

                let result = null

                if (payMode == "cash") {
                    result = await cash()
                }

                if (payMode == "zalo_pay") {
                    result = await zalo()
                    return
                }
                dispatch(receiptAction.setCart(null))
                dispatch(receiptAction.addReceipt(result))
                console.log('receiptStore', receiptStore)
                console.log('result', result)
                window.location.href = '/receipts'
            },
            onCancel: () => { return }
        })

    }
    return (
        <>
            <div className='cart_page'>
                <h3>CART</h3>
                <div className='cart_page_container'>

                    <div className='table_container'>
                        <Table striped bordered hover className="table align-middle">
                            <thead>
                                <tr>
                                    <th colSpan={3}>Product Information</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    receiptStore.cart?.detail?.map((item: any, index: number) => (
                                        <tr key={Date.now() * Math.random()}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={item.product.avatar} style={{ width: 50, height: 50, borderRadius: "50%" }} />
                                            </td>
                                            <td>{item.product.name}</td>
                                            <td>{convertToVND(item.product.price)}</td>
                                            <td>
                                                <input onChange={(e) => {
                                                    handleChangeQuantity(item.id, e)
                                                }} style={{ width: 60, textAlign: "center" }} type="number" min={1} defaultValue={item.quantity} />
                                            </td>
                                            <td>{convertToVND(item.product.price * item.quantity)}</td>
                                            <td>
                                                <button onClick={() => {
                                                    handleDelete(item.id)
                                                }} className='btn btn-danger'>Delete!</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    receiptStore?.cart?.detail?.length > 0 ? (
                                        <tr>
                                            <td>{receiptStore.cart?.detail.length + 1}</td>
                                            <td style={{ fontWeight: "bold" }}>Total Bill</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{convertToVND(receiptStore.cart?.detail?.reduce((total: number, cur: any) => {
                                                return total += cur.quantity * cur.product.price
                                            }, 0) || 0)}</td>
                                            <td></td>
                                        </tr>
                                    ) : (
                                        <div className='none'>
                                            <img src="https://shopfront-cdn.tekoapis.com/static/empty_cart.png" alt="" />
                                            <span>Cart is emty</span>
                                            <button className='shop-now' onClick={() => window.location.href = '/'}>
                                                <span className="box">
                                                    Buy now
                                                    <div className="star-1">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="star-2">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="star-3">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="star-4">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="star-5">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="star-6">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <title>buy now</title>
                                                            <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z" />
                                                        </svg>
                                                    </div>
                                                </span>
                                            </button>

                                        </div>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className='checkout_container'>
                        <div className='voucher'>
                            <span style={{ fontWeight: '600', marginRight: '10px' }}>Voucher:</span>
                            <span style={{ color: '#007185', cursor: 'pointer' }}>
                                <svg fill="#007185" viewBox="0 0 24 24" className="css-9w5ue6" height="15px" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.19499 3C5.99608 3 5.80532 3.07902 5.66466 3.21967L3.21967 5.66466C3.07902 5.80532 3 5.99608 3 6.19499V11.085C3 11.2839 3.07902 11.4747 3.21967 11.6153L12.3884 20.784C12.6813 21.0769 13.1562 21.0769 13.4491 20.784L17.1166 17.1166L20.784 13.4491C21.0769 13.1562 21.0769 12.6813 20.784 12.3884L11.6153 3.21967C11.4747 3.07902 11.2839 3 11.085 3H6.19499ZM4.5 6.50565L6.50565 4.5H10.7743L19.1931 12.9187L16.0559 16.0559L12.9187 19.1931L4.5 10.7743V6.50565ZM7.86186 9.2514C7.86186 8.65286 8.34707 8.16765 8.94561 8.16765C9.54415 8.16765 10.0294 8.65286 10.0294 9.2514C10.0294 9.84994 9.54415 10.3351 8.94561 10.3351C8.34707 10.3351 7.86186 9.84994 7.86186 9.2514ZM8.94561 6.66765C7.51865 6.66765 6.36186 7.82444 6.36186 9.2514C6.36186 10.6784 7.51865 11.8351 8.94561 11.8351C10.3726 11.8351 11.5294 10.6784 11.5294 9.2514C11.5294 7.82444 10.3726 6.66765 8.94561 6.66765ZM11.3097 12.9996C11.0168 12.7067 10.5419 12.7067 10.249 12.9996C9.95613 13.2925 9.95613 13.7674 10.249 14.0603L12.3884 16.1996C12.6813 16.4925 13.1562 16.4925 13.449 16.1996C13.7419 15.9067 13.7419 15.4319 13.449 15.139L11.3097 12.9996ZM12.694 10.5545C12.9869 10.2616 13.4618 10.2616 13.7547 10.5545L15.8941 12.6939C16.187 12.9868 16.187 13.4616 15.8941 13.7545C15.6012 14.0474 15.1263 14.0474 14.8334 13.7545L12.694 11.6151C12.4011 11.3223 12.4011 10.8474 12.694 10.5545Z" fill="#1435c3"></path></svg>
                                Select or enter voucher
                            </span>
                        </div>
                        <div className='checkout'>
                            <h6 style={{ fontWeight: '600', color: '#111', marginBottom: '30px' }}> Checkout</h6>
                            <div className='current_total'>
                                <div>Total orders bill:</div>
                                <p> {convertToVND(receiptStore.cart?.detail?.reduce((total: number, cur: any) => {
                                    return total += cur.quantity * cur.product.price
                                }, 0) || 0)}</p>
                            </div>
                            <div className='current_total'>
                                <p>Total Amount:</p>
                                <span>{convertToVND(receiptStore.cart?.detail?.reduce((total: number, cur: any) => {
                                    return total += cur.quantity * cur.product.price
                                }, 0) || 0)}</span>
                            </div>
                            <form onSubmit={(e) => {
                                handlePay(e)
                            }}
                                style={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    alignItems: "flex-end"
                                }}
                            >
                                <div className='pay_method'>
                                    <p>Payment method:</p>
                                    <select style={{ width: "100px", marginBottom: "10px", color: '#000', border: '1.5px solid #000' }} name='payMode'>
                                        <option value="cash" defaultChecked>CASH</option>
                                        <option value="zalo_pay">ZALO PAY</option>
                                    </select>
                                </div>
                                <button style={{ width: "130px", cursor: 'pointer', marginTop: '30px' }} className='my-button' type='submit'>
                                    Place Order
                                </button>

                            </form>
                        </div>
                    </div>
                    {
                        qrData && (
                            Modal.success({
                                title: "The QR Code has been generated. Please use the Zalo Pay app to scan and proceed with the payment:",
                                onOk: () => { window.location.href = "/cart" },
                                content:
                                    <QRCode
                                        value={qrData.qrCodeUrl}
                                        icon="https://play-lh.googleusercontent.com/NfFBz1Rxk0nQ7RsOk0kXbi1AEp1ZJ3rzJHbwRlmheZEDPPHh7dscqyxyX-ehxTl7tw"
                                    />
                            })
                        )
                    }

                </div>

                {/* create */}
                {/* <ModalBootstrap
                    show={open}
                    onHide={() => setOpen(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalBootstrap.Header closeButton>
                        <ModalBootstrap.Title>Please enter address ...: </ModalBootstrap.Title>
                    </ModalBootstrap.Header>
                    <ModalBootstrap.Body>
                        <div className='item_container_title'>
                            <Input type="text"
                                placeholder='Please enter address...'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </ModalBootstrap.Body>

                    <ModalBootstrap.Footer>
                        <Button variant="primary" onClick={async (e) => {
                            try {
                                let newAddress = {
                                    title: address,
                                    userId: Number(userStore?.data?.id)
                                };
                                console.log(newAddress);
                                // let result = await api.address.create({
                                //     ...newAddress
                                // });
                                console.log('result', result);
                                dispatch(addressAction.addData(result.data.data));
                                Modal.success({
                                    title: "Thông báo",
                                    content: "Bạn đã thêm địa chỉ thành công!",
                                    onOk: () => {
                                        setAddress('')
                                        setOpen(false);
                                        dispatch(addressAction.loadModal());
                                    }
                                });
                            } catch (err) {
                                console.log("err", err);
                                alert("1");
                            }
                        }}>OK</Button>
                    </ModalBootstrap.Footer>
                </ModalBootstrap> */}

                {/* update */}
                {/* <ModalBootstrap
                    show={openUpdate}
                    onHide={() => setOpenUpdate(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalBootstrap.Header closeButton>
                        <ModalBootstrap.Title>Hãy chọn địa chỉ nhận hàng: </ModalBootstrap.Title>
                    </ModalBootstrap.Header>
                    <ModalBootstrap.Body>
                        <select onChange={(e: any) => setAddressTitle(e.target.value)}>
                            {
                                addressStore.data.map((item, index) => (
                                    <option key={index} value={item.title}>{item.title}</option>
                                ))
                            }
                        </select>
                    </ModalBootstrap.Body>
                    <ModalBootstrap.Footer>
                        <Button variant="primary" onClick={
                            async () => {
                                try {
                                    let result = await api.address.update((userStore?.data?.id), {
                                        title: addressTitle,
                                        userId: userStore.data.id
                                    });
                                    console.log('result', result);
                                    Modal.success({
                                        title: "Thông báo",
                                        content: "Bạn đã sử dụng địa chỉ này thành công!",
                                        onOk: () => {
                                            dispatch(addressAction.addData(result.data.data));
                                            setOpen(false);
                                            dispatch(addressAction.loadModal());
                                        }
                                    });
                                } catch (err) {
                                    console.log("err", err);
                                    alert("1");
                                }
                            }}>OK</Button>
                    </ModalBootstrap.Footer>
                </ModalBootstrap> */}
            </div>
        </>
    )
}
