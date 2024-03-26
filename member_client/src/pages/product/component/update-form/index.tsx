import { useState, useRef, useEffect } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '@/store/slices/product.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/store';
import Load from '@/components/load-form'

export default function ProductEdit({ showEdit, setShowEdit, updateData }: any) {
  const productStore = useSelector((store: Store) => store.productStore)
  const [load, setLoad] = useState<boolean>(false)
  const dispatch = useDispatch();
  const [picturesPreview, setPicturesPreview] = useState<any>([]);
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const brandStore = useSelector((store: Store) => store.brandStore)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setPicturesPreview(updateData.product.pictures)
  }, [])

  async function handleEditProduct(e: any) {
    e.preventDefault();
    let avatar = null;
    if (!(e.target as any).avatar.files[0]) {
      avatar = updateData.product.avatar;
    } else {
      avatar = await uploadToFirebase((e.target as any).avatar.files[0], '')
    }

    try {
      let updatedProduct = {
        name: (e.target as any).name.value,
        price: (e.target as any).price.value,
        avatar,
        categoryId: Number((e.target as any).categoryId.value),
        des: (e.target as any).des.value,
        brandId: Number((e.target as any).brandId.value),
      }
      setLoad(true)
      // validate
      if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.categoryId || !updatedProduct.brandId) {
        message.warning("Please fill all fields")
        setLoad(false)
        return
      }
      if (isNaN(parseFloat(updatedProduct.price)) || !isFinite(updatedProduct.price)) {
        message.warning("Please enter a valid number for the price")
        setLoad(false)
        return
      }
      if (updatedProduct.price < 0) {
        message.warning("Price must be greater than 0")
        setLoad(false)
        return
      }

      let pictures = []
      for (let i in picturesPreview) {
        if (picturesPreview[i].file) {
          let url = await uploadToFirebase(picturesPreview[i].file, '')
          pictures.push({
            url
          })
        } else {
          pictures.push({
            url: picturesPreview[i].url
          })
        }
      }

      await api.productApi.deletePics(updateData.product.id)
      let result = await api.productApi.updateData(updateData.product.id, {
        ...updatedProduct,
        pictures
      })

      if (result.status == 200) {
        Modal.success({
          title: "Notification",
          content: "Update product successfully!",
          onOk: () => {
            setLoad(false)
            dispatch(productAction.update(result.data.data));
            (e.target as any).name.value = "";
            (e.target as any).price.value = "";
            setPicturesPreview([]);
            (e.target as any).avatar.value = null;
            (e.target as any).categoryId.value = null;
            (e.target as any).brandId.value = null;
            setShowEdit(!showEdit)
          }
        })
      }
    } catch (err: any) {
      Modal.warning({
        title: 'Warning',
        content: `${err.response?.data?.err}`,
        onOk: () => {
          dispatch(productAction.loadModal())
        }
      })
    }
  }
  return (
    <div className='product_create_form'>
      {load && <Load />}
      <form onSubmit={(e) => {
        handleEditProduct(e)
      }} className='edit-form'>
        {/* Title */}
        <div className='btn_box'>
          <h2>Edit Product</h2>
          <button onClick={() => {
            setShowEdit(!showEdit)
          }} type='button' className='btn btn-danger'>X</button>
        </div>

        {/* Name */}
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Name</InputGroup.Text>
          <Form.Control
            placeholder="Product Name"
            name='name'
            defaultValue={updateData.product.name}
          />
        </InputGroup>

        {/* Price */}
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Price</InputGroup.Text>
          <Form.Control
            placeholder="Product Price"
            name='price'
            defaultValue={updateData.product.price}
          />
        </InputGroup>

        {/* Avatar */}
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Avatar</InputGroup.Text>
          <div className='input_avatar'>
            <img src={updateData.product.avatar} />
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

        Descripton
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Description</InputGroup.Text>
          <Form.Control
            as="textarea"
            placeholder="Description"
            name='des'
            defaultValue={updateData.product.des}
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
              message.warning("You can choose maximum 4 image")
              return
            }
            setPicturesPreview([...tempArr, ...picturesPreview])
          }} type="file" multiple max={4} ref={fileInputRef} />
        </Form.Group>

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
            <option value={updateData.product.category.id}>{updateData.product.category.title}</option>
            {
              categoryStore?.category?.map((item: any) => (
                <option key={Date.now() * Math.random()} value={item.id}>{item.title}</option>
              ))
            }
          </Form.Select>
        </InputGroup>

        {/* Brand */}
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "110px" }} id="basic-addon1">Brand</InputGroup.Text>
          <Form.Select name='brandId' aria-label="Default select example">
            <option value={updateData.product.brand.id}>{updateData.product.brand.title}</option>
            {
              brandStore?.data?.map(item => (
                <option key={Date.now() * Math.random()} value={item.id}>{item.title}</option>
              ))
            }
          </Form.Select>
        </InputGroup>
        {
          productStore.data?.map((product: any) => {
            if (product.status) {
              return (
                <button type='submit' className='btn btn-success'>Save</button>
              )
            }
          }
          )
        }
      </form>
    </div>
  )
}