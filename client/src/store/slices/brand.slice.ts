import { createSlice } from "@reduxjs/toolkit"

export type AvailableStatus = "active" | "inactive"

export type Brand = {
    title: any;
    id: number;
    name: string;
    codeName: string;
    createAt: string;
    updateAt: String;
    status: AvailableStatus

}

interface InitState {
    data: Brand[] | null
    addModal: boolean
}
const initialState: InitState = {
    data: null,
    addModal: false
}
const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        update: (state: any, action) => {
            state.data = state.data.map((item: any) => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
        addData: (state: any, action) => {
            state.data.unshift(action.payload)
        },
    }
})
export const brandAction = brandSlice.actions
export const brandReducer = brandSlice.reducer

