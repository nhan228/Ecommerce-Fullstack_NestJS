import { useRef, useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '@/store/slices/product.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { Store } from '@/store';
import Load from '@/components/load-form'

export default function ProductCreateForm({ dispatch }: any) {
    const [load, setLoad] = useState<boolean>(false)
    const [picturesPreview, setPicturesPreview] = useState<any>([]);
    const categoryStore = useSelector((store: Store) => store.categoryStore)
    const brandStore = useSelector((store: Store) => store.brandStore)
    const fileInputRef = useRef(null)

    async function handleAddProduct(e: any) {
        e.preventDefault();
        try {
            let newProduct = {
                name: (e.target as any).name.value,
                price: (e.target as any).price.value,
                avatar: await uploadToFirebase((e.target as any).avatar.files[0], ''),
                categoryId: Number((e.target as any).categoryId.value),
                des: (e.target as any).des.value,
                brandId: Number((e.target as any).brandId.value),
            }
            setLoad(true)

            // validate
            if (!newProduct.name || !newProduct.price || !newProduct.categoryId || !newProduct.brandId) {
                message.warning("Please fill all fields")
                setLoad(false)
                return
            }
            if (isNaN(parseFloat(newProduct.price)) || !isFinite(newProduct.price)) {
                message.warning("Please enter a valid number for the price")
                setLoad(false)
                return
            }
            if (newProduct.price < 0) {
                message.warning("Price must be greater than 0")
                setLoad(false)
                return
            }
            if (!newProduct.avatar) {
                message.warning("Please upload avatar")
                setLoad(false)
                return
            }

            let pictures = []
            for (let i in picturesPreview) {
                let url = await uploadToFirebase(picturesPreview[i].file, '')
                pictures.push({
                    url
                })
            }

            let result = await api.productApi.create({
                newProduct,
                pictures
            })

            Modal.success({
                title: "Notification",
                content: "Create product successfully!",
                onOk: () => {
                    setLoad(false)
                    dispatch(productAction.addData(result.data.data));
                    (e.target as any).name.value = "";
                    (e.target as any).price.value = "";
                    setPicturesPreview([]);
                    (e.target as any).avatar.value = null;
                    dispatch(productAction.loadModal());
                }
            });

        } catch (err: any) {
            Modal.warning({
                title: 'Warning',
                content: `${err.response?.data?.err}`,
                onOk: () => {
                    setLoad(false)
                    dispatch(productAction.loadModal())
                }
            })
        }
    }

    return (
        <div className='product_create_form'>
            {load && <Load />}
            <form onSubmit={(e) => {
                handleAddProduct(e)
            }}>
                {/* Title */}
                <div className='btn_box'>
                    <h2>Create Product</h2>
                    <button onClick={() => {
                        dispatch(productAction.loadModal())
                    }} type='button' className='btn btn-danger'>X</button>
                </div>

                {/* Name */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Name</InputGroup.Text>
                    <Form.Control
                        placeholder="Product Name"
                        name='name'
                        autoFocus
                    />
                </InputGroup>

                {/* Price */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Price</InputGroup.Text>
                    <Form.Control
                        placeholder="Product Price"
                        name='price'
                    />
                </InputGroup>

                {/* Avatar */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Avatar</InputGroup.Text>
                    <div className='input_avatar'>
                        <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" />
                        <input onChange={(e) => {
                            if ((e.target as any).files.length > 0) {
                                let spanEl = (e.target as any).parentNode.querySelector('span');
                                let imgEl = (e.target as any).parentNode.querySelector('img');
                                spanEl.style.opacity = 0;
                                imgEl.src = URL.createObjectURL((e.target as any).files[0])
                            }
                        }} name='avatar' type="file" />
                        <span>+</span>
                    </div>
                </InputGroup>

                {/* Description */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Describe"
                        name='des'
                    />
                </InputGroup>

                {/* Pictures */}
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Picture List</Form.Label>
                    <Form.Control onChange={(e: any) => {
                        let tempArr = [];
                        if ((e.target as any).files.length > 0) {
                            for (let i in (e.target as any).files) {
                                if (i == "length") {
                                    break
                                }
                                tempArr.push({
                                    url: URL.createObjectURL((e.target as any).files[i]),
                                    file: (e.target as any).files[i]
                                })
                            }
                        }
                        if (Number(picturesPreview.length) + Number(tempArr.length) > 4) {
                            Modal.warning({
                                title: 'Warning',
                                content: "You can choose maximum 4 image!",
                                onOk: () => { }
                            })
                            return
                        }
                        setPicturesPreview([...tempArr, ...picturesPreview])
                    }} type="file" multiple max={4} ref={fileInputRef} />
                </Form.Group>
                {/* demo pictures */}
                <div className='pictures'>
                    {
                        picturesPreview.map((item: any, index: number) => (
                            <div key={Date.now() * Math.random()} className='item'>
                                <img src={item.url} />
                                <button type='button' onClick={() => {
                                    setPicturesPreview(picturesPreview.filter((itemFilter: any, indexFilter: number) => indexFilter != index))
                                }} className='btn btn-danger'>X</button>
                            </div>
                        ))
                    }
                </div>

                {/* Category */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Category</InputGroup.Text>
                    <Form.Select name='categoryId' aria-label="Default select example">
                        <option value={null as any}>Please choose</option>
                        {
                            categoryStore.category?.map((item: any) => (
                                <option key={Date.now() * Math.random()} value={Number(item.id)}>{item.title}</option>
                            ))
                        }
                    </Form.Select>
                </InputGroup>

                {/* Brand */}
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Brand</InputGroup.Text>
                    <Form.Select name='brandId' aria-label="Default select example">
                        <option value={null as any}>Please choose</option>
                        {
                            brandStore.data?.map(item => (
                                <option key={Date.now() * Math.random()} value={item.id}>{item.title}</option>
                            ))
                        }
                    </Form.Select>
                </InputGroup>

                {/* Button */}
                <button type='submit' className='btn btn-success'>Create</button>
            </form>
        </div>
    )
}