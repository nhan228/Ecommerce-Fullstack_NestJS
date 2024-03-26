import { useState } from 'react'
import { Modal } from 'antd'
import api from '@services/apis'
import { useSelector, useDispatch } from 'react-redux';
import DetailShow from '../detail';
import ProductEdit from '../update-form';
import { productAction } from '@slices/product.slice';
import { Store } from '@/store'
import { useNavigate } from 'react-router-dom';

export default function Recycle() {
    const dispatch = useDispatch()
    const productStore = useSelector((store: Store) => store.productStore);
    const [updateData, setupdateData] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const navigate = useNavigate()

    function convertToVND(num: number) {
        var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        return vnd;
    }

    return (
        <div className='recycle-box'>
            <div className='recyle-title'>
                {/* title */}
                <h2>Product Bin</h2>

                {/* back button */}
                <button onClick={() => {
                    navigate('/product/list')
                }} className='recycle-back'><i className="fa-solid fa-rotate-left"></i> Back to Product List</button>
            </div>

            {
                showDetail && <DetailShow showDetail={showDetail} setShowDetail={setShowDetail} updateData={updateData} setupdateData={setupdateData} />
            }
            {
                showEdit && <ProductEdit showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} setupdateData={setupdateData} />
            }

            {/* RECYCLE TABLE */}
            <div className='recycle-table'>
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
                            <th>Detail</th>
                            <th>Tools</th>
                        </tr>
                    </thead>

                    {/* body */}
                    <tbody>
                        {
                            productStore.data?.map((product, index) => {
                                if (!product.status) {
                                    return (
                                        <tr key={Date.now() * Math.random()}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={product.avatar} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                            </td>
                                            <td >{product.name}</td>
                                            <td >{product.category.title}</td>
                                            <td >{product.brand.title}</td>
                                            <td>{convertToVND(Number(product.price))}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setShowDetail(!showDetail);
                                                        setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                                                    }}
                                                    className='btn btn-primary'>View</button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setShowEdit(!showEdit);
                                                        setupdateData({ product })
                                                    }}
                                                    className='btn btn-primary' style={{ marginRight: 5 }}>View</button>
                                                <button
                                                    onClick={() => {
                                                        Modal.warning({
                                                            title: "Warning",
                                                            content: `Are you sure you want to reUse this product?`,
                                                            onOk: async () => {
                                                                try {
                                                                    let result = await api.productApi.updateDes(product.id, { status: true })
                                                                    if (result.status == 200) {
                                                                        dispatch(productAction.update(result.data.data))
                                                                    }
                                                                } catch (err) {
                                                                    console.log('err', err);
                                                                }
                                                            },
                                                        })
                                                    }}
                                                    className="btn btn-success">
                                                    ReUse
                                                </button>
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