import { createSlice } from "@reduxjs/toolkit"
import { Category } from "./category.slice"
import { Brand } from "./brand.slice"

export type AvailableStatus = "active" | "inactive"

export type Product = {
    quantity: any
    category: Category
    brand: Brand
    id: number
    categoryId: number
    brandId: number
    avatar: string
    name: string
    price: number
    des: string
    status: AvailableStatus
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
    name: "category",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.data = action.payload
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        addData: (state: any, action) => {
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