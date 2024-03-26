import Carousel from 'better-react-carousel'
import { useNavigate } from "react-router-dom"

import "./product.scss"

export default function Product({ productStore }: any) {
    const navigate = useNavigate()
    function convertToVND(num: number) {
        var vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        return vnd;
    }
    return (
        <>
            {/* LAPTOP */}
            <div className='container'>
                <div className='product'>
                    <div className='product_info'>
                        <div className="top">
                            <h2>LAPTOP</h2>
                            <h5 onClick={() => {
                                navigate('/category/Laptop/all')
                            }}>See more</h5>
                        </div>
                        <div className="bottom">
                            <Carousel cols={5} rows={1} gap={20} loop>
                                {productStore.data?.map((i: any) => {
                                    if (i.categoryId == 1 && i?.status) {
                                        return (<Carousel.Item>
                                            <div className="container_item" onClick={() => {
                                                navigate(`/product-info/${i.id}`)
                                            }}>
                                                <div className="img_container">
                                                    <img width="100%" src={i.avatar} />
                                                </div>
                                                <div className="content_container">
                                                    <p>Laptop</p>
                                                    <h6>{i.name}</h6>
                                                    <h5>{convertToVND(i.price)}</h5>
                                                </div>
                                            </div>
                                        </Carousel.Item>)
                                    }
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* PC */}
            <div className='container'>
                <div className='product'>
                    <div className='product_info'>
                        <div className="top">
                            <h2>PC</h2>
                            <h5 onClick={() => {
                                navigate('/category/PC/all')
                            }}>See more </h5>
                        </div>
                        <div className="bottom">
                            <Carousel cols={5} rows={1} gap={20} loop>
                                {productStore.data?.map((i: any) => {
                                    if (i.categoryId == 2 && i?.status) {
                                        return (<Carousel.Item>
                                            <div className="container_item" onClick={() => {
                                                navigate(`/product-info/${i.id}`)
                                            }}>
                                                <div className="img_container">
                                                    <img width="100%" src={i.avatar} />
                                                </div>
                                                <div className="content_container">
                                                    <p>PC</p>
                                                    <h6>{i.name}</h6>
                                                    <h5>{convertToVND(i.price)}</h5>
                                                </div>
                                            </div>
                                        </Carousel.Item>)
                                    }
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHONE */}
            <div className='container'>
                <div className='product'>
                    <div className='product_info'>
                        <div className="top">
                            <h2>PHONE</h2>
                            <h5 onClick={() => {
                                navigate('/category/Phone/all')
                            }}>See more </h5>
                        </div>
                        <div className="bottom">
                            <Carousel cols={5} rows={1} gap={20} loop>
                                {productStore.data?.map((i: any) => {
                                    if (i.categoryId == 3 && i?.status) {
                                        return (<Carousel.Item>
                                            <div className="container_item" onClick={() => {
                                                navigate(`/product-info/${i.id}`)
                                            }}>
                                                <div className="img_container">
                                                    <img width="100%" src={i.avatar} />
                                                </div>
                                                <div className="content_container">
                                                    <p>Phone</p>
                                                    <h6>{i.name}</h6>
                                                    <h5>{convertToVND(i.price)}</h5>
                                                </div>
                                            </div>
                                        </Carousel.Item>)
                                    }
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* SPEAKER */}
            <div className='container'>
                <div className='product'>
                    <div className='product_info'>
                        <div className="top">
                            <h2>SPEAKER</h2>
                            <h5 onClick={() => {
                                navigate('/category/Audio%20equipments/all')
                            }}>See more </h5>
                        </div>
                        <div className="bottom">
                            <Carousel cols={5} rows={1} gap={20} loop>
                                {productStore.data?.map((i: any) => {
                                    if (i.categoryId == 4 && i?.status) {
                                        return (<Carousel.Item>
                                            <div className="container_item" onClick={() => {
                                                navigate(`/product-info/${i.id}`)
                                            }}>
                                                <div className="img_container">
                                                    <img width="100%" src={i.avatar} />
                                                </div>
                                                <div className="content_container">
                                                    <p>Speaker</p>
                                                    <h6>{i.name}</h6>
                                                    <h5>{convertToVND(i.price)}</h5>
                                                </div>
                                            </div>
                                        </Carousel.Item>)
                                    }
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* ASSO */}
            <div className='container'>
                <div className='product'>
                    <div className='product_info'>
                        <div className="top">
                            <h2>ACCESSORY</h2>
                            <h5 onClick={() => {
                                navigate('/category/Accessory/all')
                            }}>See more </h5>
                        </div>
                        <div className="bottom">
                            <Carousel cols={5} rows={1} gap={20} loop>
                                {productStore.data?.map((i: any) => {
                                    if (i.categoryId == 5 && i?.status) {
                                        return (<Carousel.Item>
                                            <div className="container_item" onClick={() => {
                                                navigate(`/product-info/${i.id}`)
                                            }} style={{ cursor: 'pointer' }}>
                                                <div className="img_container">
                                                    <img width="100%" src={i.avatar} />
                                                </div>
                                                <div className="content_container">
                                                    <p>Accessory</p>
                                                    <h6>{i.name}</h6>
                                                    <h5>{convertToVND(i.price)}</h5>
                                                </div>
                                            </div>
                                        </Carousel.Item>)
                                    }
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
