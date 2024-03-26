import { createSlice } from "@reduxjs/toolkit"
import { Categories } from "./category.slice"
import { Brands } from "./brand.slice"

export type AvailableStatus = "active" | "inactive"

export type Product = {
    id: number
    name: string
    detail: string
    brand: Brands
    category: Categories
    avatar: string
    des: string
    pictures: string
    video: string
    categoryId: number
    price: string
    status: AvailableStatus
    quantity: number
    brandId: number
    promo :string
}

interface InitState {
    data: Product[] | null
    addModal: boolean
}
const initialState: InitState = {
    data: null,
    addModal: false
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.data = action.payload
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        addData: (state:any, action) => {
            state.data.push(action.payload)
        },
        update: (state: any, action) => {
            state.data = state.data.map((item: any) => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    }
})
export const productReducer = productSlice.reducer
export const productAction = productSlice.actions