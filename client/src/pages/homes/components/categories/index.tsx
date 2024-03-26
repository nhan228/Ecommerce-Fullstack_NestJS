import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Col, Row, Card } from 'antd'
const { Meta } = Card
import { useSelector } from 'react-redux'
import { Store } from "@/store"

import './category.scss'

export default function Category() {
    const { categoryName, brandName } = useParams()
    const navigate = useNavigate()
    const productStore = useSelector((store: Store) => store.productStore)
    const [count, setCount] = useState(0)

    function convertToVND(num: number) {
        var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        return vnd;
    }

    useEffect(() => {
        let totalCount = 0
        productStore.data?.forEach(product => {
            if (product?.category?.title == categoryName && product?.status && (product?.brand?.title == brandName || brandName == 'all')) {
                totalCount++
            }
        })
        setCount(totalCount)
    }, [categoryName, productStore.data, brandName])

    return (
        <div className='category_page'>
            <div className='title'>
                <div>
                    <p>{categoryName}</p>
                    <span>(All: {count})</span>
                </div>
            </div>
            <div className='product_list'>
                <Row gutter={16}>
                    {
                        productStore.data?.map(product => {
                            if (product?.category?.title == categoryName && product?.status && (product?.brand?.title == brandName || brandName == 'all')) {
                                return (
                                    <Col key={Date.now() * Math.random()} className="gutter-row" xs={24} sm={12} md={8} lg={6}>
                                        <Card
                                            className='productCart'
                                            hoverable
                                            style={{
                                                width: "250px",
                                                minHeight: "200px",
                                                marginBottom: "10px"
                                            }}
                                            cover={<img alt="example" src={product.avatar} />}
                                        >
                                            <p>{categoryName}</p>
                                            <Meta title={product.name} description={convertToVND(product.price)} />
                                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                                <button onClick={() => {
                                                    navigate(`/product-info/${product.id}`)
                                                }} className='my-button'>Buy</button>
                                            </div>
                                        </Card>
                                    </Col>)
                            }
                        })
                    }
                </Row>
            </div>
        </div>
    )
}
