import RouteSetup from "./router/RouteSetup"
import api from '@services/apis'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { receiptAction } from '@slices/receipt.slice'
import { productAction } from './store/slices/product.slice'
import { categoryAction } from '@slices/category.slice'
import { brandAction } from '@slices/brand.slice'
import { bannerAction } from "./store/slices/banner.slice"
import { userAction } from "./store/slices/user.slice"

export default function App() {
  const dispatch = useDispatch()

  // authen
  useEffect(() => {
    if (!localStorage.getItem("token")) return
    try {
      api.userApi.decodeToken((localStorage.getItem("token") as any))
        .then(res => {
          dispatch(userAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err)
          localStorage.removeItem("token")
          dispatch(userAction.setData(null))
        })
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token")
      dispatch(userAction.setData(null))
    }
  }, [])

  // banner
  useEffect(() => {
    try {
      api.bannerApi.findMany()
        .then(async (res) => {
          dispatch(bannerAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err)
    }
  }, [])

  // category
  useEffect(() => {
    try {
      api.categoryApi.findMany()
        .then(res => {
          console.log('cate', res.data.data);
          dispatch(categoryAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  // brand
  useEffect(() => {
    try {
      api.brandApi.findMany()
        .then(res => {
          dispatch(brandAction.setData(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])

  // product
  useEffect(() => {
    try {
      api.productApi.findMany()
        .then(async (res) => {
          console.log('pro', res.data.data);

          dispatch(productAction.setProduct(res.data.data))
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err)
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
    <RouteSetup />
  )
}


